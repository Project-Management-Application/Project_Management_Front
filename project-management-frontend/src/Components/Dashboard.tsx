import SidebarComponent from "./Sidebar";
import Topbar from "./Topbar";

const Home = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-md">
        <SidebarComponent />
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex w-full flex-col">
        {/* Fixed Topbar */}
        <header className="fixed left-64 right-0 top-0 z-10 w-full bg-white shadow-md">
          <Topbar />
        </header>

        {/* Page Content */}
        <main className="mt-16 flex-1 bg-gray-100 p-6">
          <h1 className="text-2xl font-bold">Welcome to Project Management</h1>
        </main>
      </div>
    </div>
  );
};

export default Home;
