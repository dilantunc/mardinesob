import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const formatFirestoreTimestamp = (timestamp) => {
  if (!timestamp) return "Tarih yok";
  if (typeof timestamp === "string") return timestamp;
  if (timestamp.toDate) return timestamp.toDate().toLocaleString("tr-TR");
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString("tr-TR");
  }
  return "Geçersiz tarih";
};

const Duyurular = ({ isHomePage = false }) => {
  const [duyurular, setDuyurular] = useState([]);

  useEffect(() => {
    fetchDuyurular();
  }, []);

  const addDuyuru = async (newDuyuru) => {
    try {
      await addDoc(collection(db, "Duyurular"), {
        baslik: newDuyuru.baslik,
        ozet: newDuyuru.ozet,
        detay: newDuyuru.detay,
        tarih: serverTimestamp(),
      });
      alert("Duyuru başarıyla eklendi!");
      fetchDuyurular(); // Listeyi yenile
    } catch (error) {
      console.error("Duyuru eklenirken hata oluştu:", error);
    }
  };

  const fetchDuyurular = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Duyurular"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tarih: formatFirestoreTimestamp(doc.data().tarih),
      }));
      setDuyurular(data);
    } catch (error) {
      console.error("Duyurular alınırken hata oluştu:", error);
    }
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Duyurular</h2>

      {!isHomePage && (
        <p style={styles.subHeader}>
          Tüm duyurularımız aşağıda listelenmiştir.
        </p>
      )}

      <div style={styles.duyuruList}>
        {(isHomePage ? duyurular.slice(0, 2) : duyurular).map((duyuru) => (
          <Link
            to={`/duyurular/${duyuru.id}`}
            key={duyuru.id}
            style={styles.card}
          >
            <h3 style={styles.title}>{duyuru.baslik}</h3>
            <p style={styles.summary}>
              {isHomePage ? duyuru.ozet : duyuru.detay}
            </p>
            {isHomePage && <span style={styles.readMore}>Devamını oku →</span>}
          </Link>
        ))}
      </div>

      {isHomePage && (
        <Link to="/duyurular" style={styles.viewAll}>
          Tüm Duyuruları Görüntüle →
        </Link>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  subHeader: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },
  duyuruList: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
    color: "#333",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
  date: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "8px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  summary: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.5",
  },
  readMore: {
    display: "inline-block",
    marginTop: "10px",
    color: "#007bff",
    fontWeight: "500",
  },
  viewAll: {
    display: "block",
    marginTop: "30px",
    textAlign: "center",
    color: "#007bff",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Duyurular;
