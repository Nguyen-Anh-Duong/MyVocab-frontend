import { Outlet } from "react-router";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="font-inter flex min-h-screen flex-col bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
