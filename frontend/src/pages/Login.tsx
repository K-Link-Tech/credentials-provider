import { useErrorBoundary } from "react-error-boundary";
import SignInForm from "../components/SignInForm";
import axios from "axios";

interface IUserPayload {
  email: string
  password: string
}

const LOGIN_URL = "http://localhost:3000/api/auth/login";

const Login: React.FC = () => {
  const { showBoundary } = useErrorBoundary();
  const loginUserHandler = async (userPayload: IUserPayload) => {
    // throw new Error("Invalid username and/or password entry!");
    await axios
      .post(
        LOGIN_URL,
        {
          email: userPayload.email,
          password: userPayload.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((r) => {
        console.log(r);
      })
      .catch((error) => {
        showBoundary(error);
      });
  };
  return (
    <div className="flex w-full h-screen items-top align-middle justify-between">
      <div className="hidden lg:flex h-screen w-1/2 items-center justify-center bg-transparent text-white font-bold text-6xl">
        Insert Logo Here
      </div>
      <SignInForm onSignIn={loginUserHandler} />
    </div>
  );
};

export default Login;
