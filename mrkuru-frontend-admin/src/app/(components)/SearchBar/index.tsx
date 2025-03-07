import { SearchIcon } from "lucide-react";
import React from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="relative flex items-center border-2 border-gray-300 rounded-lg shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 text-base sm:text-sm">
      <SearchIcon className="w-5 h-5 ml-4 text-gray-500 shrink-0" />
      <input
        aria-label="Search products"
        className="w-full py-3 pl-2 pr-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
