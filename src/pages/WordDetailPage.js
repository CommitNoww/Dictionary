import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";
import Header from "../components/Header";
import "../styles/WordDetailPage.css";

const WordDetailPage = () => {
  const navigate = useNavigate();
  const { word } = useParams();
  const location = useLocation();
  const d3Container = useRef(null);

  const [wordData, setWordData] = useState(location.state?.wordData || null);
  const [error, setError] = useState(null);
  const [expandedIndices, setExpandedIndices] = useState({});
  const [currentPage, setCurrentPage] = useState({});

  // 데이터 로딩
  useEffect(() => {
    if (!wordData) {
      axios
        .get(`http://localhost:5001/api/words?word=${word}`)
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

  // D3 시각화
  useEffect(() => {
    if (wordData && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();

      const width = 600;
      const height = 600;

      const centralNode = {
        id: wordData.word_info.word,
        group: 0,
        radius: 30,
      };

      let relatedWords = [];

      wordData.word_info.pos_info.forEach((pos) => {
        pos.comm_pattern_info.forEach((pattern) => {
          pattern.sense_info.forEach((sense) => {
            sense.lexical_info.forEach((lex) => {
              relatedWords.push({
                id: lex.word,
                similarity: lex.similarity,
                type: lex.type,
                group: 1,
              });
            });
          });
        });
      });

      const nodes = [centralNode, ...relatedWords];
      const links = relatedWords.map((d) => ({
        source: wordData.word_info.word,
        target: d.id,
        similarity: d.similarity,
      }));

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id).distance((d) => 200 - 100 * d.similarity))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg
        .append("g")
        .attr("stroke", "#aaa")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 2);

      const node = svg
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => (d.group === 0 ? d.radius : 13))
        .attr("fill", (d) => {
          if (d.group === 0) return "#007bff";
          if (d.type === "antonym") return "#ff4d4d";
          return "#ffcc00";
        })
        .call(
          d3
            .drag()
            .on("start", (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      const label = svg
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text((d) => d.id)
        .attr("font-size", 12)
        .attr("text-anchor", "middle");

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        label.attr("x", (d) => d.x).attr("y", (d) => d.y - 15);
      });
    }
  }, [wordData]);

  // UI 보조 함수
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
    setExpandedIndices((prev) => ({ ...prev, [senseIndex]: !prev[senseIndex] }));
    setCurrentPage((prev) => ({ ...prev, [senseIndex]: 0 }));
  };

  const changePage = (senseIndex, direction) => {
    setCurrentPage((prev) => ({
      ...prev,
      [senseIndex]: (prev[senseIndex] || 0) + direction,
    }));
  };

  // 로딩/에러 처리
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
        {/* 기존 표 영역 */}
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
                        const startIndex = (currentPage[senseIndex] || 0) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const currentItems = sortedItems.slice(startIndex, endIndex);

                        return (
                          <div key={senseIndex} className="sense-item">
                            <span className="sense-numbered">
                              {senseIndex + 1}. {sense.definition}
                            </span>

                            <div className="lexical-info-preview">
                              {sense.lexical_info.slice(0, 3).map((item) => (
                                <div key={item.word} className="lexical-info-block">
                                  <div className={`circle ${getCircleColor(item.similarity)}`}></div>
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
                                  <div className="left-column">
                                    <div className="table-header">
                                      <span>관련성</span>
                                      <span>관계 유형</span>
                                      <span>어휘</span>
                                    </div>
                                    {currentItems.slice(0, 3).map((item, index) => (
                                      <div key={index} className="lexical-info-row">
                                        <span className={`relevance ${classifyRelevance(item.similarity)}`}>{classifyRelevance(item.similarity)}</span>
                                        <span className="relation-type">{item.type}</span>
                                        <div className="lexical-word">
                                          <div className={`circle ${getCircleColor(item.similarity)}`}></div>
                                          <span>{item.word}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="separator"></div>
                                  <div className="right-column">
                                    <div className="table-header">
                                      <span>관련성</span>
                                      <span>관계 유형</span>
                                      <span>어휘</span>
                                    </div>
                                    {currentItems.slice(3, 6).map((item, index) => (
                                      <div key={index} className="lexical-info-row">
                                        <span className={`relevance ${classifyRelevance(item.similarity)}`}>{classifyRelevance(item.similarity)}</span>
                                        <span className="relation-type">{item.type}</span>
                                        <div className="lexical-word">
                                          <div className={`circle ${getCircleColor(item.similarity)}`}></div>
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

        {/* D3 시각화 영역 */}
        <div className="graph-container">
          <svg ref={d3Container} width={800} height={800}></svg>
        </div>
      </main>
    </div>
  );
};

export default WordDetailPage;