import React from "react";
import MainNavigation from "./MainNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
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
