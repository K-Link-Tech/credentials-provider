import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const App: React.FC = () => {
  const isUserValid = localStorage.getItem("accessToken");
  return !!isUserValid ? <Outlet /> : <Navigate to={"/login"} />;
};

export default App;
