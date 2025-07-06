import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import {
  AdminCategories,
  AdminDashboard,
  AdminUsers,
  AdminVocabularies,
  Categories,
  Home,
  Login,
  OAuthSuccess,
  SearchHome,
  Vocabularies
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Routes */}
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/vocabularies" element={<Vocabularies />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<SearchHome />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/vocabularies" element={<AdminVocabularies />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
