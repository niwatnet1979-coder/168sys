import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const MainLayout = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Personnel', path: '/personnel', icon: Users }, // เพิ่มเมนูทีมงาน
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="layout-root">
      <Head>
        <title>{title ? `${title} | 168sys` : '168sys'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        .layout-root {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-main);
        }
        
        /* Sidebar */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid var(--border-color);
          padding: var(--space-6);
          position: sticky;
          top: 0;
          height: 100vh;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .mobile-header {
          display: none;
          height: 72px;
          background: white;
          border-bottom: 1px solid var(--border-color);
          padding: 0 var(--space-6);
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
        }

        .main-content {
          flex: 1;
          padding: var(--space-8);
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-1);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background-color: var(--primary-50);
          color: var(--primary-600);
          transform: translateX(4px);
        }

        .nav-link.active {
          background-color: var(--primary-600);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .nav-link.active .chevron-icon {
          opacity: 1;
        }

        .chevron-icon {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-600);
          margin-bottom: var(--space-8);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          letter-spacing: -0.02em;
        }

        .logo-box {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }

        @media (max-width: 1023px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(${isSidebarOpen ? '0' : '-100%'});
            box-shadow: var(--shadow-lg);
          }
          .mobile-header {
            display: flex;
          }
          .main-content {
            padding: var(--space-6);
            margin-top: 72px;
          }
          .overlay {
            display: ${isSidebarOpen ? 'block' : 'none'};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 950;
          }
        }
      `}</style>

      <div className="overlay" onClick={toggleSidebar}></div>

      <header className="mobile-header">
        <button className="hamburger" onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={24} />
        </button>
        <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.25rem' }}>168sys</div>
        <div style={{ width: 24 }}></div>
      </header>

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-box">
            <Package size={20} strokeWidth={2.5} />
          </div>
          168sys
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px' }}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight size={14} className="chevron-icon" />
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
          <div className="nav-link">
            <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee' }}></div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Seng</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {title && (
          <h1 style={{ fontSize: 'var(--font-h1)', fontWeight: 800, marginBottom: 'var(--space-6)', letterSpacing: '-0.03em' }}>
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
