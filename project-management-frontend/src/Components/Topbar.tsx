import { Navbar, Dropdown, Avatar } from "flowbite-react";

const Topbar = () => {
  return (
    <Navbar className="fixed left-64 right-0 top-0 z-50 border-b bg-white px-4 py-2 shadow-md">
      {/* Left Section - Logo */}
      <Navbar.Brand href="#">
        <span className="text-xl font-semibold">Project Manager</span>
      </Navbar.Brand>

      {/* Right Section - Profile */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full border border-gray-300 py-2 pl-10 pr-4"
          />
        </div>

        {/* User Profile */}
        <Dropdown
          inline
          label={
            <Avatar
              alt="User"
              img="https://i.pravatar.cc/40"
              rounded
              className="h-10 w-10"
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">John Doe</span>
            <span className="block text-sm font-medium text-gray-500">
              johndoe@example.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Topbar;
