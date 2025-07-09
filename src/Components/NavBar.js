import React from "react";

const NavBar = () => {
  return (
    <nav className="flex md:min-h-[10vh] flex-wrap items-center justify-center md:justify-between px-8 py-4 bg-[#350d56] text-white">
      {/* Logo and Company Name */}
      <div className="flex items-center min-w-0">
        {/* Logo */}
        <img
          src="/logoView.png"
          alt="Company Logo"
          className="h-14  mr-4 object-cover bg-white"
        />
        {/* Company Name */}
        <a href="/">
          <span className="font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis">
            Hariom Advertising Company
          </span>
        </a>
      </div>
      {/* GST No. and Address */}
      <div
        className="flex flex-col items-center min-w-0
        md:items-end max-sm:text-left max-sm:mt-2 "
      >
        <span className="text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          GST No. 07AUAPA8929Q1Z5
        </span>
        <span className="text-sm text-slate-300  text-right whitespace-nowrap overflow-hidden text-ellipsis">
          Address: 10/22, Ground Floor, East Patel Nagar, Opposite YES Bank, New
          Delhi-110008
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
