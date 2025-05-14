import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const Oda = () => {
  const { id } = useParams(); // URL'deki id
  const [oda, setOda] = useState(null);
  const odaRef = doc(db, "odalar", id);

  useEffect(() => {
    const fetchOda = async () => {
      try {
        const odaRef = doc(db, "odalar", id); // id ile firestore'dan çek
        const odaSnap = await getDoc(odaRef);
        if (odaSnap.exists()) {
          setOda(odaSnap.data());
        } else {
          console.log("Oda bulunamadı!");
        }
      } catch (error) {
        console.error("Oda çekilirken hata oluştu:", error);
      }
    };
    if (id) {
      fetchOda();
    }
  }, [id]);

  if (!oda) return <div style={styles.loading}>Yükleniyor...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Oda Bilgileri</h2>
      <h2 style={styles.odaTitle}>{oda.ODA}</h2>
      <h4 style={styles.baskan}>{oda.BASKAN}</h4>
      <p style={styles.text}>{oda.ADRES}</p>
      <p style={styles.text}>{oda.TELEFON}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f4f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: "24px",
    color: "#A78E6C",
    textAlign: "center",
    marginBottom: "20px",
  },
  odaTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
  },
  baskan: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
    marginBottom: "15px",
  },
  text: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    textAlign: "center",
    marginBottom: "10px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    color: "#333",
    marginTop: "50px",
  },
};

export default Oda;
