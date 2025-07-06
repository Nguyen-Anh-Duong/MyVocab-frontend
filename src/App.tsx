import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/MainLayout";
import { Home, Login, OAuthSuccess, SearchHome, Vocabularies } from "./pages";
import Categories from "./pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/vocabularies" element={<Vocabularies />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<SearchHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
