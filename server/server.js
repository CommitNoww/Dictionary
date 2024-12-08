const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://43.201.250.147:5001/', // 클라이언트 도메인으로 수정
  methods: ['GET', 'POST'],
}));
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터를 파싱

// 빌드된 React 앱을 서빙
app.use(express.static(path.join(__dirname, 'build')));

// 모든 다른 요청은 index.html로 리디렉션
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post("/kakao-token", async (req, res) => {
  const authCode = req.body.code;

  if (!authCode) {
    console.error("인증 코드가 없습니다.");
    return res.status(400).json({ message: "인증 코드가 없습니다." });
  }

  console.log("받은 인증 코드:", authCode);

  try {
    // 액세스 토큰을 받아오는 요청
    const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID, // 환경 변수로 가져오기
        redirect_uri: "http://43.201.250.147:5001/kakao-callback", // 올바른 리디렉션 URI로 수정
        code: authCode,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 액세스 토큰을 통해 사용자 정보 가져오기
    const { access_token } = response.data;
    const userInfoResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("카카오에서 받은 사용자 정보:", userInfoResponse.data);

    // 사용자 정보에서 필요한 정보 (예: 닉네임) 가져오기
    const userInfo = {
      nickname: userInfoResponse.data.properties?.nickname || "닉네임 정보 없음",
      email: userInfoResponse.data.kakao_account?.email || "이메일 정보 없음",
    };

    // 액세스 토큰과 사용자 정보를 클라이언트로 전달
    res.json({ accessToken: access_token, userInfo });
  } catch (error) {
    console.error("카카오 API 호출 실패:", {
      status: error.response ? error.response.status : 'N/A',
      data: error.response ? error.response.data : error.message,
    });
    res.status(500).json({ message: "카카오 API 호출 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});