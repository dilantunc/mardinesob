import React, { useEffect, useState } from "react";
import "./Home.css";
import video from "../assets/mardin-video.mp4";
import Duyurular from "./Duyurular";
import Yonetim from "./Yonetim";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Haberler from "./Haberler";

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Yazı genişletme durumu

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    mesaj: "",
  });

  const kisi = {
    ad: "İsa Tunç",
    meslek: "Yönetim Kurulu Başkanı",
    hakkinda:
      "İsa Tunç, Mardin Esnaf ve Sanatkârlar Odaları Birliği (MESOB) Başkanıdır. Aynı zamanda Kızıltepe Marangozlar ve Mobilyacılar Odası Başkanlığı görevini de yürütmektedir. 2017 yılında MESOB başkanlığına seçilen Tunç, 2018'de yapılan genel kurulda da güven tazeleyerek görevine devam etmiştir. Başkanlığı süresince kurumsal yapının güçlendirilmesi, hizmet kalitesinin artırılması ve personelin uzmanlaşması gibi konulara öncelik vermiştir. Esnafın desteklenmesi gerektiğini sıkça vurgulayan Tunç, özellikle çıraklık ve ustalık eğitiminin önemine dikkat çekmiştir. Ayrıca sosyal girişimcilik projelerine destek vererek gençler ve kadınlar için fırsatlar oluşturmayı hedeflemiş, esnafa yönelik eğitim ve hibe destekleri konusunda çalışmalar yürütmüştür. Turizm dönemlerinde yapılan fahiş fiyat uygulamalarına karşı da net tavır almış ve esnafı Ahi ahlakıyla hareket etmeye çağırmıştır.",
    resim: "https://www.mardinlife.com/uploads/2024/05/13/tunc-mardin-de-firsatcilik-turizme-darbe-vuruyor-490438.jpg",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "iletisim"), {
        ad: formData.ad,
        email: formData.email,
        mesaj: formData.mesaj,
        tarih: new Date().toISOString(), // Mesajın gönderildiği tarih
      });

      alert("Mesajınız alınmıştır. Teşekkür ederiz!");
      setFormData({ ad: "", email: "", mesaj: "" }); // Formu sıfırla
    } catch (error) {
      console.error("Mesaj gönderilirken bir hata oluştu:", error);
      alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    const videoElement = document.getElementById("bg-video");
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error("Video oynatılamadı:", error);
      });
    }
  }, []);

  return (
    <>
      {/* Arka Plan Videosu */}
      <div className="video-container">
        <video id="bg-video" autoPlay muted loop className="bg-video">
          <source src={video} type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      </div>

      {/* Yönetim ve Duyurular */}
      <div
        className="yonetim-duyuru-wrapper"
        style={{
          display: "flex",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div className="yarim-kutu" style={{ flex: 1 }}>
          <div
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              padding: "25px",
              border: "1px solid #eaeaea",
              borderRadius: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: "25px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
              ":hover": {
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <img
              src={kisi.resim}
              alt={kisi.ad}
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #f5f5f5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <div
              style={{
                fontSize: "15px",
                maxHeight: "100%",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "6px",
                  color: "#2c3e50",
                  fontWeight: "600",
                }}
              >
                {kisi.ad}
              </h2>
              <h4
                style={{
                  fontSize: "16px",
                  marginBottom: "12px",
                  color: "#7f8c8d",
                  fontWeight: "500",
                }}
              >
                {kisi.meslek}
              </h4>
              <p
                style={{
                  lineHeight: 1.6,
                  color: "#555",
                  marginBottom: "15px",
                }}
              >
                {isExpanded
                  ? kisi.hakkinda
                  : `${kisi.hakkinda.substring(0, 150)}...`}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={toggleReadMore}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#3498db",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    ":hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  {isExpanded ? (
                    <>
                      <i
                        className="fas fa-chevron-up"
                        style={{ marginRight: "6px" }}
                      ></i>
                      Daha az göster
                    </>
                  ) : (
                    <>
                      <i
                        className="fas fa-chevron-down"
                        style={{ marginRight: "6px" }}
                      ></i>
                      Devamını oku
                    </>
                  )}
                </button>
                {isExpanded && (
                  <a
                    href="/kurumsal/yonetim"
                    style={{
                      color: "#3498db",
                      fontSize: "14px",
                      fontWeight: "500",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      ":hover": {
                        backgroundColor: "#f8f9fa",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <i
                      className="fas fa-users"
                      style={{ fontSize: "14px" }}
                    ></i>
                    Yönetim Sayfasına Git
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="yarim-kutu" style={{ flex: 1 }}>
          <Duyurular isHomePage={true} />
        </div>{" "}
      </div>

      {/* Haberler */}
      <div className="haberler-container">
        <Haberler isHomePage={true}/>
      </div>

      {/* İletişim Formu */}

      <div
        className="iletisim-kapsayici"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px", // Daha küçük bir gap değeri verildi
          padding: "40px",
          flexWrap: "wrap", // Mobilde alt alta görünmesini sağlamak için
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* İletişim Formu */}
        <div
          className="iletisim-formu"
          style={{
            flex: "1 1 48%", // Yatayda %48 genişlik
            maxWidth: "500px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Bize Ulaşın</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="ad"
              placeholder="Adınız"
              value={formData.ad}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta adresiniz"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <textarea
              name="mesaj"
              placeholder="Mesajınız"
              value={formData.mesaj}
              onChange={handleChange}
              rows="5"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Gönder
            </button>
          </form>
        </div>

        {/* Harita */}
        <div
          className="harita-iframe"
          style={{
            flex: "1 1 48%",
            maxWidth: "500px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <iframe
            title="Harita"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.2534749549814!2d40.73357869999999!3d37.312823099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400a88be55555555%3A0x37c8809f8addb2ff!2sMardin%20Esnaf%20ve%20Sanatkarlar%20Odalari%20Birligi!5e0!3m2!1sen!2str!4v1746466216530!5m2!1sen!2str"
            width="100%"
            height="400"
            style={{
              border: "0",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <p>&copy; 2025 Mardin Esnaf ve Sanatkarlar Odalar Birliği</p>
      </footer>
    </>
  );
};

export default Home;
