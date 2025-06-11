import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/MainPage.css";

const MainPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <main className="main">
        {/* 검색바 */}
        <div className="search-bar">
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              const searchWord = e.target.elements[0].value.trim();
              if (searchWord) {
                navigate(`/search?word=${searchWord}`);
              } else {
                alert("검색어를 입력해주세요!");
              }
            }}
          >
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              검색
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
