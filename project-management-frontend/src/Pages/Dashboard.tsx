import React, { useEffect, useRef } from 'react';
import Header from '../Components/Dashboard/Header';
import Sidebar from '../Components/Dashboard/SideBar';
import Projects from '../Components/Dashboard/Projects';

function Dashboard() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-800 dark:bg-gray-800">
      {/* Header - Fixed at the top */}
      <div ref={headerRef} className="fixed inset-x-0 top-0 z-10">
        <Header />
      </div>

      {/* Main Layout - Below the Header */}
      <div className="flex flex-1" style={{ marginTop: 'var(--header-height)' }}>
        {/* Sidebar - Fixed on the left */}
        <div className="fixed bottom-0 top-[var(--header-height)] w-64">
          <Sidebar />
        </div>

        {/* Main Content - Scrollable */}
        <main
          className="ml-64 flex-1 overflow-y-auto bg-white p-6 dark:bg-gray-800"
          style={{ height: 'calc(100vh - var(--header-height))' }}
        >
          <Projects />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;