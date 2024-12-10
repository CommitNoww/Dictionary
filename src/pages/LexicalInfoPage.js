import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/LexicalInfoPage.css";

const LexicalInfoPage = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lexicalInfo, definition } = location.state || {};

  // type 별 데이터 분류 및 정렬
  const groupAndSortByType = (data) => {
    const grouped = {
      참고어휘: [],
    };

    data.forEach((item) => {
      if (item.type === "참고어휘") {
        grouped.참고어휘.push(item);
      } else {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item);
      }
    });

    // 각 type 내부 정렬
    for (const type in grouped) {
      if (type === "반대말") {
        // 반대말은 절댓값 기준 정렬 + 가나다라 순
        grouped[type] = grouped[type].sort((a, b) => {
          const similarityDifference =
            Math.abs(b.similarity) - Math.abs(a.similarity);
          if (similarityDifference !== 0) {
            return similarityDifference; // similarity 기준 정렬
          }
          return a.word.localeCompare(b.word); // 같으면 가나다 순
        });
      } else {
        // 나머지는 similarity 기준 + 가나다라 순
        grouped[type] = grouped[type].sort((a, b) => {
          const similarityDifference = b.similarity - a.similarity;
          if (similarityDifference !== 0) {
            return similarityDifference; // similarity 기준 정렬
          }
          return a.word.localeCompare(b.word); // 같으면 가나다 순
        });
      }
    }

    return grouped;
  };

  const groupedLexicalInfo = groupAndSortByType(lexicalInfo || []);

  // type이 몇 개인지 계산
  const activeTypes = ["비슷한말", "준말/본말", "반대말"].filter(
    (type) => groupedLexicalInfo[type] && groupedLexicalInfo[type].length > 0
  );

  // 참고어휘 체크
  const hasReferenceWords =
    groupedLexicalInfo.참고어휘 && groupedLexicalInfo.참고어휘.length > 0;

  // CSS 클래스 동적 설정
  const layoutClass =
    activeTypes.length === 1
      ? "one-type"
      : activeTypes.length === 2
      ? "two-types"
      : "three-types";

  // 색상 클래스 지정
  const getTypeColorClass = (type) => {
    if (type === "비슷한말") return "green-block";
    if (type === "준말/본말") return "orange-block";
    if (type === "반대말") return "red-block";
    return "gray-block";
  };

  return (
    <div className="lexical-info-page">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          이전
        </button>
      </div>
      <main className="lexical-container">
        <div className="lexical-block">
          <h1 className="definition-title">
            "{definition}"의 의미적 연관 관계
          </h1>

          {/* 참고어휘 섹션 */}
          {hasReferenceWords && (
            <div className="reference-section">
              <div className="reference-label">참고 어휘</div>
              <div className="reference-items">
                {groupedLexicalInfo.참고어휘.map((item, index) => (
                  <div key={index} className="reference-item">
                    {item.word}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`lexical-content ${layoutClass}`}>
            {activeTypes.map((type, index) => (
              <div key={index} className="type-section">
                <div className={`type-label ${getTypeColorClass(type)}`}>
                  {type}
                </div>
                <div className="type-items">
                  {groupedLexicalInfo[type].map((item, itemIndex) => (
                    <div key={itemIndex} className="type-item">
                      {item.word}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LexicalInfoPage;
