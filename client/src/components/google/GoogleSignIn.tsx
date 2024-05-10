import { Button } from "../ui/button";
import GoogleLogo from "@/assets/svgs/GoogleLogo";
import { authAxios } from "@/AxiosInstance/AxiosInstance";
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
import { ApiResponse, signInResponse } from "@/types/type";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";

type GoogleSignInCredentials = {
  name: string | null;
  email: string | null;
  image: string | null;
  uid: string | null;
};
// type GoogleSignInResponse = {
//   _id: string;
//   name: string;
//   email: string;
//   userPic?: string;
//   error?: string;
//   accessToken: string;
// };
// interface BackendResponse {
//   status: number;
//   data: GoogleSignInResponse; // Assuming GoogleSignInResponse is your expected response data structure
// }

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const onGoogleLogin = (credentialResponse) => {
  //   // Send the credentialResponse to your backend for verification and further processing
  //   console.log('here');

  //   sendGoogleSignInCredentialToBackend({
  //     id_token: credentialResponse.credential,
  //     access_token: credentialResponse.access_token,
  //   });

  //   console.log("credentialResponse", credentialResponse);
  //   console.log(credentialResponse.credential);
  //   const decoded = jwtDecode(credentialResponse.access_token);
  //   console.log(decoded);

  // };
  // const login = useGoogleLogin({
  //   onSuccess: onGoogleLogin,
  //   onError: () => {
  //     console.error("Google sign-in failed.");

  //   },
  //   // clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //   // flow: 'auth-code'
  // });

  // const handleLogin = (response) => {
  //   const googleToken = response.credential;
  //   // Send the Google token to your backend for verification and user creation (if needed)
  //   console.log(response);
  //   console.log(googleToken);

  // };
  const sendGoogleSignInCredentialToBackend = async (
    payload: GoogleSignInCredentials
  ) => {
    // Make an axios request to your backend with the credential
    try {
      const res: ApiResponse<signInResponse> = await authAxios.post(
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
        const res: ApiResponse<signInResponse> | undefined =
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
        
        if (!error.response) return toast.error("Something went Wrong!!", errorToastOptions);
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
    // <div className="flex w-full justify-center">
    //   <GoogleLogin
    //     clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    //     buttonText="Sign in with Google"
    //     onSuccess={handleLogin}
    //     onFailure={() => console.log("something went wrong")}
    //     size="large"
    //     cookiePolicy={"single_host_origin"} // Optional cookie policy for security

    //   />
    // </div>
  );
};

export default GoogleSignIn;
