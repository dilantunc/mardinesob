import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const Haberler = ({ isHomePage = false }) => {
  const [haberler, setHaberler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHaberler = async () => {
      setLoading(true);
      setError(null);

      try {
        // Firestore sorgusunda direkt createdAt alanına göre sıralama yapıyoruz
        const colRef = collection(db, "Haberler");
        const q = query(colRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const haber = doc.data();
          return {
            id: doc.id,
            name: haber.name || "Başlıksız",
            subject: haber.subject || "",
            detay: haber.detay || "",
            createdAt: haber.createdAt?.toDate
              ? haber.createdAt.toDate()
              : null,
          };
        });

        // Eğer tarih yoksa en sona alalım
        data.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });

        setHaberler(isHomePage ? data.slice(0, 4) : data);
      } catch (err) {
        console.error("Haberler alınamadı:", err);
        setError("Haberler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchHaberler();
  }, [isHomePage]);

  if (loading) {
    return <div style={styles.loading}>Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>Tekrar Dene</button>
      </div>
    );
  }

  if (haberler.length === 0) {
    return <div style={styles.empty}>Henüz hiç haber eklenmemiş.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Haberler</h2>

      {!isHomePage && (
        <p style={styles.subHeader}>
          Tüm haberlerimiz aşağıda listelenmiştir.
        </p>
      )}

      <div style={styles.haberlerList}>
        {haberler.map((haber) => (
          <Link to={`/haberler/${haber.id}`} key={haber.id} style={styles.card}>
            <div style={styles.date}>
              {haber.createdAt
                ? format(haber.createdAt, "dd MMMM yyyy", { locale: tr })
                : "Tarih bilgisi yok"}
            </div>
            <h3 style={styles.title}>{haber.name}</h3>
            <p style={styles.summary}>{isHomePage ? haber.name : haber.subject}</p>
            {isHomePage && <span style={styles.readMore}>Devamını oku →</span>}
          </Link>
        ))}
      </div>

      {isHomePage && (
        <Link to="/bilgi-bankasi/haberler" style={styles.viewAll}>
          Tüm Haberleri Görüntüle →
        </Link>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
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
  haberlerList: {
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
    cursor: "pointer",
    overflow: "hidden",
    maxWidth: "100%",
    height: "auto",
    position: "relative",
  },
  date: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "8px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#000",
  },
  summary: {
    fontSize: "15px",
    color: "#000",
    lineHeight: "1.5",
    marginBottom: "10px",
  },
  readMore: {
    display: "inline-block",
    marginTop: "10px",
    color: "#3498db",
    fontWeight: "500",
  },
  viewAll: {
    display: "block",
    marginTop: "30px",
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
    textDecoration: "none",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    padding: "50px",
    color: "red",
  },
  empty: {
    textAlign: "center",
    padding: "50px",
    color: "#777",
  },
};

export default Haberler;
