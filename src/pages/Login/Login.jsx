import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc"; 
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
  const { user, signInGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleLogin = async () => {
    try {
      const result = await signInGoogle();
      const loggedInUser = result.user;

      if (loggedInUser) {
        const userData = {
          uid: loggedInUser.uid,
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
        };

        
        await axiosPublic.post(`/user/${loggedInUser?.email}`, userData);
      }

      navigate("/");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-gray-600 mb-4">Sign in to continue</p>
        
        <button
          onClick={handleLogin}
          className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-3 text-gray-700 hover:shadow-md transition duration-300"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </button>

        <p className="text-gray-500 text-sm mt-4">
          By continuing, you agree to our{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            Terms & Conditions
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;


