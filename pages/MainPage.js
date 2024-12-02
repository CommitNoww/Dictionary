import React from "react";
import logo from "../assets/icon.png"; // 로고 이미지 경로

const MainPage = ({ userInfo, onLogout }) => {
  return (
    <div
      style={{
        backgroundColor: "#EDF1FD",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 전체 세로 방향으로 중앙 정렬
      }}
    >
      {/* 상단 헤더 */}
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end", // 버튼을 오른쪽 끝으로 배치
          alignItems: "center",
          height: "60px",
          padding: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        {/* 로고 중앙 배치 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", // 중앙에 배치
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/")}
        >
          <img
            src={logo}
            alt="로고"
            style={{
              width: "50px",
              height: "50px",
              marginRight: "10px",
            }}
          />
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>유반사전</span>
        </div>

        {/* 로그인 및 마이페이지 버튼 */}
        <div>
          {!userInfo ? (
            <>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "20px", // 버튼을 왼쪽으로 약간 이동
                }}
                onClick={() => (window.location.href = "/login")}
              >
                로그인
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={() => (window.location.href = "/mypage")}
              >
                마이페이지
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogout}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#FF5722",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "20px",
                }}
              >
                로그아웃
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={() => (window.location.href = "/mypage")}
              >
                마이페이지
              </button>
            </>
          )}
        </div>
      </header>

      {/* 검색바와 초성 버튼 */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", // 세로 기준으로 중앙 정렬
          flex: 1,
          padding: "20px",
        }}
      >
        {/* 검색바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "15px",
            padding: "5px",
            maxWidth: "600px",
            width: "100%",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form
            style={{ display: "flex", flex: 1, alignItems: "center" }}
            onSubmit={(e) => {
              e.preventDefault();
              console.log("검색 실행");
            }}
          >
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "16px",
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              검색
            </button>
          </form>
        </div>

        {/* 초성 버튼 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)", // 7개씩 2줄 배열
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"].map((consonant) => (
            <button
              key={consonant}
              style={{
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onClick={() => console.log(`${consonant} 버튼 클릭됨`)}
            >
              {consonant}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
