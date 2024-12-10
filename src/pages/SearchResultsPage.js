import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // Header 컴포넌트 import
import "../styles/SearchResultsPage.css";

const SearchResultsPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchWord = queryParams.get("word");

  const [searchResults, setSearchResults] = useState([]); // 현재 검색 결과
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    if (searchWord) {
      axios
        .get(`http://localhost:5001/api/words?word=${searchWord}`)
        .then((response) => {
          // 서버 응답이 배열인지 확인
          if (Array.isArray(response.data)) {
            setSearchResults(response.data); // 배열 데이터 저장
          } else {
            setSearchResults([response.data]); // 단일 데이터도 배열로 변환
          }
          setError(null);
        })
        .catch((err) => {
          setSearchResults([]);
          setError(err.response?.data?.message || "검색 실패");
        });
    }
  }, [searchWord]);

  return (
    <div className="search-results-page">
      {/* Header 컴포넌트 사용 */}
      <Header userInfo={userInfo} onLogout={onLogout} />

      {/* 검색바 */}
      <div className="header-search-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newSearchWord = e.target.elements[0].value.trim();
            if (newSearchWord) {
              navigate(`/search?word=${newSearchWord}`);
            } else {
              alert("검색어를 입력해주세요!");
            }
          }}
        >
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="header-search-input"
          />
          <button type="submit" className="header-search-button">
            검색
          </button>
        </form>
      </div>

      {/* 흰색 배경 컨테이너 */}
      <div className="results-container">
        {error ? (
          <div className="no-results">
            <h1>{error}</h1>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="results-content">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => navigate(`/word/${result.word_info.word}`, {
                  state: { wordData: result },})}
              >
                <h2>{result.word_info.word}</h2>
                <p>{result.word_info.pronunciation || "발음 정보 없음"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>결과를 찾는 중...</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
