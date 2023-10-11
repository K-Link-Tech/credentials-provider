import { useState } from "react";
import Card from "./cards/LoginCard";

interface SignInFormProps {
  onSignIn: Function;
}

const SignInForm: React.FC<SignInFormProps> = (props) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSignIn: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const userPayload = {
      email: email,
      password: pwd,
    };
    props.onSignIn(userPayload);
    // setUser("");
    // setPwd("");
  };

  return (
    <Card>
      <h1 className="text-5xl font-semibold">Login</h1>
      <p className="text-base font-medium text-gray-500 mt-4">
        Enter your details to login.
      </p>
      <form className="mt-8" onSubmit={handleSignIn}>
        <div>
          <label className="text-lg font-medium">Email:</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <label className="text-lg font-medium">Password:</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
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
