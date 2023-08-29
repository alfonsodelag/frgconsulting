import React from "react";
import Cover from "../../assets/png/cover.png";

const Header = () => {
  return (
    <div>
      <img
        src={Cover}
        alt="cover"
        className="rounded-2xl h-72 w-full object-cover transform scale-x-[-1]"
      />
    </div>
  );
};

export default Header;
