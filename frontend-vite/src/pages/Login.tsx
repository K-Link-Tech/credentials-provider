// import { useErrorBoundary } from 'react-error-boundary';
import { useMutation } from '@tanstack/react-query';
import SignInForm from '../components/forms/SignInForm';
import { LOGIN_URL } from '../utils/constants';
import { logUserIn } from '@/api/users';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store/useStore';

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
  const navigate = useNavigate();
  const setLogin = useStore((state) => state.setLogin);
  const setUserId = useStore((state) => state.setUserId);
  const setLoginError = useStore((state) => state.setLoginError);
  const removeLoginError = useStore((state) => state.removeLoginError);

  localStorage.clear();
  
  const mutation = useMutation({
    mutationFn: logUserIn,
    onSuccess: (r) => {
      const data: LoginResponseObj = r.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserId(data.user.id);
      removeLoginError();
      setLogin();

      navigate("/home", { replace: true });
    },
    onError: (error) => {
      console.error(error);
      setLoginError();
      navigate("/login", { replace: true });
    }
  })
  
  const loginUserHandler = async (userPayload: IUserPayload) => {
    console.log('posting backend...');
    console.log('Login_url', LOGIN_URL);
    mutation.mutate(userPayload); 
  };
  
  return (
    <div className="flex w-full h-screen items-top align-middle justify-between">
      <div className="hidden lg:flex h-screen w-1/2 items-center justify-center bg-transparent text-k-link-blue font-bold text-6xl">
        Insert Logo Here
      </div>
      <SignInForm onSignIn={loginUserHandler} />
    </div>
  );
};

export default Login;
