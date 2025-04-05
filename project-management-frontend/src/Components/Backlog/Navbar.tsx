import React from "react";
import { Navbar, TextInput, Avatar } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

const CustomNavbar: React.FC = () => {
  return (
    <Navbar className="fixed top-0 z-50 w-full bg-white px-4 py-2 shadow-md">
      <div className="mx-auto flex w-full max-w-4xl items-center">
        {/* Search Box on the Left */}
        <TextInput
          icon={HiSearch}
          placeholder="Rechercher..."
          className="w-64"
        />

        {/* Avatars Next to the Search Box */}
        <div className="ml-4 flex items-center gap-3">
          <Avatar img="https://i.pravatar.cc/40?img=1" rounded className="cursor-pointer" />
          <Avatar img="https://i.pravatar.cc/40?img=2" rounded className="cursor-pointer" />
        </div>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
