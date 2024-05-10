import { Button } from "@/components/ui/button";
import FormWrapper from "../../../components/formComponents/FormWrapper";
import InputLabeled from "@/components/input/InputLabeled";
import Heading from "@/components/text/Heading";
import TextSmall from "@/components/text/TextSmall";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFormValidation } from "@/Hooks/useValidation";
import { toast } from "react-toastify";
import { authAxios } from "@/AxiosInstance/AxiosInstance";
import {  signin } from "@/store/slices/authSlice";
import { ApiResponse, signInResponse } from "@/types/type";
import { useHandleChange } from "@/Hooks/useHandleChange";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { useAppDispatch } from "@/store/hooks";
import GoogleSignIn from "@/components/google/GoogleSignIn";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";

// type signInResponse = {
//   _id: string;
//   name: string;
//   email: string;
//   userPic?: string;
//   error?: string;
//   accessToken: string;
// };
const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, handleChange] = useHandleChange<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const isNotValid = useFormValidation(formData);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const signInHandler = async () => {
    setLoading(true);
    console.log("inside handler");

    try {
      console.log(isNotValid);

      if (isNotValid) {
        return toast.error("fill all the fields", errorToastOptions);
      }

      const { status, data }: ApiResponse<signInResponse> =
        await authAxios.post("/signin", formData);
      // console.log(res);

      console.log(data, status);

      if (status === 200) {
        if (data) {
          dispatch(signin(data));
          dispatch(addUnreadNotifications(data.unreadNotifications));
        }

        toast.success("Signed in successfully", successsToastOptions);

        navigate("/");
      }
    } catch (error:any) {
      const { status, data } = error.response;

      console.log("inside catch", error);
      // console.log(error.response);
      if (status === 400 || status === 401) {
        // console.log(data.error);

        return toast.error(data.error, errorToastOptions);
      }
      return toast.error("Something went Wrong!!", errorToastOptions);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <FormWrapper>
        <Heading>Welcome Back</Heading>
        <InputLabeled
          label="Email"
          type="email"
          id="email"
          onChange={handleChange}
        />

        <InputLabeled
          label="Password"
          type="password"
          id="password"
          onChange={handleChange}
        />

        <div className=" flex flex-col gap-3">
          <Button
            variant="myMain"
            size="smAuth"
            onClick={signInHandler}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{" "}
            Sign In
          </Button>
          <TextSmall>or</TextSmall>
          {/* <Button variant="auth" size="smAuth">
            Continue with Google
          </Button> */}
          <GoogleSignIn />

          <TextSmall className="text-xs mt-4">
            Don’t have an account?{" "}
            <span className="sign_link cursor-pointer">
              <NavLink to={"/auth/signup"}>Sign up here!</NavLink>
            </span>
          </TextSmall>
        </div>
      </FormWrapper>
    </>
  );
};

export default SignIn;
