import { ReactNode, createContext, useContext, useState } from "react";

type ToastContextType = {
  toastId: string | number | undefined;
  setToastId: (id: string | number | undefined) => void;
};

// Instead of context i could have used redux but i have never used context (used but not in a project ). so used for just understanding working, testing context  and for etc i used context api  

const CallToastContext = createContext<ToastContextType | undefined>(undefined);
export const CallToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  return (
    <CallToastContext.Provider value={{ toastId, setToastId }}>
      {children}
    </CallToastContext.Provider>
  );
};

export const useCallToastContext = () => {
  const context = useContext(CallToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
