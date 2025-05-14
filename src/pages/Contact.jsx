import React from "react";

export const Contact = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>İletişim Bilgileri</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <strong>Adres:</strong> Latifiye, 1. Cadde Altıntaş İş Merkezi D:41, 47100 Merkez/Mardin
        </li>
        <li style={styles.listItem}>
          <strong>Telefon:</strong> 0482 212 38 01
        </li>
        <li style={styles.listItem}>
          <strong>E-posta:</strong> info@kurumadi.com
        </li>
      </ul>

      <div style={styles.mapContainer}>
        <iframe
          title="Harita"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.2534749549814!2d40.73357869999999!3d37.312823099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400a88be55555555%3A0x37c8809f8addb2ff!2sMardin%20Esnaf%20ve%20Sanatkarlar%20Odalari%20Birligi!5e0!3m2!1sen!2str!4v1746466216530!5m2!1sen!2str" 
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: "10px", marginTop: "40px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9fafb",
    padding: "50px 20px",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "50px auto",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "30px",
    color: "#A78E6C",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "15px",
    lineHeight: "1.6",
  },
  mapContainer: {
    marginTop: "40px",
  },
};

export default Contact;
