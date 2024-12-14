import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WordDetailPage from "./pages/WordDetailPage";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage />}
        />
        <Route
          path="/search"
          element={<SearchResultsPage />}
        />
        <Route
          path="/word/:word"
          element={<WordDetailPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
