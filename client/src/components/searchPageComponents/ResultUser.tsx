import { ApiResponse, userDataTypes } from "@/types/type";
import PeerUserWrapper from "../Shared/PeerUser/PeerUserWrapper";
import Profile from "../Shared/Profile/Profile";
import { Button } from "../ui/button";
import AddIcon from "@/assets/svgs/AddIcon";
// import { useQuery } from "react-query";
import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import { toast } from "react-toastify";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import socket from "@/Socket";
// import { AxiosResponse } from "axios";

type resultUserType = {
  user: userDataTypes;
};

// const sendFriendRequest = async (id: string) => {
//   return apiAxios.post(
//       "/notification/request-friend",
//       { receiverId: id }
//     );

// };

const ResultUser = ({ user }: resultUserType) => {
  const { username, email, profilePicture: pic, _id } = user;
  const [isLoading, setIsLoading] = useState(false);
  // const { isLoading, error, refetch ,data} = useQuery(
  //   "requestFriend"+_id,
  //   () => sendFriendRequest(_id),
  //   {
  //     enabled: false, // Disable the query initially
  //     retry: false, // Don't retry on error
  //   }
  // );

  const sendFriendRequest = async (id: string) => {
    try {
      setIsLoading(true);
      const res: ApiResponse<{
        error: string;
        message: string;
        notification: string[];
      }> = await apiAxios.post("/notification/request-friend", {
        receiverId: id,
      });
      console.log(res);

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res.data.message, successsToastOptions);
      }
      if (res?.status === 201) {
        // in 201 rrreq is sent in 200 req already exists thats by emited in different check
        socket.emit("notification", res.data.notification);
      }
      // if (res?.status === 400) {
      //   toast.error(res.data.message, errorToastOptions);
      // }
    } catch (err) {
      console.log(err);

      if (err?.response?.status === 400) {
        return toast.error(err.response.data.message, errorToastOptions);
      }
      toast.error("Something Went Wrong!!", errorToastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() =>{
  //   console.log(data);

  // },[data])

  // const handleClick = () => {
  //   refetch();
  // };

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <>
      <PeerUserWrapper>
        {/* <div className="flex justify-between w-full items-center"> */}
        <div className="flex  items-center gap-4 ">
          <Profile src={pic} alt="resultuser" h={"40"} />

          {/* <img src={user.pic} alt="resultuser" /> */}
          <div>
            <p>{username}</p>
            <p className=" text-xs text-gray-400 ">{email}</p>
          </div>
        </div>
        <Button
          variant="myMain"
          size="sm"
          // onClick={signInHandler}
          // disabled={loading}
          className=" rounded-full px-5 h-8"
          onClick={() => sendFriendRequest(_id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AddIcon />
          )}{" "}
        </Button>
        {/* </div> */}
      </PeerUserWrapper>
    </>
  );
};

export default ResultUser;
