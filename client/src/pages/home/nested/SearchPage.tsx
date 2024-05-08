import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import ChatPlaceHolder from "@/components/Shared/ChatplaceHolder/ChatPlaceHolder";
import UsersScrobleContainer from "@/components/Shared/UsersScrobleContainer/UsersScrobleContainer";
import SearchBar from "@/components/input/SearchBar";
import ResultUser from "@/components/searchPageComponents/ResultUser";
import { userDataTypes } from "@/types/type";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const SearchPage = () => {
  const [result, setResult] = useState<userDataTypes[]>();
  const [query, setQuery] = useState("");
  console.log(query);

  const fetchSearchResults = useCallback(
    debounce(async (q) => {
      // if (query === '') return
      try {
        const response = await apiAxios.get(`/user/get-users?q=${q}`);
        console.log(response);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500),
    [debounce]
  );

  useEffect(() => {
    
    console.log(result);
  }, [result]);

  useEffect(() => {
    if (!query) return;
    fetchSearchResults(query);
  }, [fetchSearchResults, query]);

  return (
    <>
      <div className="w-[400px] h-full grid  border_r_stroke overflow-y-hidden">
        <div className="w-full h-full flex flex-col  gap-7 overflow-y-auto">
          <div className="flex flex-col gap-7">
            <div className="w-full  mt-6 px-4 ">
              <SearchBar
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Discover peoples"
              />
            </div>
            <h2 className=" text-2xl font-medium px-4">Results</h2>
          </div>
          {/* <div className="flex flex-col border_t_stoke overflow-y-hidden">
            <div className=" overflow-y-auto "> */}
          <UsersScrobleContainer>
            {result?.length === 0 && (
              <div className="pt-5 text-center">No Match Found</div>
            )}
            {result ? (
              result?.map((user) => <ResultUser user={user} key={user._id} />)
            ) : (
              <p className="pt-5 text-center">No Searches</p>
            )}
          </UsersScrobleContainer>
        </div>
      </div>
      <ChatPlaceHolder />
    </>
  );
};

export default SearchPage;
