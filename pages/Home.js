import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getKakaoToken } from "../services/kakaoAuth";

const Home = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Redirect URI에서 인증 코드 가져오기
    const code = searchParams.get("code");
    if (code) {
      // 인증 코드를 사용해 액세스 토큰 요청
      getKakaoToken(code).then((token) => {
        console.log("카카오 액세스 토큰:", token);
      });
    }
  }, [searchParams]);

  return <h1>홈 화면</h1>;
};

export default Home;
