import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // Header 컴포넌트 import
import "../styles/WordDetailPage.css";

const WordDetailPage = () => {
  const navigate = useNavigate();
  const { word } = useParams();
  const location = useLocation();
  const [wordData, setWordData] = useState(location.state?.wordData || null);
  const [error, setError] = useState(null);
  const [expandedIndices, setExpandedIndices] = useState({});
  const [currentPage, setCurrentPage] = useState({});

  useEffect(() => {
    if (!wordData) {
      axios
        .get(`http://43.201.250.147:5001/api/words?word=${word}`)
        .then((response) => {
          const selectedWord =
            Array.isArray(response.data) && response.data.length > 0
              ? response.data[0]
              : response.data;

          setWordData(selectedWord);
          setError(null);
        })
        .catch((err) => {
          setWordData(null);
          setError(err.response?.data?.message || "단어 정보를 가져올 수 없습니다.");
        });
    }
  }, [word]);

  const classifyRelevance = (similarity) => {
    if (similarity >= 0.7) return "높음";
    if (similarity >= 0) return "보통";
    return "낮음";
  };

  const getCircleColor = (similarity) => {
    if (similarity < 0) return "red-circle";
    return "blue-circle";
  };

  const toggleExpand = (senseIndex) => {
    setExpandedIndices((prevState) => ({
      ...prevState,
      [senseIndex]: !prevState[senseIndex],
    }));
    setCurrentPage((prevState) => ({
      ...prevState,
      [senseIndex]: 0,
    }));
  };

  const changePage = (senseIndex, direction) => {
    setCurrentPage((prevState) => ({
      ...prevState,
      [senseIndex]: (prevState[senseIndex] || 0) + direction,
    }));
  };

  if (error) {
    return (
      <div className="word-detail-page">
        <Header />
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!wordData) {
    return (
      <div className="word-detail-page">
        <Header />
        <div className="loading-container">
          <p>결과를 찾는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-detail-page">
      <Header />
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          이전
        </button>
      </div>

      <main className="detail-container">
        <div className="word-content">
          <div className="word-block">
            <div className="word-header">
              <h1>
                {wordData.word_info.word}
                {wordData.word_info.original_language && (
                  <span className="original-language">
                    ({wordData.word_info.original_language})
                  </span>
                )}
              </h1>
              {wordData.word_info.pronunciation && (
                <p className="pronunciation">
                  <b>발음:</b> [{wordData.word_info.pronunciation}]
                </p>
              )}
            </div>

            {wordData.word_info.pos_info.map((pos, posIndex) => (
              <div key={posIndex} className="pos-section">
                <div className="pos-label">{pos.pos}</div>

                {pos.comm_pattern_info.map((pattern, patternIndex) => (
                  <div key={patternIndex}>
                    {pattern.pattern && (
                      <div className="pattern-text">
                        {patternIndex + 1}. {pattern.pattern}
                      </div>
                    )}
                    <div className="sense-list">
                      {pattern.sense_info.map((sense, senseIndex) => {
                        const itemsPerPage = 6;
                        const sortedItems = sense.lexical_info.sort(
                          (a, b) => b.similarity - a.similarity
                        );
                        const startIndex =
                          (currentPage[senseIndex] || 0) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const currentItems = sortedItems.slice(
                          startIndex,
                          endIndex
                        );

                        return (
                          <div key={senseIndex} className="sense-item">
                            <span className="sense-numbered">
                              {senseIndex + 1}. {sense.definition}
                            </span>

                            <div className="lexical-info-preview">
                              {sense.lexical_info.slice(0, 3).map((item) => (
                                <div
                                  key={item.word}
                                  className="lexical-info-block"
                                >
                                  <div
                                    className={`circle ${getCircleColor(item.similarity)}`}
                                  ></div>
                                  <span>{item.word}</span>
                                </div>
                              ))}
                              {sense.lexical_info.length > 3 && (
                                <button
                                  className="toggle-button"
                                  onClick={() => toggleExpand(senseIndex)}
                                >
                                  {expandedIndices[senseIndex] ? "접기" : "더보기"}
                                </button>
                              )}
                            </div>

                            {expandedIndices[senseIndex] && (
                              <div className="expanded-lexical-info">
                                <div className="lexical-info-table">
                                  {/* 왼쪽 열 */}
                                  <div className="left-column">
                                    <div className="table-header">
                                      <span>관련성</span>
                                      <span>관계 유형</span>
                                      <span>어휘</span>
                                    </div>
                                    {currentItems.slice(0, 3).map((item, index) => (
                                      <div
                                        key={index}
                                        className="lexical-info-row"
                                      >
                                        <span
                                          className={`relevance ${
                                            classifyRelevance(item.similarity) === "높음"
                                              ? "high"
                                              : classifyRelevance(item.similarity) === "보통"
                                              ? "medium"
                                              : "low"
                                          }`}
                                        >
                                          {classifyRelevance(item.similarity)}
                                        </span>
                                        <span className="relation-type">
                                          {item.type}
                                        </span>
                                        <div className="lexical-word">
                                          <div
                                            className={`circle ${getCircleColor(item.similarity)}`}
                                          ></div>
                                          <span>{item.word}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* 구분선 */}
                                  <div className="separator"></div>

                                  {/* 오른쪽 열 */}
                                  <div className="right-column">
                                    <div className="table-header">
                                      <span>관련성</span>
                                      <span>관계 유형</span>
                                      <span>어휘</span>
                                    </div>
                                    {currentItems.slice(3, 6).map((item, index) => (
                                      <div
                                        key={index}
                                        className="lexical-info-row"
                                      >
                                        <span
                                          className={`relevance ${
                                            classifyRelevance(item.similarity) === "높음"
                                              ? "high"
                                              : classifyRelevance(item.similarity) === "보통"
                                              ? "medium"
                                              : "low"
                                          }`}
                                        >
                                          {classifyRelevance(item.similarity)}
                                        </span>
                                        <span className="relation-type">
                                          {item.type}
                                        </span>
                                        <div className="lexical-word">
                                          <div
                                            className={`circle ${getCircleColor(item.similarity)}`}
                                          ></div>
                                          <span>{item.word}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="pagination-buttons">
                                  <button
                                    onClick={() => changePage(senseIndex, -1)}
                                    disabled={startIndex === 0}
                                  >
                                    ◀
                                  </button>
                                  <span>
                                    {Math.ceil(startIndex / itemsPerPage) + 1}/
                                    {Math.ceil(sortedItems.length / itemsPerPage)}
                                  </span>
                                  <button
                                    onClick={() => changePage(senseIndex, 1)}
                                    disabled={endIndex >= sortedItems.length}
                                  >
                                    ▶
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordDetailPage;
