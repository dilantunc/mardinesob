import React from "react";
import { Container, Card, CardBody, CardTitle, CardText, Button } from "reactstrap";

const Kanunlar = () => {
  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center">
      <Card className="shadow history-card" style={{ maxWidth: '900px', width: '100%' }}>
        <CardBody>
          <CardTitle tag="h2" className="mb-4 text-center history-title">
            5362 Sayılı Esnaf ve Sanatkârlar Meslek Kuruluşları Kanunu
          </CardTitle>
          
          
          <div className="d-flex justify-content-center">
            <Button
              color="primary"
              href="https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5362&MevzuatTur=1&MevzuatTertip=5"
              target="_blank"
              className="px-5 py-3"
            >
              Kanunu Görüntüle
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Kanunlar;