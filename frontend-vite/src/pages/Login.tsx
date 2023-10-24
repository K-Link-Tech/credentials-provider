// import { useErrorBoundary } from 'react-error-boundary';
import { useMutation } from '@tanstack/react-query';
import SignInForm from '../components/SignInForm';
import { LOGIN_URL } from '../utils/constants';
import { logUserIn } from '@/api/users';
import { useErrorBoundary } from 'react-error-boundary';
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

  const mutation = useMutation({
    mutationFn: logUserIn,
    onSuccess: (r) => {
      // console.log("res", r);
      const data: LoginResponseObj = r.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    },
    onError: (error) => {
      console.error(error);
      showBoundary(error);
    }
  })
  
  const loginUserHandler = async (userPayload: IUserPayload) => {
    console.log('posting backend...');
    console.log('Login_url', LOGIN_URL);
    mutation.mutate(userPayload); 
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
