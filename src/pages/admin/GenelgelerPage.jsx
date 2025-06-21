import React, { useState, useEffect } from "react";
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Input, Form, FormGroup, Label, FormFeedback, Alert, Fade, Spinner,
} from "reactstrap";
import axios from "axios";
import { db } from "../../../firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL;

const GenelgelerPage = () => {
  const [docs, setDocs] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [alertMessage, setAlertMessage] = useState({ text: "", type: "", visible: false });

  const isFormValid = title && description && pdfFile && !errors.pdfFile;

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, "Genelgeler"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name,
        subject: doc.data().subject,
        fileUrl: doc.data().url,
        createdAt: doc.data().createdAt?.toDate?.()
          ? new Date(doc.data().createdAt.toDate()).toLocaleString("tr-TR")
          : "Tarih yok"
      }));
      setDocs(data);
    } catch (err) {
      console.error(err);
      showAlert("Genelgeler yüklenemedi", "danger");
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
    if (!pdfFile) newErrors.pdfFile = "PDF dosyası gerekli";
    else if (pdfFile.type !== "application/pdf")
      newErrors.pdfFile = "Sadece PDF dosyası yüklenebilir";
    else if (pdfFile.size > 10 * 1024 * 1024)
      newErrors.pdfFile = "Maksimum boyut 10MB";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("name", title);
    formData.append("subject", description);
    formData.append("type", "genelge");

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      if (res.data.success) {
        showAlert("Genelge yüklendi", "success");
        resetForm();
        setIsModalOpen(false);
        fetchDocs();
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

  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/delete`, {
        data: { fileUrl, type: "genelge" },
      });
      showAlert("Silindi", "success");
      fetchDocs();
    } catch (err) {
      console.error(err);
      showAlert("Silme hatası", "danger");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPdfFile(null);
    setErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);

    if (file && file.type !== "application/pdf") {
      setErrors(prev => ({ ...prev, pdfFile: "Sadece PDF dosyası yüklenebilir" }));
    } else if (file && file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, pdfFile: "Dosya 10MB'dan büyük" }));
    } else {
      setErrors(prev => ({ ...prev, pdfFile: "" }));
    }
  };

  return (
    <div className="p-4" style={{ marginTop: "-130px" }}>
      <h2>Genelgeler</h2>

      {alertMessage.visible && (
        <Fade in={alertMessage.visible} timeout={300}>
          <Alert color={alertMessage.type} fade={false}>
            {alertMessage.text}
          </Alert>
        </Fade>
      )}
      <Button color="success" onClick={() => setIsModalOpen(true)}>
        Yeni Genelge Ekle
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
              <th>Başlık</th>
              <th>Açıklama</th>
              <th>Dosya</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {docs.length ? docs.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.subject}</td>
                <td>
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                    PDF Görüntüle
                  </a>
                </td>
                <td>{item.createdAt}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => handleDelete(item.id, item.fileUrl)}>
                    Sil
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center">Genelge yok</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setIsModalOpen(false)}>Yeni Genelge Ekle</ModalHeader>
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
              <Label>PDF Dosyası *</Label>
              <Input type="file" accept="application/pdf" onChange={handleFileChange} invalid={!!errors.pdfFile} />
              <FormFeedback>{errors.pdfFile}</FormFeedback>
              {pdfFile && (
                <p className="mt-2">{pdfFile.name}</p>
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

export default GenelgelerPage;
