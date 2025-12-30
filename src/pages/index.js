import React from 'react';
/* Note: Since we are using Next.js structure, this would usually be in pages/index.js */
/* We will simulate its content here with the design tokens from globals.css */

import MainLayout from '../components/layout/MainLayout';

const DemoPage = () => {
    return (
        <MainLayout>
            <header style={{ marginBottom: 'var(--space-8)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>ยินดีต้อนรับสู่ระบบบริหารจัดการ 168sys</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-6)'
            }}>
                {/* Stat Card 1 */}
                <div className="card">
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Sales
                    </h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: 'var(--space-2) 0' }}>฿1,240,000</p>
                    <div style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: '500' }}>
                        ↑ 12% from last month
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="card">
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Active Orders
                    </h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: 'var(--space-2) 0' }}>42</p>
                    <div style={{ color: 'var(--info)', fontSize: '0.875rem', fontWeight: '500' }}>
                        8 orders pending shipping
                    </div>
                </div>

                {/* Glass Card Example */}
                <div className="card glass" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', color: 'white' }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.8)' }}>Quick Action</h3>
                    <p style={{ margin: 'var(--space-4) 0' }}>สร้างรายการคำสั่งซื้อใหม่ได้ทันที</p>
                    <button className="button-primary" style={{ background: 'white', color: 'var(--primary-600)' }}>
                        + Create Order
                    </button>
                </div>
            </div>

            <section style={{ marginTop: 'var(--space-8)' }}>
                <div className="card">
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: 'var(--space-3)', color: 'var(--text-muted)', fontWeight: '500' }}>Customer</th>
                                <th style={{ padding: 'var(--space-3)', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                                <th style={{ padding: 'var(--space-3)', color: 'var(--text-muted)', fontWeight: '500' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: 'var(--space-3)' }}>คุณสมชาย สายเปย์</td>
                                <td style={{ padding: 'var(--space-3)' }}><span style={{ color: 'var(--success)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>Success</span></td>
                                <td style={{ padding: 'var(--space-3)' }}>฿4,500</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 'var(--space-3)' }}>คุณกมล สนใจงาน</td>
                                <td style={{ padding: 'var(--space-3)' }}><span style={{ color: 'var(--warning)', background: '#fffbeb', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>Pending</span></td>
                                <td style={{ padding: 'var(--space-3)' }}>฿12,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </MainLayout>
    );
};

export default DemoPage;
