import { publicAxios } from "@/AxiosInstance/AxiosInstance";
import { useHandleChange } from "@/Hooks/useHandleChange";
import { useFormValidation } from "@/Hooks/useValidation";
import FormWrapper from "@/components/formComponents/FormWrapper";
import GoogleSignIn from "@/components/google/GoogleSignIn";
import InputLabeled from "@/components/input/InputLabeled";
import Heading from "@/components/text/Heading";
import TextSmall from "@/components/text/TextSmall";
import { Button } from "@/components/ui/button";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, handleChange] = useHandleChange<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const isNotValid = useFormValidation(formData);

  const signInHandler = async () => {
    if (isNotValid) {
      return toast.error("fill all the fields", errorToastOptions);
    }
    try {
      setLoading(true);
      const { status } = await publicAxios.post("/signup", formData);

      if (status === 200) {
        toast.success("Signed up successfully", successsToastOptions);
        navigate("/auth/signin");
      }
    } catch (error:any) {
      const { status, data } = error.response;

      console.log(error);
      if (status === 400) {
        return toast.error(data.error, errorToastOptions);
      }
      return toast.error("Something Went Wrong!!", errorToastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormWrapper>
        <Heading>Create your Account</Heading>
        <InputLabeled
          label="Name"
          type="text"
          id="name"
          onChange={handleChange}
        />
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
            Sign Up
          </Button>
          <TextSmall>or</TextSmall>
          <GoogleSignIn />
          {/* <GoogleLogoutComp/> */}
          {/* <Button variant="auth" size="smAuth">
            Continue with Google
          </Button> */}
          <TextSmall className="text-xs mt-4">
            Already have an account?
            <span className="sign_link cursor-pointer">
              {" "}
              <NavLink to={"/auth/signin"}>Sign in here!</NavLink>
            </span>
          </TextSmall>
        </div>
      </FormWrapper>
    </>
  );
};

export default SignUp;
