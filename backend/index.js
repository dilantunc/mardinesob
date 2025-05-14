import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();
const app = express();
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { name, subject, type } = req.body;

  if (!file || !name || !subject || !type) {
    fs.unlinkSync(file?.path ?? '');
    return res.status(400).json({ error: 'Zorunlu alanlar eksik' });
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: 'Geçersiz dosya türü' });
  }

  const fileContent = fs.readFileSync(file.path);
  const fileName = Date.now() + '-' + file.originalname;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    const collectionName = type === 'haber' ? 'Haberler' : 'Genelgeler';

    await db.collection(collectionName).add({
      url: fileUrl,
      name,
      subject,
      type: file.mimetype,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error('Yükleme hatası:', err);
    res.status(500).json({ error: 'Yükleme başarısız' });
  } finally {
    fs.unlinkSync(file.path);
  }
});

app.delete('/delete', async (req, res) => {
  const { fileUrl, type } = req.body;

  if (!fileUrl || !type) return res.status(400).json({ error: 'Veri eksik' });

  try {
    const fileName = fileUrl.split('/').pop();

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    }));

    const collectionName = type === 'haber' ? 'Haberler' : 'Genelgeler';
    const docs = await db.collection(collectionName).where('url', '==', fileUrl).get();
    docs.forEach(async (doc) => await doc.ref.delete());

    res.json({ success: true, message: 'Silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ error: 'Silme başarısız' });
  }
});

app.listen(5000, () => console.log('Sunucu http://localhost:5000 üzerinde çalışıyor'));
