import { useState } from "react";

export const useHandleChange = <T>(initialState:T) :[ T, (e: React.ChangeEvent<HTMLInputElement>)=>void] => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return [formData, handleChange];
};
