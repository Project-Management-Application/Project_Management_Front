import { useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Dashboard/Header/Header';
import Sidebar from '../Components/Dashboard/SideBar';

function Dashboard() {
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only navigate to /dashboard/projects on the initial mount
    if (isInitialMount.current && location.pathname === '/Dashboard') {
      navigate('/dashboard/projects', { replace: true });
      isInitialMount.current = false;
    }

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [navigate, location.pathname]);

  return (
    <div className="flex h-screen flex-col bg-gray-800 dark:bg-gray-800">
      {/* Header - Fixed at the top with higher z-index */}
      <div ref={headerRef} className="fixed inset-x-0 top-0 z-30">
        <Header />
      </div>

      {/* Main Layout - Below the Header */}
      <div className="flex flex-1" style={{ marginTop: 'var(--header-height)' }}>
        {/* Sidebar - Fixed on the left with higher z-index */}
        <div className="fixed bottom-0 top-[var(--header-height)] z-20 w-64">
          <Sidebar />
        </div>

        {/* Main Content - Scrollable, with lower z-index */}
        <main
          className="ml-64 flex-1 overflow-y-auto bg-white  dark:bg-gray-800"
          style={{ height: 'calc(100vh - var(--header-height))' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;