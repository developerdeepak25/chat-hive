import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import FallBack from "@/components/Fallback/FallBack";
import ChatPlaceHolder from "@/components/Shared/ChatplaceHolder/ChatPlaceHolder";
import SideColumnWrapper from "@/components/Shared/SideColumnWrapper/SideColumnWrapper";
import UsersScrobleContainer from "@/components/Shared/UsersScrobleContainer/UsersScrobleContainer";
import SearchBar from "@/components/input/SearchBar";
import ResultUser from "@/components/searchPageComponents/ResultUser";
import { UserDataType } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useState } from "react";

const fetchUsers = async (query: string) => {
  const response = await privateAxios.get(`/user/get-users?q=${query}`);
  return response.data;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = debounce(setQuery, 500);

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery<UserDataType[]>({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(query),
    enabled: !!query, // only fetch when query is not empty
  });

  return (
    <>
      <SideColumnWrapper>
        <div className="flex flex-col gap-7">
          <div className="w-full  mt-6 px-4 ">
            <SearchBar
              // onChange={(e) => {
              //   setQuery(e.target.value);
              // }}
              onChange={(e) => {
                debouncedQuery(e.target.value);
              }}
              placeholder="search name or email"
            />
          </div>
          <h2 className=" text-2xl font-medium px-4">Results</h2>
        </div>
        {/* <div className="flex flex-col border_t_stoke overflow-y-hidden">
            <div className=" overflow-y-auto "> */}
        <UsersScrobleContainer>
          {isLoading && <FallBack size={25} />}
          {isError && <p className="pt-5 text-center">Error fetching data</p>}
          {result?.length === 0 && (
            <div className="pt-5 text-center">No Match Found</div>
          )}
          {result?.map((user) => (
            <ResultUser user={user} key={user._id} />
          ))}
          {!result && !isLoading && (
            <p className="pt-5 text-center">No Searches</p>
          )}
        </UsersScrobleContainer>
      </SideColumnWrapper>
      <ChatPlaceHolder />
    </>
  );
};

export default SearchPage;
