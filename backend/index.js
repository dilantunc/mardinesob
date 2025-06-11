import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Firebase admin initialization
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});
const db = admin.firestore();

// S3 Client setup for Cloudflare R2 or similar S3-compatible service
const s3 = new S3Client({
  region: 'auto', // R2 için auto region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { name, subject, type } = req.body;

  if (!file || !name || !subject || !type) {
    if (file?.path) fs.unlinkSync(file.path);
    return res.status(400).json({ error: 'Zorunlu alanlar eksik' });
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: 'Geçersiz dosya türü' });
  }

  const fileContent = fs.readFileSync(file.path);
  const fileName = `${Date.now()}-${path.basename(file.originalname)}`;

  try {
    // S3 upload
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: 'public-read', // Eğer erişim için gerekli ise
    });

    await s3.send(command);

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    const collectionName = type === 'haber' ? 'Haberler' : 'Genelgeler';

    // Firestore'a kaydet
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
    // Temp dosyayı sil
    fs.unlinkSync(file.path);
  }
});

// Delete endpoint
app.delete('/delete', async (req, res) => {
  const { fileUrl, type } = req.body;

  if (!fileUrl || !type) {
    return res.status(400).json({ error: 'Veri eksik' });
  }

  try {
    const fileName = fileUrl.split('/').pop();

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    }));

    const collectionName = type === 'haber' ? 'Haberler' : 'Genelgeler';

    const docs = await db.collection(collectionName).where('url', '==', fileUrl).get();
    const deletePromises = [];
    docs.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });
    await Promise.all(deletePromises);

    res.json({ success: true, message: 'Silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ error: 'Silme başarısız' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu http://0.0.0.0:${PORT} üzerinde çalışıyor`);
});
