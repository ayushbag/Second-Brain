import { UserRound } from "lucide-react";
import GoogleIcon from "../icon/GoogleIcon";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebaseAuth";
import { toast } from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleForm = useCallback(
    async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredentials) => {
              const idtoken = await userCredentials.user.getIdToken(true)
              await axios.post("http://localhost:3000/user/register", {
                idtoken: idtoken
              }).then((resp) => {
                if (resp.status === 200) {
                  localStorage.setItem("Authorization", idtoken);
                  navigate("/app")
                  return toast.success("User Registered!")
                } else {
                  return toast.error("Unable to register, try again!")
                }
              }).catch((err) => {
                console.log(err)
                return toast.error("Internal server error")
              })
            })
            .catch((error) => {
              const errorMessage: string = error.code;
              switch (errorMessage) {
                case "auth/weak-password":
                  toast.error("weak password");
                  break;
                case "auth/email-already-in-use":
                  toast.error("email already in use");
                  break;
                case "auth/invalid-email":
                  toast.error("invalid email");
                  break;
                case "auth/operation-not-allowed":
                  toast.error("email/password accounts are not enabled");
                  break;
                default:
                  break;
              }
            });
        } catch (error) {
          return toast.error("Unexpected error")
        }  
    },[email, password])

    const handleGoogleSubmit = async() => {
      const provider = new GoogleAuthProvider()
      try {
        await signInWithPopup(auth, provider)
          .then(async(result) => {
            const idtoken = await result.user.getIdToken(true)
            if (!String(idtoken).length || idtoken === undefined) {
              return toast.error("error while sigin")
            }
            try {
              await axios.post("http://localhost:3000/user/register", {
                idtoken: idtoken
              }).then((resp) => {
                if (resp.status === 200) {
                  localStorage.setItem("Authorization", idtoken)

                  if (resp.data.userExists) {
                    toast.success("Welcome back!");
                  } else {
                    toast.success("User Registered Successfully");
                  }

                  navigate("/app")
                }
                if (resp.status === 409) {
                  localStorage.setItem("Authorization", idtoken)
                  return toast.error("User Already Exists")
                }
                if(resp.status=== 403) {
                  return toast.error("Error!")
                }
                if (resp.status===500) {
                  return toast.error("Internal Server Error")
                }
              }).catch((error) => {
                console.log(error)
                return toast.error("Axios Error")
              })
            } catch (error) {
              console.log(error)
              return toast.error("Internal server error")
            }
          }).catch((error) => {
            console.log(error.code)
            return toast.error(error.code)
          })
      } catch (error) {
        return toast.error("Internal server error")
      }
    }

  return (
    <section className="flex items-center justify-center mx-auto text-white h-screen bg-zinc-950">
      <div className="logindiv w-full lg:w-3/5 mx-auto flex items-center justify-center h-full pt-9 relative">
        <div className="absolute top-4 right-4 text-zinc-200 flex items-center justify-center space-x-2 font-mona font-light">
          <p className="text-xs text-zinc-300">Have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="text-zinc-100 text-sm bg-zinc-800 px-2 py-1 border border-zinc-600 hover:bg-zinc-700 rounded-md hover:no-underline"
          >
            Login
          </button>
        </div>
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-zinc-900 rounded-full mb-2 border border-zinc-800">
              <UserRound />
            </div>
            <h2 className="font-dmSans text-2xl font-semibold py-1">
              Create your Account
            </h2>
            <p className="font-mona text-xs text-zinc-200">
              Enter your details to register
            </p>
          </div>
          <form  onSubmit={handleForm}  className="flex flex-col font-mona text-start pt-6 w-64">
            <label htmlFor="email" className="text-sm text-zinc-200">
              Email
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              type="text"
              className="rounded-md p-2 mt-1 mb-3 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
              placeholder="Enter your email"
            />
            <label htmlFor="password" className="text-sm text-zinc-200 pt-1">
              Password
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              type="password"
              className="rounded-md p-2 mt-1 mb-3 bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full placeholder:text-sm"
              placeholder="Enter your password"
            />
            <button type="submit" className="bg-gradient-to-b from-violet-700 to-purple-600 text-white rounded-md p-2 mt-3">
              Register
            </button>
          </form>
          <button
            onClick={handleGoogleSubmit}
            className="bg-zinc-900 border border-zinc-700 font-mona px-6 text-white rounded-md py-3 mt-4 flex items-center justify-center w-full hover:bg-zinc-800 transition-all duration-200"
          >
            <div className="w-7 h-7 mr-1">
              <GoogleIcon />
            </div>
            Sign up with Google
          </button>
        </div>
      </div>
      <div
        className="lg:w-4/5 text-center rounded-3xl hidden lg:block lg:bg-gradient-to-br lg:from-violet-800 lg:via-violet-600 lg:to-violet-300 transition-all duration-300 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/LoginBackgroundS.jpg')" }}
      ></div>
    </section>
  );
};

export default Register;
