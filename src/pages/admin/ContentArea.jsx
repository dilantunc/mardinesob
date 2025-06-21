import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label
} from 'reactstrap';
import { db } from '../../../firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ContentArea = ({
  selectedOption,
  selectedRow,
  setSelectedRow,
  isModalOpen,
  setIsModalOpen,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      alert("Lütfen giriş yapınız!");
      navigate("/admin-esob-2025/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedOption) {
      fetchData(selectedOption.collection);
    }
  }, [selectedOption]);

 const fetchData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
const docs = querySnapshot.docs.map((doc) => {
  const docData = doc.data();
  const rawTarih = docData.tarih;

  let formattedTarih = "Tarih yok";
  if (rawTarih && typeof rawTarih.toDate === "function") {
    formattedTarih = rawTarih.toDate().toLocaleString("tr-TR");
  }

  return {
    id: doc.id,
    ...docData,
    tarih: formattedTarih
  };
});

    setData(docs);
  } catch (error) {
    console.error('Veri çekme hatası:', error);
  }
};
  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, selectedOption.collection, id));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, selectedOption.collection, selectedRow.id);
      const { tarih, id, ...fieldsToUpdate } = selectedRow;
      await updateDoc(docRef, fieldsToUpdate);
      setData(data.map((item) => (item.id === selectedRow.id ? selectedRow : item)));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const docRef = await addDoc(collection(db, selectedOption.collection), {
        ...newRow,
        tarih: serverTimestamp()
      });
      setData([...data, { id: docRef.id, ...newRow, tarih: new Date().toLocaleString("tr-TR") }]);
      setNewRow({});
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Ekleme hatası:', error);
    }
  };

  const renderModalFields = () => {
    if (!selectedOption || !selectedRow) return null;

    return selectedOption.fields.map((field) => (
      <FormGroup key={field.id}>
        <Label for={field.id}>{field.label}</Label>
        <Input
          id={field.id}
          value={selectedRow[field.id] || ''}
          onChange={(e) => setSelectedRow({ ...selectedRow, [field.id]: e.target.value })}
        />
      </FormGroup>
    ));
  };

  const renderAddModalFields = () => {
    if (!selectedOption) return null;

    return selectedOption.fields.map((field) => (
      <FormGroup key={field.id}>
        <Label for={`new-${field.id}`}>{field.label}</Label>
        <Input
          id={`new-${field.id}`}
          value={newRow[field.id] || ''}
          onChange={(e) => setNewRow({ ...newRow, [field.id]: e.target.value })}
        />
      </FormGroup>
    ));
  };

  if (!selectedOption) return null;

  return (
    <>
      <h2 className="mb-4">{selectedOption.label}</h2>

      <Button color="success" className="mb-3" onClick={() => setIsAddModalOpen(true)}>
        Yeni Veri Ekle
      </Button>

      <Table bordered hover responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            {selectedOption.fields.map((field) => (
              <th key={field.id}>{field.label}</th>
            ))}
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              {selectedOption.fields.map((field) => (
                <td key={`${row.id}-${field.id}`}>{row[field.id] || '-'}</td>
              ))}
              <td>
                <Button color="warning" size="sm" className="me-2" onClick={() => handleEdit(row)}>
                  Düzenle
                </Button>
                <Button color="danger" size="sm" onClick={() => handleDelete(row.id)}>
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
          {selectedOption.label} Bilgilerini Düzenle
        </ModalHeader>
        <ModalBody>{renderModalFields()}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>Kaydet</Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isAddModalOpen} toggle={() => setIsAddModalOpen(!isAddModalOpen)}>
        <ModalHeader toggle={() => setIsAddModalOpen(!isAddModalOpen)}>
          Yeni {selectedOption.label} Ekle
        </ModalHeader>
        <ModalBody>{renderAddModalFields()}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAdd}>Ekle</Button>
          <Button color="secondary" onClick={() => setIsAddModalOpen(false)}>İptal</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ContentArea;
