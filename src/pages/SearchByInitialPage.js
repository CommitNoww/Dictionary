import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import "../styles/SearchByInitialPage.css";

const SearchByInitialPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initial = queryParams.get("initial");

  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initial) {
      console.log("Fetching words for initial:", initial); // 전달된 초성 로그
      axios
        .get(`http://localhost:5001/api/words-by-initial?initial=${initial}`)
        .then((response) => {
          console.log("API Response:", response.data); // API 응답 로그
          setWords(response.data);
          setError(null);
        })
        .catch((err) => {
          console.error("API Error:", err.response?.data || err.message); // 에러 로그
          setWords([]);
          setError(err.response?.data?.message || "단어를 불러오는 데 실패했습니다.");
        });
    }
  }, [initial]);
  

  return (
    <div className="search-by-initial-page">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          이전
        </button>
      </div>
      <main className="results-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : words.length > 0 ? (
          <div className="results-content">
            {words.map((word, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => navigate(`/word/${word.word_info.word}`)}
              >
                <h2>{word.word_info.word}</h2>
                <p>{word.word_info.pronunciation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>결과를 찾는 중...</p>
        )}
      </main>
    </div>
  );
};

export default SearchByInitialPage;
