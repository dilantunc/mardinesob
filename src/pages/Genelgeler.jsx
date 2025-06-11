import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import "./Genelgeler.css"

const Genelgeler = () => {
  const [genelgeler, setGenelgeler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenelgeler = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Genelgeler"));
        const data = querySnapshot.docs.map(doc => {
          const genelgeData = doc.data();
          return {
            id: doc.id,
            name: genelgeData.name || "İsimsiz Genelge",
            subject: genelgeData.subject || "Konu belirtilmemiş",
            url: genelgeData.url,
            createdAt: genelgeData.createdAt?.toDate()
              ? format(genelgeData.createdAt.toDate(), 'dd MMMM yyyy HH:mm', { locale: tr })
              : "Tarih bilgisi yok"
          };
        });
        setGenelgeler(data);
      } catch (error) {
        console.error("Genelgeler alınırken hata oluştu:", error);
        setError("Genelgeler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchGenelgeler();
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => window.location.reload()}>Tekrar Dene</button>
      </div>
    );
  }

  if (genelgeler.length === 0) {
    return <div className="empty">Henüz hiç genelge eklenmemiş</div>;
  }

  return (
    <div className="genelgeler-container">
      <h2>Genelgeler</h2>
      
      <div className="genelgeler-list">
        {genelgeler.map(genelge => (
          <div key={genelge.id} className="genelge-card">
            <h3>{genelge.name}</h3>
            <p className="date">{genelge.createdAt}</p>
            <p className="subject">{genelge.subject}</p>
            {genelge.url && (
              <a 
                href={genelge.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="view-button"
              >
                Dosyayı Görüntüle
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genelgeler;