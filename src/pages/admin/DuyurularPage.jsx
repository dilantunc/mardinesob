import React, { useState } from 'react';

const duyuruOption = {
  label: "Duyurular",
  collection: "duyurular",
  fields: [
    { id: "baslik", label: "Başlık" },
    { id: "ozet", label: "Özet" },
    { id: "detay", label: "Detay" },
  ],
};

const DuyurularPage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <ContentArea
      selectedOption={duyuruOption}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
    />
  );
};

export default DuyurularPage;
