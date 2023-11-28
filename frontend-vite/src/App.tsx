import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useStore from "./store/useStore";

const App: React.FC = () => {
  const isUserValid = useStore((state) => state.loginStatus);
  return isUserValid ? <Outlet /> : <Navigate to={"/login"} />;
};

export default App;
