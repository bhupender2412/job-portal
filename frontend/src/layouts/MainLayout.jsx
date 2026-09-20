import {
  Outlet,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fc]">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;