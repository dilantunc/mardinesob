import React from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';

const options = [
  {
    label: "Yönetim",
    collection: "Yonetim",
    fields: [
      { id: "isim", label: "İsim" },
      { id: "kurul", label: "Soyisim" },
      { id: "unvan", label: "Ünvan" },
    ],
  },
  {
    label: "Odalar",
    collection: "odalar",
    fields: [
      { id: "ADRES", label: "Adres" },
      { id: "BAŞKAN", label: "Başkan" },
      { id: "TELEFON", label: "Telefon" },
    ],
  },
  {
    label: "Duyurular",
    collection: "Duyurular",
    fields: [
      { id: "baslik", label: "Başlık" },
      { id: "ozet", label: "Özet" },
      { id: "detay", label: "Detay" },
      { id: "tarih", label: "Tarih" },
    ],
  },
  {
    label: "Haberler",
    collection: "haberler",
    fields: [
      { id: "baslik", label: "Başlık" },
      { id: "icerik", label: "İçerik" },
      { id: "tarih", label: "Tarih" },
    ],
  },
  {
    label:"İletişim",
    collection:"iletisim",
    fields:[
      { id: "isim", label: "İsim" },
      { id: "email", label: "Email" },
      { id: "telefon", label: "Telefon" },
      { id: "mesaj", label: "Mesaj" },
    ],
  }
];

const Navbar_admin = ({ selectedOption, setSelectedOption, setSelectedRow, isGenelgelerPage ,isHaberlerPage}) => {
  const handleClick = (option) => {
    setSelectedOption(option);
    setSelectedRow(null);
  };

  const handleGenelgelerClick = () => {
    setSelectedOption(null);
    setSelectedRow(null);
    window.location.href = "/admin-esob-2025/admin-genelgeler";
  };
 const  handleHaberlerClick =()=>{
  setSelectedOption(null);
  setSelectedRow(null);
  window.location.href = "/admin-esob-2025/admin-haberler";
 }

  return (
    <Navbar color="light" light expand="md" className="border-bottom shadow-sm mb-3">
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink
            href="#"
            active={isGenelgelerPage}
            onClick={handleGenelgelerClick}
            className="px-3"
          >
            Genelgeler
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            active={isHaberlerPage}
            onClick={handleHaberlerClick}
            className="px-3"
          >
            Haberler
          </NavLink>
        </NavItem>
        {options.map((option) => (
          <NavItem key={option.label}>
            <NavLink
              href="#"
              active={selectedOption?.label === option.label}
              onClick={() => handleClick(option)}
              className="px-3"
            >
              {option.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
};

export default Navbar_admin;