import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getKakaoToken } from "../../components/Login/kakaoAuth";

const Home = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      getKakaoToken(code).then((token) => {
        console.log("카카오 액세스 토큰:", token);
      });
    }
  }, [searchParams]);

  return <h1>홈 화면</h1>;
};

export default Home;