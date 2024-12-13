import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/UserSlice";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoURL: resultsFromGoogle.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        dispatch(signInSuccess(data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(">>> Show Error: ", error);
    }
  };
  return (
    <Button
      className="w-full items-center justify-center mt-2"
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={() => handleGoogleClick()}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2 text-stone-600" />
      Continue With Google
    </Button>
  );
}
