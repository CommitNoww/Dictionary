import axios from "axios";

const REST_API_KEY = "b699dc9ef956dda59a89d3e5e95da62c";
const REDIRECT_URI = "http://localhost:3000/home";

export const loginWithKakao = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
};

export const getKakaoToken = async (code) => {
  const response = await axios.post(
    `https://kauth.kakao.com/oauth/token`,
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: code,
      },
    }
  );
  return response.data.access_token;
};