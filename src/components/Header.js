import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png"; // 로고 이미지 경로
import "../styles/Header.css"; // CSS 파일 import

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div
        className="header-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="로고" className="logo-image" />
        <span className="logo-text">유반사전</span>
      </div>
    </header>
  );
};

export default Header;
