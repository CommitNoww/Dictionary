import React, { useEffect } from "react";

const KakaoCallback = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const authCode = queryParams.get("code");

    if (authCode) {
      // 백엔드 서버에 인증 코드 보내기
      fetch("http://localhost:5001/kakao-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("서버 오류 발생");
          }
          return response.json();
        })
        .then((data) => {
          // 액세스 토큰과 사용자 정보 처리
          console.log("백엔드로부터 받은 액세스 토큰:", data.accessToken);
          localStorage.setItem("accessToken", data.accessToken);

          // 사용자 정보 저장
          const userInfo = data.userInfo;
          localStorage.setItem("nickname", userInfo.nickname);
          localStorage.setItem("email", userInfo.email);

          // 로그인 완료 후 메인 페이지로 리디렉션
          window.location.href = "/"; // 메인 페이지로 이동
        })
        .catch((error) => {
          console.error("백엔드와의 통신 오류:", error.message);
        });
    } else {
      console.error("카카오 인증 코드가 없습니다.");
    }
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행되도록 []를 두 번째 인자로

  return <div>카카오 로그인 중...</div>;
};

export default KakaoCallback;
