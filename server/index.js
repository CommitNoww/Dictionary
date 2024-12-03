const express = require("express"); // Express 가져오기
const axios = require("axios");
const cors = require("cors");

const app = express(); // Express 애플리케이션 생성
app.use(express.json()); // JSON 요청 처리

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // React 프론트엔드 주소
    methods: ["GET", "POST"],
  })
);

const REST_API_KEY = "b699dc9ef956dda59a89d3e5e95da62c"; // 카카오 REST API 키
const REDIRECT_URI = "http://localhost:3000/home"; // Redirect URI (프론트엔드 URI와 동일해야 함)

// 카카오 토큰 요청 엔드포인트
app.post("/kakao-token", async (req, res) => {
  const { code } = req.body;

  // 클라이언트로부터 받은 요청 데이터를 로그로 출력
  console.log("클라이언트로부터 받은 요청 데이터:", req.body);

  try {
    console.log("카카오에 요청하는 데이터:", {
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
    });

    // 카카오 API로 액세스 토큰 요청
    const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: code,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("카카오 응답 데이터:", response.data);
    const accessToken = response.data.access_token;
    console.log("카카오 액세스 토큰:", accessToken);

    // JSON 형식으로 액세스 토큰 반환
    res.json({ accessToken });
  } catch (error) {
    console.error("카카오 토큰 요청 오류:", error.response?.data || error.message);
    res.status(500).json({
      error: "토큰 요청 실패",
      details: error.response?.data || error.message,
    });
  }
});

// 카카오 사용자 정보 요청 엔드포인트
app.post("/kakao-userinfo", async (req, res) => {
  const { accessToken } = req.body;

  try {
    console.log("사용자 정보 요청 중, 전달된 액세스 토큰:", accessToken);

    // 카카오 API로 사용자 정보 요청
    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("사용자 정보:", response.data);
    res.json(response.data); // 사용자 정보 반환
  } catch (error) {
    console.error("사용자 정보 요청 오류:", error.response?.data || error.message);
    res.status(500).json({
      error: "사용자 정보 요청 실패",
      details: error.response?.data || error.message,
    });
  }
});

// 서버 실행
const PORT = 5001; // 서버가 실행될 포트 번호
app.listen(PORT, () => console.log(`백엔드 서버 실행 중... 포트: ${PORT}`));
