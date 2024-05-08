  import SearchIcon from "@/assets/svgs/SearchIcon";
  import { Input, InputProps } from "../ui/input";
  import './style.css'
import { ChangeEvent } from "react";

interface  SearchBarProps  {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  // Add other props if needed
}

const SearchBar: React.FC<InputProps & SearchBarProps> = ({ onChange,placeholder }) => {
  return (
    <div className="relative  md:grow-0  w-full">
      <div className="search absolute left-3 top-3 h-4 w-4 text-muted-foreground">
        <SearchIcon height="16" />
      </div>
      <Input
        type="search"
        // placeholder="Discover peoples"
        className="w-full rounded-full bg-background pl-8 search_bar_custom border-none text-base h-10"
        onChange={onChange}
        // value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

  export default SearchBar;
