import { useState } from "react";
import Card from "../cards/LoginCard";
import useStore from "@/store/useStore";

interface SignInFormProps {
  onSignIn: Function;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const loginErrorStatus = useStore((state) => state.loginErrorStatus);

  const handleSignIn: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const userPayload = {
      email: email,
      password: pwd,
    };
    console.log("user", userPayload);
    onSignIn(userPayload);
  };

  return (
    <Card>
      <h1 className="text-5xl font-semibold">Login</h1>
      {loginErrorStatus ? <p className="text-lg font-medium text-red-500 mt-4">
        Your email or password is incorrect.
      </p> : <p className="text-lg font-medium text-gray-400 mt-4">
        Enter your details to login.
      </p>}
      <form className="mt-4" onSubmit={handleSignIn}>
        <div>
          <label className="text-lg font-medium">Email:</label>
          <input
            className="w-full border-2 bg-white rounded-xl p-4 mt-1 text-black"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div>
          <label className="text-lg font-medium">Password:</label>
          <input
            className="w-full border-2 bg-white rounded-xl p-4 mt-1 text-black"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
        </div>
        <div className="mt-8">
          <div>
            <input type="checkbox" id="remember" />
            <label className="ml-2 font-medium text-base" htmlFor="remember">
              Remember password
            </label>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <button className="bg-blue-700 text-white text-lg font-bold py-4 rounded-xl active:scale-[0.98] active:duration-75 hover:scale-[1.01] transition-all">
            Sign in
          </button>
        </div>
      </form>
    </Card>
  );
};

export default SignInForm;
