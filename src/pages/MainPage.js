import React from "react";
import logo from "../assets/icon.png"; // 로고 이미지 경로
import "../styles/MainPage.css"; // 파일이 styles 폴더에 있는 경우

const MainPage = ({ userInfo, onLogout }) => {
  return (
    <div className="main-page">
      {/* 상단 헤더 */}
      <header className="header">
        {/* 로고 */}
        <div className="header-logo" onClick={() => (window.location.href = "/")}>
          <img src={logo} alt="로고" className="logo-image" />
          <span className="logo-text">유반사전</span>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="header-buttons">
          {!userInfo ? (
            <>
              <button
                className="header-button"
                onClick={() => (window.location.href = "/login")}
              >
                로그인
              </button>
              <button
                className="header-button"
                onClick={() => (window.location.href = "/mypage")}
              >
                마이페이지
              </button>
            </>
          ) : (
            <>
              <button className="header-button logout" onClick={onLogout}>
                로그아웃
              </button>
              <button
                className="header-button"
                onClick={() => (window.location.href = "/mypage")}
              >
                마이페이지
              </button>
            </>
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="main">
        {/* 검색바 */}
        <div className="search-bar">
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("검색 실행");
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

        {/* 초성 버튼 */}
        <div className="consonants">
          {["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"].map(
            (consonant) => (
              <button
                key={consonant}
                className="consonant-button"
                onClick={() => console.log(`${consonant} 버튼 클릭됨`)}
              >
                {consonant}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;