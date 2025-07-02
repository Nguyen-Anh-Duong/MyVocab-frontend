import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/MainLayout";
import { Home, Login } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
