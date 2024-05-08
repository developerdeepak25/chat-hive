import { useEffect, useState } from "react";

type InputObject = {
  [key: string]: string;
};

export const useFormValidation = (inputObj: InputObject): boolean => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const isNotValid = Object.values(inputObj).some(
      (input) => input.trim() === ""
    );
    // console.log('isNotValid', isNotValid);
    setDisabled(isNotValid);
  }, [inputObj]);

  return disabled;
};
