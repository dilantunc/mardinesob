import React, { useState } from 'react';
import ContentArea from './ContentArea';

const yonetimOption = {
  label: "Yönetim",
  collection: "Yonetim",
  fields: [
    { id: "isim", label: "isim" },
    { id: "kurul", label: "kurul" },
    { id: "unvan", label: "unvan" },
  ],
};

const YonetimPage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <ContentArea
      selectedOption={yonetimOption}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
    />
  );
};

export default YonetimPage;


