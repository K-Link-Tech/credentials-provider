// import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MainNavigation: React.FC = () => {
  return (
    <header className="w-full h-20 flex items-center justify-between bg-white p-5">
      <div className="font-bold text-2xl text-cyan-900">
        Credential Provider
      </div>
      <nav>
        <ul className="flex text-base items-center space-x-4 first:pl-0 last:pr-0">  {/* unordered list */}
          <li className="hover:underline">
            <Link
              className="p-2 bg-sky-300 rounded-xl hover:bg-sky-500 active:bg-sky-600"
              to="login"
            >
              Login
            </Link>
          </li>
          {/* <Button asChild>
            <Link to="/login">Login</Link>
          </Button> */}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
