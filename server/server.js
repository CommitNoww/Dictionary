const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose(); // SQLite 모듈

const app = express();
const PORT = 5001;

app.use(cors({
  origin: "http://localhost:3000", // React 클라이언트 URL
  methods: ["GET", "POST"],       // 허용할 HTTP 메서드
})); // CORS 설정

app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터를 파싱

// SQLite 데이터베이스 초기화
const db = new sqlite3.Database("./sample.db", (err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err.message);
  } else {
    console.log("SQLite 데이터베이스 연결 성공");
  }
});

// SQLite 테이블 초기화 (서버 시작 시)
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS word (
      target_code TEXT PRIMARY KEY,
      data TEXT
    )`
  );
  console.log("SQLite 테이블 준비 완료.");
});

// 카카오 API: 인증 코드로 토큰과 사용자 정보 가져오기
app.post("/kakao-token", async (req, res) => {
  const authCode = req.body.code;

  if (!authCode) {
    console.error("인증 코드가 없습니다.");
    return res.status(400).json({ message: "인증 코드가 없습니다." });
  }

  console.log("받은 인증 코드:", authCode);

  try {
    // 액세스 토큰 요청
    const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: "b699dc9ef956dda59a89d3e5e95da62c", // 카카오 REST API 키
        redirect_uri: "http://localhost:3000/kakao-callback", // 리디렉션 URI
        code: authCode,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 사용자 정보 요청
    const { access_token } = response.data;
    const userInfoResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("카카오에서 받은 사용자 정보:", userInfoResponse.data);

    const userInfo = {
      nickname: userInfoResponse.data.properties?.nickname || "닉네임 정보 없음",
      email: userInfoResponse.data.kakao_account?.email || "이메일 정보 없음",
    };

    res.json({ accessToken: access_token, userInfo });
  } catch (error) {
    console.error("카카오 API 호출 실패:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "카카오 API 호출 실패" });
  }
});

// 단어 검색 API: 검색어로 데이터 조회
app.get("/api/words", (req, res) => {
  const queryWord = req.query.word; // 검색어

  if (!queryWord) {
    return res.status(400).json({ message: "검색어가 없습니다." });
  }


  // SQLite 데이터베이스에서 검색
  db.all(
    "SELECT data FROM word WHERE json_extract(data, '$.word_info.word') = ?",
    [queryWord],
    (err, rows) => {
      if (err) {
        console.error("데이터베이스 조회 실패:", err.message);
        res.status(500).json({ message: "데이터베이스 조회 실패" });
      } else if (rows && rows.length > 0) {
        // 모든 결과를 배열로 반환
        const results = rows.map((row) => JSON.parse(row.data));
        res.json(results);
      } else {
        res.status(404).json({ message: "단어를 찾을 수 없습니다." });
      }
    }
  );
});


// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
