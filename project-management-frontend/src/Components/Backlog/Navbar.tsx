import React from "react";
import { Navbar, TextInput, Avatar } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

const CustomNavbar: React.FC = () => {
  return (
    <Navbar className="bg-white shadow-md px-4 py-2 fixed top-0 w-full z-50">
      <div className="flex items-center w-full max-w-4xl mx-auto">
        {/* Search Box on the Left */}
        <TextInput
          icon={HiSearch}
          placeholder="Rechercher..."
          className="w-64"
        />

        {/* Avatars Next to the Search Box */}
        <div className="flex items-center gap-3 ml-4">
          <Avatar img="https://i.pravatar.cc/40?img=1" rounded className="cursor-pointer" />
          <Avatar img="https://i.pravatar.cc/40?img=2" rounded className="cursor-pointer" />
        </div>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
