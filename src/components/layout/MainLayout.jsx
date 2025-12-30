import React, { useState } from 'react';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-root">
      <style jsx global>{`
        .layout-root {
          display: flex;
          min-height: 100vh;
          flex-direction: row;
        }
        
        /* Sidebar Base */
        .sidebar {
          width: 260px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          padding: var(--space-6);
          position: sticky;
          top: 0;
          height: 100vh;
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 0 var(--space-4);
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
        }

        .hamburger {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px; /* Touch target size per rules */
        }

        .main-content {
          flex: 1;
          padding: var(--space-8);
          background-color: var(--bg-main);
          transition: padding 0.3s ease;
        }

        .nav-item {
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-2);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .nav-item:hover, .nav-item.active {
          background-color: var(--primary-50);
          color: var(--primary-600);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-600);
          margin-bottom: var(--space-8);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        /* Responsive Logic */
        @media (max-width: 767px) {
          .layout-root {
             flex-direction: column;
          }
          .mobile-header {
            display: flex;
          }
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(${isSidebarOpen ? '0' : '-100%'});
            box-shadow: var(--shadow-lg);
          }
          .main-content {
            padding: var(--space-6);
            margin-top: 64px; /* Space for mobile header */
          }
          .sidebar-overlay {
            display: ${isSidebarOpen ? 'block' : 'none'};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(2px);
            z-index: 950;
          }
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>168sys</div>
        <div style={{ width: 44 }}></div> {/* Balance spacer */}
      </header>

      <aside className="sidebar">
        <div className="logo hide-on-mobile">
          <div style={{ width: 32, height: 32, background: 'var(--primary-500)', borderRadius: 'var(--radius-md)' }}></div>
          168sys
        </div>
        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Customers</div>
          <div className="nav-item">Orders</div>
          <div className="nav-item">Inventory</div>
          <div className="nav-item">Settings</div>
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
