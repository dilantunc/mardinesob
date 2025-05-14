import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Spinner, Button } from "reactstrap";

const HaberDetay = () => {
  const { id } = useParams(); // Parametre ile haber ID'sini alıyoruz.
  const [haber, setHaber] = useState(null);
  const [loading, setLoading] = useState(true);

  // Veriyi Firebase'den alıyoruz
  useEffect(() => {
    const fetchHaber = async () => {
      try {
        const ref = doc(db, "Haberler", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setHaber({
            ...data,
            createdAt: data.createdAt?.toDate
              ? format(data.createdAt.toDate(), "dd MMMM yyyy", { locale: tr })
              : "Tarih bilgisi yok",
          });
        }
      } catch (err) {
        console.error("Haber alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHaber();
  }, [id]);

  // Yükleniyor
  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}><Spinner color="primary" /> Yükleniyor...</div>;

  // Haber bulunamadı
  if (!haber) return <div style={{ textAlign: "center", padding: "50px" }}>Haber bulunamadı.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{haber.name}</h1>
      <div style={styles.date}>{haber.createdAt}</div>

      {/* Haber Görseli */}
      <img
        src={haber.imageUrl}
        alt={haber.name}
        style={styles.image}
      />

      {/* Haber İçeriği */}
      <div style={styles.content}>
        <p>{haber.subject}</p>
      </div>

     
      {/* Görseli Paylaşmak İçin Butonlar */}
      <div style={styles.share}>
        <Button color="primary" size="sm" style={styles.shareButton}>Facebook</Button>
        <Button color="info" size="sm" style={styles.shareButton}>Twitter</Button>
      </div>
    </div>
  );
};

// Stil objesi
const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  date: {
    fontSize: "14px",
    textAlign: "center",
    color: "#888",
    marginBottom: "20px",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "20px",
    objectFit: "cover",
    maxHeight: "500px",
  },
  content: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#555",
  },
  author: {
    marginTop: "30px",
    fontSize: "14px",
    color: "#444",
  },
  share: {
    marginTop: "20px",
    textAlign: "center",
  },
  shareButton: {
    margin: "0 10px",
    padding: "5px 10px",  // Küçük buton için padding
    fontSize: "14px",     // Küçük yazı boyutu
  }
};

export default HaberDetay;
