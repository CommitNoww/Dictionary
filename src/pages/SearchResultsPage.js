import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../styles/SearchResultsPage.css";
import { saveSearchHistory } from "../saveSearchHistory";

const SearchResultsPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchWord = queryParams.get("word");

  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [favoriteTargetIds, setFavoriteWordIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 단어 검색 & 즐겨찾기 불러오기
  useEffect(() => {
    setLoading(true);

    if (searchWord) {
      axios
        .get(`http://localhost:5001/api/words?word=${searchWord}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setSearchResults(response.data);
          } else {
            setSearchResults([response.data]);
          }
          setError(null);
        })
        .catch((err) => {
          setSearchResults([]);
          setError(err.response?.data?.message || "검색 실패");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    if (userInfo) {
      axios
        .get(`http://localhost:5001/api/favorites?user_uid=${userInfo.email}`)
        .then((response) => {
          setFavoriteWordIds(response.data.map(String));
        })
        .catch((err) => {
          console.error("즐겨찾기 불러오기 실패:", err.message);
        });
    }
  }, [searchWord]);

  // 즐겨찾기 추가/삭제
  const handleFavoriteClick = (isFavorite, uid, target_code, word, pronunciation) => {
    if (isFavorite) {
      setFavoriteWordIds((prev) => prev.filter((id) => id !== String(target_code)));
      axios
        .delete("http://localhost:5001/api/favorites", {
          data: { user_uid: uid, target_code: target_code },
        })
        .then(() => console.log("즐겨찾기 삭제 완료"))
        .catch((err) => {
          console.error("즐겨찾기 삭제 실패:", err);
          setFavoriteWordIds((prev) => [...prev, String(target_code)]);
        });
    } else {
      setFavoriteWordIds((prev) => [...prev, String(target_code)]);
      axios
        .post("http://localhost:5001/api/favorites", {
          data: {
            user_uid: uid,
            target_code: target_code,
            word: word,
            pronunciation: pronunciation,
          },
        })
        .then(() => console.log("즐겨찾기 추가 완료"))
        .catch((err) => {
          console.error("즐겨찾기 추가 실패:", err);
          setFavoriteWordIds((prev) => prev.filter((id) => id !== String(target_code)));
        });
    }
  };

  return (
    <div className="search-results-page">
      <Header userInfo={userInfo} onLogout={onLogout} />

      {/* 검색바 */}
      <div className="header-search-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newSearchWord = e.target.elements[0].value.trim();
            if (newSearchWord) {
              saveSearchHistory(newSearchWord);
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

      {/* 검색 결과 */}
      <div className="results-container">
        {loading ? (
          <p style={{ color: "#333", textAlign: "center" }}>단어 검색 중...</p>
        ) : error ? (
          <div className="no-results">
            <h1 style={{ color: "red" }}>{error}</h1>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="results-content">
            {searchResults.map((result, index) => {
              if (!result?.word_info) return null;
              const isFavorite = favoriteTargetIds.includes(String(result.target_code));

              return (
                <div
                  key={index}
                  className="result-item"
                  onClick={() =>
                    navigate(`/word/${result.word_info.word}`, {
                      state: { wordData: result },
                    })
                  }
                >
                  <div>
                    <h2>{result.word_info.word}</h2>
                    <p>{result.word_info.pronunciation || "발음 정보 없음"}</p>
                  </div>
                  {userInfo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(
                          isFavorite,
                          userInfo.email,
                          result.target_code,
                          result.word_info.word,
                          result.word_info.pronunciation
                        );
                      }}
                    >
                      {isFavorite ? "★" : "☆"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
