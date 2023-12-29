import React from "react";
import MainNavigation from "./MainNavigation";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "@/api/axios";
import useStore from "@/store/useStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const setLogout = useStore((state) => state.setLogout);
  const navigate = useNavigate();
  setupInterceptors(navigate, setLogout);
  return (
    <div>
      <MainNavigation />
      <main className="flex-row h-screen w-full align-middle p-10">
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
