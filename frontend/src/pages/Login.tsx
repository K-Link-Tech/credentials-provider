import { useErrorBoundary } from 'react-error-boundary';
import SignInForm from '../components/SignInForm';
import axios from 'axios';
import { BACKEND_API, LOGIN_URL } from '../utils/constants';

interface IUserPayload {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { showBoundary } = useErrorBoundary();
  const loginUserHandler = async (userPayload: IUserPayload) => {
    await axios
      .post(LOGIN_URL, userPayload)
      .then((r) => {
        console.log('res', r);
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
