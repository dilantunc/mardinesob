import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Spinner, Button } from "reactstrap";

const HaberDetay = () => {
  const { id } = useParams();
  const [haber, setHaber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHaber = async () => {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "Haberler", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          console.log(data);
          setHaber({
            ...data,
            createdAt: data.createdAt?.toDate
              ? format(data.createdAt.toDate(), "dd MMMM yyyy", { locale: tr })
              : "Tarih bilgisi yok",
              imageUrl: data.url || "",  
          });
        } else {
          setHaber(null);
          setError("Haber bulunamadı.");
        }
      } catch (err) {
        console.error("Haber alınamadı:", err);
        setError("Haber alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchHaber();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spinner color="primary" /> Yükleniyor...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );

  if (!haber)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Haber bulunamadı.
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{haber.name}</h1>
      <div style={styles.date}>{haber.createdAt}</div>

      {/* Eğer imageUrl varsa göster */}
      {haber.imageUrl ? (
        <img
          src={haber.imageUrl}
          alt={haber.name}
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/900x500?text=Görsel+yüklenemedi";
          }}
        />
      ) : (
        <div
          style={{
            ...styles.image,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eee",
            color: "#888",
            fontSize: "18px",
          }}
        >
          Görsel bulunamadı
        </div>
      )}

      <div style={styles.content}>
        <p>{haber.subject}</p>
      </div>

      <div style={styles.share}>
        <Button color="primary" size="sm" style={styles.shareButton}>
          Facebook
        </Button>
        <Button color="info" size="sm" style={styles.shareButton}>
          Twitter
        </Button>
      </div>
    </div>
  );
};

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
  share: {
    marginTop: "20px",
    textAlign: "center",
  },
  shareButton: {
    margin: "0 10px",
    padding: "5px 10px",
    fontSize: "14px",
  },
};

export default HaberDetay;
