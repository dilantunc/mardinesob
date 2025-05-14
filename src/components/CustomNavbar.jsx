import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar as ReactstrapNavbar,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
  Container
} from "reactstrap";
import "./CustomNavbar.css";
import Logo from "../../src/assets/logo1.png";

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // <<--- EKLEDİK

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Kurumsal",
      submenu: [
        { label: "Tarihçe", path: "/kurumsal/tarihce" },
        { label: "Misyon & Vizyon", path: "/kurumsal/misyon" },
        { label: "Yönetim", path: "/kurumsal/yonetim" },
      ],
    },
    {
      label: "Bilgi Bankası",
      submenu: [
        { label: "Sıkça Sorulan Sorular (SSS)", path: "/bilgi-bankasi/sss" },
        {label: "Haberler" , path: "/bilgi-bankasi/haberler"}
      ],
    },
    { label: "Odalar", path: "/odalar" },
    {
      label: "Genelgeler",
      submenu: [
        { label: "Genelgeler", path: "/genelgeler" },
        { label: "Duyurular", path: "/duyurular" },
      ],
    },
    {
      label: "Mevzuat",
      submenu: [
        { label: "Kanunlar", path: "/mevzuat/kanunlar" },
        { label: "Yönetmelikler", path: "/mevzuat/yonetmelikler" },
        { label: "Tebliğler", path: "/mevzuat/tebligler" },
      ],
    },
    {
      label: "İletişim",
      path: "/iletisim",
    },
  ];

  return (
    <ReactstrapNavbar
      expand="lg"
      fixed="top"
      className={`navbar-custom ${scrolled ? "scrolled" : ""} ${isHomePage ? "navbar-home" : "navbar-other"}`}
    >
      <Container className="navbar-container">
        <div className="navbar-brand-wrapper" style={{cursor:"pointer"}} onClick={() => window.location.href = "/"}>
          <img src={Logo} alt="Logo" className="navbar-logo" />
          <h2 className="navbar-title">
            Mardin Esnaf ve Sanatkarlar Odalar Birliği
          </h2>
        </div>

        <NavbarToggler onClick={toggle} className="navbar-toggler-custom">
          <span className="navbar-toggler-icon" />
        </NavbarToggler>

        <Collapse isOpen={isOpen} navbar className="navbar-collapse-custom">
          <Nav navbar className="mx-auto">
            {menuItems.map((item, index) => (
              <NavItem key={index} className="nav-item-custom">
                {item.submenu ? (
                  <div className="nav-link-wrapper">
                    <NavLink
                      tag={Link}
                      to={item.path}
                      className={`nav-link-custom ${
                        location.pathname.startsWith(item.path) ? "active" : ""
                      }`}
                    >
                      {item.label}
                    </NavLink>
                    <div className="dropdown-menu-custom">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          tag={Link}
                          to={subItem.path}
                          className={`dropdown-item-custom ${
                            location.pathname === subItem.path ? "active" : ""
                          }`}
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    tag={Link}
                    to={item.path}
                    className={`nav-link-custom ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </Container>
    </ReactstrapNavbar>
  );
};

export default CustomNavbar;
