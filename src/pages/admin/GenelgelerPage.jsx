// FRONTEND DÜZELTME - GenelgelerPage.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Alert,
  Spinner
} from "reactstrap";
import axios from "axios";
import { db } from "../../../firebase-config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GenelgelerPage = () => {
  const [generalFiles, setGeneralFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [circularName, setCircularName] = useState("");
  const [circularSubject, setCircularSubject] = useState("");
  const [errors, setErrors] = useState({
    circularName: "",
    circularSubject: "",
    file: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [alertMessage, setAlertMessage] = useState({ text: "", type: "", visible: false });

  const isFormValid = circularName && circularSubject && file && !errors.file;

  useEffect(() => {
    fetchGeneralFiles();
  }, []);

  const fetchGeneralFiles = async () => {
    setIsFetching(true);
    try {
      // Tarihe göre sıralama ekledik
      const q = query(collection(db, "Genelgeler"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Timestamp'i okunabilir formata çevir
        createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleString("tr-TR") : "Tarih bilgisi yok"
      }));
      setGeneralFiles(files);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      showAlert("Genelgeler yüklenirken bir hata oluştu", "danger");
    } finally {
      setIsFetching(false);
    }
  };

  const showAlert = (text, type = "info") => {
    setAlertMessage({ text, type, visible: true });
    setTimeout(() => {
      setAlertMessage({ text: "", type: "", visible: false });
    }, 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!circularName.trim()) {
      newErrors.circularName = "Genelge ismi zorunludur";
    } else if (circularName.length > 100) {
      newErrors.circularName = "Genelge ismi 100 karakterden uzun olamaz";
    }

    if (!circularSubject.trim()) {
      newErrors.circularSubject = "Genelge konusu zorunludur";
    } else if (circularSubject.length > 200) {
      newErrors.circularSubject = "Genelge konusu 200 karakterden uzun olamaz";
    }

    if (!file) {
      newErrors.file = "PDF dosyası seçmelisiniz";
    } else if (file.type !== "application/pdf") {
      newErrors.file = "Sadece PDF dosyaları kabul edilir";
    } else if (file.size > 10 * 1024 * 1024) { // 10MB limit
      newErrors.file = "Dosya boyutu 10MB'ı geçemez";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setErrors(prev => ({...prev, file: "Sadece PDF dosyaları kabul edilir"}));
    } else if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setErrors(prev => ({...prev, file: "Dosya boyutu 10MB'ı geçemez"}));
    } else {
      setErrors(prev => ({...prev, file: ""}));
    }
  };

  const handleUpload = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", circularName);
    formData.append("subject", circularSubject);
  
    try {
      // Backend'e yükleme isteği (düzeltilmiş URL)
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      showAlert("Genelge başarıyla yüklendi", "success");
      await fetchGeneralFiles();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      const errorMessage = error.response?.data?.error || "Dosya yüklenirken bir hata oluştu";
      setErrors(prev => ({...prev, file: errorMessage}));
      showAlert(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDelete = async (id, fileUrl) => {
    if (window.confirm("Bu genelgeyi silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`${API_BASE_URL}/delete`, {
          data: { fileUrl },
        });
  
        await deleteDoc(doc(db, "Genelgeler", id));
        showAlert("Genelge başarıyla silindi", "success");
        await fetchGeneralFiles();
      } catch (error) {
        console.error("Silme hatası:", error);
        showAlert("Genelge silinirken bir hata oluştu", "danger");
      }
    }
  };
  const resetForm = () => {
    setCircularName("");
    setCircularSubject("");
    setFile(null);
    setErrors({
      circularName: "",
      circularSubject: "",
      file: ""
    });
  };

  return (
    <div className="p-4" style={{marginTop:"-130px"}}>
      <h2 className="mb-4">Genelgeler</h2>

      {alertMessage.visible && (
        <Alert color={alertMessage.type} className="mb-4" toggle={() => 
          setAlertMessage(prev => ({...prev, visible: false}))
        }>
          {alertMessage.text}
        </Alert>
      )}

      <Button
        color="success"
        className="mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Yeni Genelge Ekle
      </Button>

      {/* Genelgeler Listesi */}
      {isFetching ? (
        <div className="text-center my-5">
          <Spinner color="primary" />
          <p className="mt-2">Genelgeler yükleniyor...</p>
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Adı</th>
              <th>Konu</th>
              <th>Url</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {generalFiles.length > 0 ? (
              generalFiles.map((file, index) => (
                <tr key={file.id}>
                  <td>{index + 1}</td>
                  <td>{file.name}</td>
                  <td>{file.subject}</td>
                  <td>{file.url}</td>
                  <td>{file.createdAt}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        tag="a"
                        href={file.url}
                        target="_blank"
                      >
                        Görüntüle
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(file.id, file.url)}
                      >
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Henüz genelge eklenmemiş
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Dosya Yükleme Modalı */}
      <Modal isOpen={isModalOpen} toggle={() => {
        setIsModalOpen(!isModalOpen);
        resetForm();
      }}>
        <ModalHeader toggle={() => {
          setIsModalOpen(!isModalOpen);
          resetForm();
        }}>
          Yeni Genelge Ekle
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="circularName">Genelge İsmi *</Label>
              <Input
                type="text"
                id="circularName"
                placeholder="Genelge ismini giriniz"
                value={circularName}
                onChange={(e) => setCircularName(e.target.value)}
                invalid={!!errors.circularName}
              />
              <FormFeedback>{errors.circularName}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="circularSubject">Genelge Konusu *</Label>
              <Input
                type="text"
                id="circularSubject"
                placeholder="Genelge konusunu giriniz"
                value={circularSubject}
                onChange={(e) => setCircularSubject(e.target.value)}
                invalid={!!errors.circularSubject}
              />
              <FormFeedback>{errors.circularSubject}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="circularFile">Dosya (PDF) *</Label>
              <Input
                type="file"
                id="circularFile"
                accept=".pdf"
                onChange={handleFileChange}
                invalid={!!errors.file}
              />
              <FormFeedback>{errors.file}</FormFeedback>
              {file && (
                <small className="text-muted">
                  Seçilen dosya: {file.name}
                </small>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleUpload}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" /> Yükleniyor...
              </>
            ) : (
              "Yükle"
            )}
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            disabled={isLoading}
          >
            İptal
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GenelgelerPage;