const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5001;
const dbPath = path.join(__dirname, "sample.db");

// 정적 React 빌드 파일 서빙 (build 폴더 기준)
app.use(express.static(path.join(__dirname, "build")));

app.use(cors({
  origin: "http://localhost:3000", // 개발 환경 React 주소
  methods: ["GET", "POST", "DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite DB 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err.message);
  } else {
    console.log("SQLite 데이터베이스 연결 성공");
  }
});

// 테이블 초기화
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
      word_data TEXT NOT NULL
    )`
  );
  console.log("SQLite 테이블 준비 완료.");
});

// 단어 검색 API
app.get("/api/words", (req, res) => {
  const queryWord = req.query.word;

  if (!queryWord) {
    return res.status(400).json({ message: "검색어가 없습니다." });
  }

  db.all(
    "SELECT data FROM word WHERE json_extract(data, '$.word_info.word') = ?",
    [queryWord],
    (err, rows) => {
      if (err) {
        console.error("데이터베이스 조회 실패:", err.message);
        res.status(500).json({ message: "데이터베이스 조회 실패" });
      } else if (rows && rows.length > 0) {
        const results = rows.map((row) => JSON.parse(row.data));
        res.json(results);
      } else {
        res.status(404).json({ message: "단어를 찾을 수 없습니다." });
      }
    }
  );
});

// 즐겨찾기 추가
app.post("/api/favorites", (req, res) => {
  const { user_uid, target_code, word_data } = req.body.data;
  if (!user_uid || !target_code || !word_data) {
    return res.status(400).json({ message: "user_uid와 target_code, word 필요" });
  }
  db.run(
    "INSERT INTO favorites (user_uid, target_code, word_data) VALUES (?, ?, ?)",
    [user_uid, target_code, JSON.stringify(word_data)],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json({ success: true });
    }
  );
});

// 즐겨찾기 삭제
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

// 즐겨찾기 단어 조회
app.get("/api/favorites", (req, res) => {
  const user_uid = req.query.user_uid;
  if (!user_uid) {
    return res.status(400).json({ message: "user_uid 필요" });
  }
  db.all(
    "SELECT * FROM favorites WHERE user_uid = ?",
    [user_uid],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json(rows);
    }
  );
});

// 즐겨찾기 코드 조회
app.get("/api/favorites/target_code", (req, res) => {
  const user_uid = req.query.user_uid;
  if (!user_uid) {
    return res.status(400).json({ message: "user_uid 필요" });
  }
  db.all(
    "SELECT * FROM favorites WHERE user_uid = ?",
    [user_uid],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "DB 오류" });
      }
      res.json(rows.map(row => row.target_code));
    }
  );
});

// 기타 모든 요청은 React 앱으로
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
