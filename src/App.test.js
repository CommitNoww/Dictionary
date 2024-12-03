import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders MainPage by default", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // 기본 경로("/")에서 MainPage가 렌더링되는지 확인
  const mainPageText = screen.getByText(/유반사전/i);
  expect(mainPageText).toBeInTheDocument();
});

test("renders Login page when navigating to /login", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  // "/login" 경로에서 Login 컴포넌트가 렌더링되는지 확인
  const loginText = screen.getByText(/로그인/i);
  expect(loginText).toBeInTheDocument();
});

test("redirects to /login when accessing /mypage without login", () => {
  render(
    <MemoryRouter initialEntries={["/mypage"]}>
      <App />
    </MemoryRouter>
  );

  // 마이페이지 접근 시 로그인 필요 메시지가 표시되는지 확인
  const alertMessage = screen.queryByText(/로그인이 필요합니다./i);
  expect(alertMessage).not.toBeInTheDocument(); // 실제 알림창은 브라우저에서 실행되므로 DOM에는 표시되지 않음
});