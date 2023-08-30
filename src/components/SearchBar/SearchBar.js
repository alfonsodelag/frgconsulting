import React from "react";
import ArrowLeft from "../../assets/png/arrow-left.png";
import SearchIcon from "../../assets/png/search-icon.png";

const SearchBar = ({ searchTerm, setSearchTerm, onBack }) => {
  return (
    <div className="mt-8 mb-5">
      <div className="flex justify-between items-center">
        <img
          src={ArrowLeft}
          alt="arrow left"
          height={50}
          width={50}
          onClick={onBack}
        />
        <div className="flex w-11/12 justify-between items-center relative">
          <input
            type="text"
            className="w-full rounded-2xl border-none p-0 text-white"
            placeholder="Search Podcasts"
            style={{
              backgroundColor: "#1A1A1A",
              height: "50px",
              paddingLeft: "45px",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src={SearchIcon}
            className="absolute bottom-3.5 left-3"
            alt="Magnifying Glass"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
