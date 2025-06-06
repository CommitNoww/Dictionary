import React, { useEffect, useState } from "react";
import logo from "../assets/icon.png"; // 로고 이미지 경로
import axios from "axios";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  const [favoriteTargetIds, setFavoriteWordIds] = useState([]); // 사용자의 즐겨찾기 단어 목록

  // 사용자 정보 가져오기
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData) {
      setUserInfo(userData);
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    }
    if (userData) {
      axios
        .get(`http://localhost:5001/api/favorites/word?user_uid=${userData.email}`)
        .then((response) => {
          console.log(response.data); // 디버깅용
          setFavoriteWordIds(response.data);
          console.log(favoriteTargetIds);
        })
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // 사용자 정보 삭제
    alert("로그아웃되었습니다.");
    window.location.href = "/"; // 메인 페이지로 리디렉션
  };

  if (!userInfo) {
    return <div>사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#EDF1FD",
        minHeight: "100vh",
        fontFamily: "'Roboto', sans-serif", // Roboto 폰트 적용
      }}
    >
      {/* 상단 헤더 */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between", // 로고, 제목, 버튼 정렬
          alignItems: "center",
          height: "60px",
          padding: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 왼쪽 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/")}
        >
          <img
            src={logo}
            alt="로고"
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>유반사전</span>
        </div>

        {/* 가운데 제목 */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0",
            color: "#333333",
          }}
        >
          마이페이지
        </h1>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          로그아웃
        </button>
      </header>

      {/* 사용자 정보 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 300px)", // 헤더 제외한 영역
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "30px", // 둥근 사각형
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            width: "360px", // 사각형 크기 줄임
            height: "300px", // 세로 길이 줄임
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* 프로필 사진 */}
          <img
            src={userInfo.photoURL}
            alt="프로필"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "3px solid #2196F3",
              position: "absolute",
              top: "25%", // 사각형 높이의 약 4분의 1 지점
              left: "50%", // 중앙 정렬
              transform: "translate(-50%, -50%)", // 중앙 정렬을 위한 변환
            }}
          />

          {/* 이름과 이메일 */}
          <div
            style={{
              marginTop: "130px", // 사진 아래 여백 조정
              padding: "0 20px",
              textAlign: "left", // 이름과 이메일 왼쪽 정렬
            }}
          >
            <p
              style={{
                fontSize: "22px", // 이름 글씨 크기 유지
                fontWeight: "normal", // 기본 글씨체 사용
                marginBottom: "15px",
                color: "#333333",
              }}
            >
              이름: {userInfo.name}
            </p>
            <p
              style={{
                fontSize: "20px", // 이메일 글씨 크기 유지
                fontFamily: "'Roboto', sans-serif", // Roboto 폰트 적용
                color: "#666666",
              }}
            >
              이메일: {userInfo.email}
            </p>
          </div>
        </div>
      </div>
      <h2
        style={{
          textAlign: "center"
        }}>즐겨 찾기 단어 목록</h2>
      <div 
        style={{
          display: "flex",
          textAlign: "center",
          justifyContent: "center",          
          padding: "20px",
          gap: "10px"
        }}>
          {favoriteTargetIds.length === 0 ? (
            <h3>즐겨찾기한 단어가 없습니다.</h3>
          ) : (
            favoriteTargetIds.map((item, idx) => (
              <div className="word-card"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: "20px",
                  gap: "10px",
                  width: "80px",
                  height: "50px",
                  borderRadius: "10px",
                  backgroundColor: "white"
                }}>
                <span 
                  style={{
                    color: "#2196f3"
                  }}>{ item.word }</span>
                <span>{ item.pronunciation }</span>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default MyPage;
