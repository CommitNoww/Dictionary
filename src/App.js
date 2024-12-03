import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./components/Login/Login";
import MyPage from "./pages/MyPage";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogin = (user) => {
    setUserInfo(user);
    localStorage.setItem("userInfo", JSON.stringify(user)); // 로그인 정보 저장
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    window.location.href = "/"; // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={<MainPage userInfo={userInfo} onLogout={handleLogout} />}
        />
        {/* 로그인 페이지 */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        {/* 마이페이지 */}
        <Route
          path="/mypage"
          element={<MyPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;