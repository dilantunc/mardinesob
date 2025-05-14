import React from "react";
import { Container, Card, CardBody, CardTitle, Button, ListGroup, ListGroupItem, Badge } from "reactstrap";

const MevzuatPage = () => {
  // Yönetmelik verileri
  const yonetmelikler = [
    {
      id: 1,
      baslik: "Esnaf ve Sanatkârlar Odaları Birliği Disiplin Kurulu Yönetmeliği",
      link: "https://www.resmigazete.gov.tr/eskiler/2023/12/20231214-4.htm",
    },
    {
      id: 2,
      baslik: "Personel Yönetmeliği",
      link: "https://www.tesk.org.tr/resimler/TÜRKİYE%20ESNAF%20VE%20SANATKARLARI%20PERSONEL%20YÖNETMELİĞİ4.pdf",
    },
    {
      id: 3,
      baslik: "Türkiye Esnaf ve Sanatkarları Konfederasyonu Teftiş Kurulu Yönetmeliği",
      link: "https://www.tesk.org.tr/resimler/TÜRKİYE%20ESNAF%20VE%20SANATKARLARI%20TEFTİŞ%20KURULU%20YÖNETMELİĞİ5.pdf",
    
    },
  ];

  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center">
      <Card className="shadow history-card" style={{ maxWidth: '900px', width: '100%' }}>
        <CardBody>
          <CardTitle tag="h2" className="mb-4 text-center history-title">
            Yönetmelikler 
          </CardTitle>
          
          <div className="d-flex flex-column gap-3">
            <ListGroup flush>
              {yonetmelikler.map((yonetmelik) => (
                <ListGroupItem key={yonetmelik.id} className="py-3 px-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ flex: 1 }}>
                      <h5 className="mb-2">{yonetmelik.baslik}</h5>
                    </div>
                    <Button 
                      color={yonetmelik.id === 1 ? "primary" : yonetmelik.id === 2 ? "success" : "secondary"} 
                      onClick={() => window.open(yonetmelik.link, "_blank")}
                      size="sm"
                      className="ms-3"
                      disabled={!yonetmelik.link || yonetmelik.link === "#"}
                    >
                      Görüntüle
                    </Button>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default MevzuatPage;