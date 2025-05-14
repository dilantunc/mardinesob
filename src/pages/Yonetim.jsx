import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import './Yonetim.css';

const yonetimKurulu = [
  { isim: "Mehmet Olğaç", unvan: "Başkan Vekili" },
  { isim: "Hüseyin Gündoğdu", unvan: "Asil Üye" },
  { isim: "Murat Sara", unvan: "Asil Üye" },
  { isim: "Atman Elitaş", unvan: "Asil Üye" },
];

const denetimKurulu = [
  { isim: "Aziz Doğru", unvan: "Asil Üye" },
  { isim: "Zeynettin Ayav", unvan: "Asil Üye" },
  { isim: "Şeyhmus Gültekin", unvan: "Asil Üye" },
];

const disiplinKurulu = [
  { isim: "Şehmus Sayat", unvan: "Asil Üye" },
  { isim: "Mahmut Aba", unvan: "Asil Üye" },
  { isim: "Sinan Tunç", unvan: "Asil Üye" },
];

const idariKadro = [
  { isim: "Emrah Kaya", unvan: "Genel Sekreter" },
  { isim: "Mehmet Hakan Kumaç", unvan: "Sicil Müdürü" },
  { isim: "Evin Uygur", unvan: "Sicil Müdür Yardımcısı" },
  { isim: "Emrullah Ekin", unvan: "Muhasebeci" },
  { isim: "Fidan Tural", unvan: "Birlik Personeli" },
];

const KurulCard = ({ title, data }) => (
  <Card className="mb-4 kurul-card">
    <CardBody>
      <CardTitle tag="h3" className="kurul-title">{title}</CardTitle>
      <div className="uyeler-listesi">
        {data.map((uye, idx) => (
          <div key={idx} className="uye-item">
            <div className="uye-isim">{uye.isim}</div>
            <div className="uye-unvan">{uye.unvan}</div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const Yonetim = () => (
  <Container className="yonetim-container">
    <div className="page-header">
      <h1 className="page-title">Yönetim Kadromuz</h1>
      <p className="page-subtitle">Birlikte çalıştığımız değerli ekip üyelerimiz</p>
    </div>
    
    <Row>
      <Col lg="6">
        <KurulCard title="Yönetim Kurulu" data={yonetimKurulu} />
      </Col>
      <Col lg="6">
        <KurulCard title="Denetim Kurulu" data={denetimKurulu} />
      </Col>
    </Row>
    
    <Row>
      <Col lg="6">
        <KurulCard title="Disiplin Kurulu" data={disiplinKurulu} />
      </Col>
      <Col lg="6">
        <KurulCard title="İdari Kadro" data={idariKadro} />
      </Col>
    </Row>
  </Container>
);

export default Yonetim;