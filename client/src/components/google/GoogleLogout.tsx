import { googleLogout } from "@react-oauth/google";
import { Button } from "../ui/button";

// this is abondended
const GoogleLogoutComp = () => {
  const handleLogout = () => {
    console.log('logggingout');
    
   googleLogout();

  };

  return <Button onClick={() => handleLogout()}>logout</Button>;
};

export default GoogleLogoutComp;
