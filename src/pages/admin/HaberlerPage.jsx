import React, { useState, useEffect } from "react";
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Input, Form, FormGroup, Label, FormFeedback, Alert,Fade, Spinner,
} from "reactstrap";
import axios from "axios";
import { db } from "../../../firebase-config";
import {
  collection, getDocs, query, orderBy
} from "firebase/firestore";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL;

const HaberlerPage = () => {
  const [news, setNews] = useState([]);
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [alertMessage, setAlertMessage] = useState({ text: "", type: "", visible: false });

  const isFormValid = title && description && image && !errors.image;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, "Haberler"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name,
        subject: doc.data().subject,
        imageUrl: doc.data().url,
        createdAt: doc.data().createdAt?.toDate?.()
          ? new Date(doc.data().createdAt.toDate()).toLocaleString("tr-TR")
          : "Tarih yok"
      }));
      setNews(data);
    } catch (err) {
      console.error(err);
      showAlert("Haberler yüklenemedi", "danger");
    } finally {
      setIsFetching(false);
    }
  };

  const showAlert = (text, type = "info") => {
    setAlertMessage({ text, type, visible: true });
    setTimeout(() => setAlertMessage({ text: "", type: "", visible: false }), 4000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Başlık gerekli";
    if (!description.trim()) newErrors.description = "Açıklama gerekli";
    if (!image) newErrors.image = "Resim gerekli";
    else if (!image.type.match(/image\/(jpeg|jpg|png|gif)/))
      newErrors.image = "Geçersiz dosya türü";
    else if (image.size > 5 * 1024 * 1024)
      newErrors.image = "Maksimum boyut 5MB";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", title);
    formData.append("subject", description);
    formData.append("type", "haber");

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      if (res.data.success) {
        showAlert("Haber yüklendi", "success");
        resetForm();
        setIsModalOpen(false);
        fetchNews();
      } else {
        showAlert("Yükleme başarısız", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert("Sunucu hatası", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/delete`, {
        data: { fileUrl: imageUrl, type: "haber" },
      });

      showAlert("Silindi", "success");
      fetchNews();
    } catch (err) {
      console.error(err);
      showAlert("Silme hatası", "danger");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file && !file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setErrors(prev => ({ ...prev, image: "Geçersiz dosya türü" }));
    } else if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Dosya 5MB'dan büyük" }));
    } else {
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  return (
    <div className="p-4" style={{ marginTop: "-130px" }}>
      <h2>Haberler</h2>

      {alertMessage.visible && (
        <Fade in={alertMessage.visible} timeout={300}>
          <Alert color={alertMessage.type} fade={false}>
            {alertMessage.text}
          </Alert>
        </Fade>
      )}
      <Button color="success" onClick={() => setIsModalOpen(true)}>
        Yeni Haber Ekle
      </Button>

      {isFetching ? (
        <div className="text-center mt-5">
          <Spinner color="primary" />
          <p>Yükleniyor...</p>
        </div>
      ) : (
        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Resim</th>
              <th>Başlık</th>
              <th>Açıklama</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {news.length ? news.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>
                  <img src={item.imageUrl} alt="Haber" style={{ height: 80 }} />
                </td>
                <td>{item.title}</td>
                <td>{item.subject}</td>
                <td>{item.createdAt}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => handleDelete(item.id, item.imageUrl)}>
                    Sil
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center">Haber yok</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setIsModalOpen(false)}>Yeni Haber Ekle</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Başlık *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} invalid={!!errors.title} />
              <FormFeedback>{errors.title}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Açıklama *</Label>
              <Input
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                invalid={!!errors.description}
              />
              <FormFeedback>{errors.description}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Resim *</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} invalid={!!errors.image} />
              <FormFeedback>{errors.image}</FormFeedback>
              {image && (
                <img src={URL.createObjectURL(image)} alt="preview" className="mt-2" style={{ maxHeight: 200 }} />
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpload} disabled={isLoading || !isFormValid}>
            {isLoading ? <Spinner size="sm" /> : "Kaydet"}
          </Button>
          <Button color="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }} disabled={isLoading}>
            İptal
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default HaberlerPage;
