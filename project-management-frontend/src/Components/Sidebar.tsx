import { Sidebar } from "flowbite-react";
import { HiChartPie, HiClipboardList, HiUser, HiLogout } from "react-icons/hi";

const SidebarComponent = () => {
  return (
    <Sidebar className="h-screen w-64">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiClipboardList}>
            Projects
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Profile
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiLogout}>
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;
