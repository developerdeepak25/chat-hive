import { UserDataType } from "@/types/type";
import PeerUserWrapper from "../Shared/PeerUser/PeerUserWrapper";
import Profile from "../Shared/Profile/Profile";
import { Button } from "../ui/button";
import AddIcon from "@/assets/svgs/AddIcon";
// import { useQuery } from "react-query";
import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import { toast } from "react-toastify";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import socket from "@/Socket";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
// import { AxiosResponse } from "axios";

type ResultUserType = {
  user: UserDataType;
};



const ResultUser = ({ user }: ResultUserType) => {
  const { username, email, profilePicture: pic, _id } = user;
 

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await privateAxios.post("/notification/request-friend", {
        receiverId: id,
      });
      return res;
    },
    onSuccess: (res) => {
      if (res?.status === 200 || res?.status === 201) {
        toast.success(res.data.message, successsToastOptions);
      }
      if (res?.status === 201) {
        // in 201 rrreq is sent in 200 req already exists thats by emited in different check
        socket.emit("notification", res.data.notification);
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);

      if (!err.response) return;
      if (err.response.status === 400) {
        if (err.response.data.message) {
          return toast.error(err.response.data?.message, errorToastOptions);
        }
      }
      toast.error("Something Went Wrong!!", errorToastOptions);
    },
  });

  useEffect(() => {
    console.log(isPending);
  }, [isPending]);

  return (
    <>
      <PeerUserWrapper>
        {/* <div className="flex justify-between w-full items-center"> */}
        <div className=" w-full flex min-w-0 gap-4 justify-between items-center">
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
            onClick={() => mutate(_id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AddIcon />
            )}{" "}
          </Button>
        </div>
      </PeerUserWrapper>
    </>
  );
};

export default ResultUser;
