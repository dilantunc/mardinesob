import React from "react";
import { Container, Card, CardBody, CardTitle, CardText, Button, ListGroup, ListGroupItem, Badge } from "reactstrap";

const Tebligler = () => {
  // Tebliğ verileri
  const tebligler = [
    {
      id: 1,
      baslik: "Esnaf ve Sanatkâr Odaları Arasında veya Esnaf ve Sanatkâr Odaları İle Türkiye Odalar ve Borsalar Birliği Bünyesindeki Odalar Arasında Üye Kayıt Zorunluluğu Bakımından Çıkacak Anlaşmazlıkları Çözümlemek Üzere Oluşturulan Mutabakat Komitelerinin Çalışma",
      link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=24588&MevzuatTur=9&MevzuatTertip=5",
    },
    {
      id: 2,
      baslik: " Esnaf ve Sanatkârların Kayıt Olacakları Odaların Tespiti Hakkında Tebliğ ( 1 Ağustos 2019 tarih ve 30849 Sayılı R.G.)",
      link: "https://www.resmigazete.gov.tr/eskiler/2019/08/20190801-8.htm",
    },
    {
      id: 3,
      baslik: "Esnaf ve Sanatkârlar Meslek Kuruluşlarında Denetim Kurullarının Çalışma usulü ve düzenlenecek Raporlar hakkında tebliğ 20 Kasım 2015",
      link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=21264&MevzuatTur=9&MevzuatTertip=5",
    },
    {
      id: 4,
      baslik: "Esnaf ve sanatkârlar odalarındaki üye Kayıtlarına dair tebliğ 9 Aralık 2013",
      link: "https://www.resmigazete.gov.tr/eskiler/2013/12/20131209.htm",
    }
  ];

  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center">
      <Card className="shadow history-card" style={{ maxWidth: '900px', width: '100%' }}>
        <CardBody>
          <CardTitle tag="h2" className="mb-4 text-center history-title">
            Tebliğler 
          </CardTitle>
        

          <div className="d-flex flex-column gap-3">
            {/* Tebliğ Listesi */}
            <ListGroup flush>
              {tebligler.map((teblig) => (
                <ListGroupItem key={teblig.id} className="py-3 px-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ flex: 1 }}>
                      <h5 className="mb-2">{teblig.baslik}</h5>
    
                    </div>
                    <Button 
                      color="primary" 
                      onClick={() => window.open(teblig.link, "_blank")}
                      size="sm"
                      className="ms-3"
                      disabled={!teblig.link || teblig.link === "#"}
                    >
                      Detay
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

export default Tebligler;