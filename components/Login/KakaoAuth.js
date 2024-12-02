// kakaoAuth.js
const { Kakao } = window;

export const loginWithKakao = () => {
  if (!Kakao.isInitialized()) {
    Kakao.init("11ce0b264494bcf7102ff1b48f200dc3"); // JavaScript 키로 Kakao SDK 초기화
    console.log("Kakao SDK 초기화 완료");
  }

  Kakao.Auth.authorize({
    redirectUri: "http://localhost:3000/home", // Redirect URI 설정
  });
};
