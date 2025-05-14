import React, { useState } from 'react';
import ContentArea from './ContentArea';

const odalarOption = {
  label: "ODALAR",
  collection: "odalar",
  fields: [
    { id: "ODA", label: "Oda Adı" },
    { id: "BAŞKAN", label: "Başkan" },
    { id: "TELEFON", label: "Telefon" },
    { id: "ADRES", label: "Adres" },
  ],
};

const OdalarPage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <ContentArea
      selectedOption={odalarOption}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
    />
  );
};

export default OdalarPage;
