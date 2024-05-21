import { Button } from "../ui/button";
import GoogleLogo from "@/assets/svgs/GoogleLogo";
import { publicAxios } from "@/AxiosInstance/AxiosInstance";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import { useState } from "react";
import { toast } from "react-toastify";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "@/store/slices/authSlice";
// import { AxiosResponse } from "axios";
import { ApiResponse, SignInResponse } from "@/types/type";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";

type GoogleSignInCredentials = {
  name: string | null;
  email: string | null;
  image: string | null;
  uid: string | null;
};

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendGoogleSignInCredentialToBackend = async (
    payload: GoogleSignInCredentials
  ) => {
    // Make an axios request to your backend with the credential
    try {
      const res: ApiResponse<SignInResponse> = await publicAxios.post(
        "/google-sign-in",
        payload
      );
      console.log(res);
      // console.log(res.data);
      return res;
    } catch (error) {
      console.error(error);
      // return error;
    }
  };

  const googleAuth = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log("🚀 ~ .then ~ result:", result);
        const { displayName, email, photoURL, uid } = result.user;
        // if (!(status && data)) return
        const res: ApiResponse<SignInResponse> | undefined =
          await sendGoogleSignInCredentialToBackend({
            name: displayName,
            email: email,
            image: photoURL,
            uid: uid,
          });
        if (!res) return;
        const { status, data } = res;
        // if (status === undefined || data === undefined) return;

        if (status === 200) {
          // if (data) {
          dispatch(signin(data));
          dispatch(addUnreadNotifications(data.unreadNotifications));

          // }

          toast.success("Signed in successfully", successsToastOptions);

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);

        if (!error.response)
          return toast.error("Something went Wrong!!", errorToastOptions);
        const { status, data } = error.response;
        if (status === 400 || status === 401) {
          // console.log(data.error);
          return toast.error(data?.error, errorToastOptions);
        }
        // Handle Errors here.
        console.error(error);
        return toast.error("Something went Wrong!!", errorToastOptions);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button
      variant="myMain"
      size="smAuth"
      className="flex gap-2"
      onClick={() => googleAuth()}
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{" "}
      <GoogleLogo />
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
