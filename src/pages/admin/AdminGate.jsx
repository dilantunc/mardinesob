import React, { useRef } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const AdminGate = () => {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (username === "admin" && password === "admin") {
            alert("Giriş Başarılı");
            localStorage.setItem("isLoggedIn", "true");  // Giriş bilgisi kaydedildi
            window.location.href = "/admin-esob-2025/anasayfa";  // Anasayfaya yönlendir
        } else {
            alert("Kullanıcı adı veya şifre hatalı!");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow">
                        <CardBody>
                            <CardTitle tag="h1" className="text-center mb-4" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                                Admin Girişi
                            </CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="username">Kullanıcı Adı</Label>
                                    <Input
                                        type="text"
                                        id="username"
                                        placeholder="Kullanıcı Adı"
                                        innerRef={usernameRef}
                                        style={{ padding: '12px', borderRadius: '4px' }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Şifre</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="Şifre"
                                        innerRef={passwordRef}
                                        style={{ padding: '12px', borderRadius: '4px' }}
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                    block
                                    style={{ padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}
                                >
                                    Giriş Yap
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminGate;
