import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // Header 컴포넌트 import
import "../styles/WordDetailPage.css";

const WordDetailPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const { word } = useParams();
  const location = useLocation();
  const [wordData, setWordData] = useState(location.state?.wordData || null);
  const [error, setError] = useState(null);

  // 데이터가 없을 경우 API로 다시 가져오기
  useEffect(() => {
    if (!wordData) {
      axios
        .get(`http://localhost:5001/api/words?word=${word}`)
        .then((response) => {
          console.log("API Response Data:", response.data);
          // 동음이의어 데이터가 배열로 반환되므로 적절히 선택
          const selectedWord =
            Array.isArray(response.data) && response.data.length > 0
              ? response.data[0] // 첫 번째 데이터 선택 (추가 로직 필요 시 수정)
              : response.data;

          setWordData(selectedWord);
          setError(null);
        })
        .catch((err) => {
          setWordData(null);
          setError(err.response?.data?.message || "단어 정보를 가져올 수 없습니다.");
        });
    }
  }, [word, wordData]);

  // lexical_info 정리
  const prepareLexicalInfo = (lexicalInfo) => {
    const categories = {
      비슷한말: [],
      반대말: [],
      "준말/본말": [],
    };

    lexicalInfo.forEach((item) => {
      if (item.type === "비슷한말") {
        categories.비슷한말.push(item);
      } else if (item.type === "반대말") {
        categories.반대말.push(item);
      } else if (item.type === "준말" || item.type === "본말") {
        categories["준말/본말"].push(item);
      }
    });

    // 카테고리에서 최소 1개씩 가져오기
    const result = [];
    ["비슷한말", "반대말", "준말/본말"].forEach((type) => {
      if (categories[type].length > 0) {
        result.push(categories[type][0]); // 각 카테고리에서 첫 번째 항목 선택
      }
    });

    // 3개가 부족하면 나머지 카테고리에서 추가
    const allItems = [...categories.비슷한말, ...categories.반대말, ...categories["준말/본말"]];
    const remainingItems = allItems.filter((item) => !result.includes(item));
    result.push(...remainingItems.slice(0, Math.max(0, 3 - result.length)));

    return result.slice(0, 3); // 최대 3개로 제한
  };

  if (error) {
    return (
      <div className="word-detail-page">
        <Header userInfo={userInfo} onLogout={onLogout} />
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!wordData) {
    return (
      <div className="word-detail-page">
        <Header userInfo={userInfo} onLogout={onLogout} />
        <div className="loading-container">
          <p>결과를 찾는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-detail-page">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          이전
        </button>
      </div>

      <main className="detail-container">
        <div className="word-content">
          <div className="word-block">
            {/* 단어 정보 */}
            <div className="word-header">
              <h1>
                {wordData.word_info.word}{" "}
                <span className="original-language">
                  ({wordData.word_info.original_language})
                </span>
              </h1>
              <p className="pronunciation">
                <b>발음:</b> [{wordData.word_info.pronunciation || "없음"}]
              </p>
            </div>

            {/* 품사 및 의미 */}
            {wordData.word_info.pos_info.map((pos, posIndex) => (
              <div key={posIndex} className="pos-section">
                <div className="pos-label">{pos.pos}</div>
                {pos.comm_pattern_info.map((pattern, patternIndex) => (
                  <div key={patternIndex} className="pattern-section">
                    <div className="sense-list">
                      {pattern.sense_info.map((sense, senseIndex) => (
                        <div key={senseIndex} className="sense-item">
                          <span className="sense-numbered">
                            {senseIndex + 1}. <b>{sense.definition}</b>
                          </span>

                          {/* lexical_info 미리보기 */}
                          {sense.lexical_info && (
                            <div className="lexical-info-preview">
                              {prepareLexicalInfo(sense.lexical_info).map(
                                (item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className={`lexical-info-block ${
                                      item.type === "비슷한말"
                                        ? "blue-block"
                                        : item.type === "반대말"
                                        ? "red-block"
                                        : "gray-block"
                                    }`}
                                  >
                                    {item.word}
                                  </div>
                                )
                              )}
                              {/* 더보기 버튼 */}
                              {sense.lexical_info.length > 3 && (
                                <div
                                  className="lexical-info-more"
                                  onClick={() =>
                                    navigate("/lexical-info", {
                                      state: {
                                        lexicalInfo: sense.lexical_info,
                                        definition: sense.definition,
                                      },
                                    })
                                  }
                                >
                                  더보기
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
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
