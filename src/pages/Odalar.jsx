import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../pages/Home.css";

const Odalar = () => {
  const [odalarlist, setOdalarList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOdalar = async () => {
      try {
        const odalarCollectionRef = collection(db, "odalar");
        const odalarSnapshot = await getDocs(odalarCollectionRef);
        const odalarData = odalarSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOdalarList(odalarData);
      } catch (error) {
        console.error("Error fetching odalar:", error);
      }
    };
    fetchOdalar();
  }, []);

  const odaSend = (id) => {
    navigate(`/oda/${id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Odalar</h1>
        <div style={styles.roomList}>
          {odalarlist.map((odalar) => (
            <div key={odalar.id} style={styles.roomCard} onClick={() => odaSend(odalar.id)}>
              <h2 style={styles.roomTitle}>{odalar.ODA}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9fafb",
    padding: "50px 20px",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
  },
  headerContainer: {
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "40px",
    letterSpacing: "-1px",
  },
  roomList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  roomCard: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    overflow: "hidden",
    textAlign: "center",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  roomCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 30px rgba(0, 0, 0, 0.15)",
  },
  roomTitle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
};

export default Odalar;
