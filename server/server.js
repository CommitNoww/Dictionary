const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose(); // SQLite 모듈
const path = require('path');
const dbPath = path.join(__dirname, 'sample.db');

const app = express();
const PORT = 5001;

// 빌드된 React 앱을 서빙
app.use(express.static(path.join(__dirname, 'build')));

app.use(cors({
  origin: "http://43.201.250.147:5001/", // React 클라이언트 URL
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
  db.run(
    `CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_uid TEXT NOT NULL,
      target_code TEXT NOT NULL,
      word TEXT NOT NULL,
      pronunciation TEXT,
      UNIQUE(user_uid, target_code)
    )`
  );
  console.log("SQLite 테이블 준비 완료.");
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

app.post("/api/favorites", (req, res) => {
  const { user_uid, target_code, word, pronunciation } = req.body.data;
  if (!user_uid || !target_code || !word) {
    return res.status(400).json({ message: "user_uid와 target_code, word 필요" });
  }
  db.run(
    "INSERT OR IGNORE INTO favorites (user_uid, target_code, word, pronunciation) VALUES (?, ?, ?, ?)",
    [user_uid, target_code, word, pronunciation],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json({ success: true });
    }
  );
});

app.delete("/api/favorites", (req, res) => {
  const { user_uid, target_code } = req.body;
  if (!user_uid || !target_code) {
    return res.status(400).json({ message: "user_uid와 target_code 필요" });
  }
  db.run(
    "DELETE FROM favorites WHERE user_uid = ? AND target_code = ?",
    [user_uid, target_code],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json({ success: true });
    }
  );
});

app.get("/api/favorites", (req, res) => {
  const user_uid = req.query.user_uid;
  if (!user_uid) {
    return res.status(400).json({ message: "user_uid 필요" });
  }
  db.all(
    "SELECT target_code FROM favorites WHERE user_uid = ?",
    [user_uid],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json(rows.map(row => row.target_code));
    }
  );
});

app.get("/api/favorites/word", (req, res) => {
  const user_uid = req.query.user_uid;
  if (!user_uid) {
    return res.status(400).json({ message: "user_uid 필요" });
  }
  db.all(
    "SELECT word, pronunciation FROM favorites WHERE user_uid = ?",
    [user_uid],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json(rows);
    }
  );
});
// 모든 다른 요청은 index.html로 리디렉션
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
