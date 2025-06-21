import React, { useState } from 'react';
import { Container } from 'reactstrap';
import Navbar_admin from './Navbar-admin';
import ContentArea from './ContentArea';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#f8f9fa", marginTop:" -160px" }}>
      <Navbar_admin
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setSelectedRow={setSelectedRow}
      />

      {/* Ana içerik */}
      <Container className="mt-4">
        <ContentArea
          selectedOption={selectedOption}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      </Container>
    </div>
  );
};

export default Dashboard;
