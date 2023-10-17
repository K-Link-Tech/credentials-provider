import { useErrorBoundary } from 'react-error-boundary';
import SignInForm from '../components/SignInForm';
import axios from 'axios';
import { LOGIN_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

type LoginResponseObj = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: "admin" | "user";
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  }
}
interface IUserPayload {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  const loginUserHandler = async (userPayload: IUserPayload) => {
    console.log('posting backend...');
    console.log('Login_url', LOGIN_URL);
    await axios
      .post(LOGIN_URL, userPayload)
      .then((r) => {
        console.log("res", r);
        const data: LoginResponseObj = r.data;
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate('/home');
      })
      .catch((error) => {
        console.error(error);
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
