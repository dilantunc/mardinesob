import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

const DuyuruDetay = () => {
  const { id } = useParams();
  const [duyuru, setDuyuru] = useState(null);

  useEffect(() => {
    const fetchDuyuru = async () => {
      try {
        const docRef = doc(db, "Duyurular", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDuyuru(docSnap.data());
        } else {
          console.log("Duyuru bulunamadı.");
        }
      } catch (error) {
        console.error("Duyuru alınırken hata:", error);
      }
    };

    fetchDuyuru();
  }, [id]);

  if (!duyuru) {
    return <div style={styles.loading}>Yükleniyor...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{duyuru.baslik}</h1>
      <div style={styles.date}>{duyuru.tarih}</div>
      <p style={styles.detail}>{duyuru.detay}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "60px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "10px",
  },
  date: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "20px",
  },
  detail: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#444",
  },
  loading: {
    textAlign: "center",
    padding: "100px 20px",
    fontSize: "18px",
    color: "#666",
  },
};

export default DuyuruDetay;
