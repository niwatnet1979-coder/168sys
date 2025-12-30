import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    TrendingUp,
    Users,
    ShoppingCart,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';

const DashboardPage = () => {
    const stats = [
        { label: 'Total Revenue', value: '฿1,240,000', change: '+12.5%', icon: TrendingUp, color: 'var(--primary-600)' },
        { label: 'New Customers', value: '142', change: '+8.2%', icon: Users, color: '#8b5cf6' },
        { label: 'Active Orders', value: '42', change: '+4.1%', icon: ShoppingCart, color: 'var(--success)' },
    ];

    const activities = [
        { customer: 'คุณสมชาย สายเปย์', status: 'Success', amount: '฿4,500', time: '2 mins ago' },
        { customer: 'คุณกมล สนใจงาน', status: 'Pending', amount: '฿12,000', time: '1 hour ago' },
        { customer: 'หจก. รวยรุ่งเรือง', status: 'Processing', amount: '฿85,200', time: '3 hours ago' },
    ];

    return (
        <MainLayout title="Dashboard Overview">

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-8)'
            }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                padding: '10px',
                                borderRadius: '12px',
                                background: stat.color + '15',
                                color: stat.color
                            }}>
                                <stat.icon size={20} />
                            </div>
                            <div style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600, background: 'var(--success)15', padding: '2px 8px', borderRadius: '100px' }}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
                {/* Recent Activity Card */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: 'var(--font-h3)', fontWeight: 700 }}>Recent Transactions</h2>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><MoreHorizontal size={20} /></button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', background: 'var(--bg-main)' }}>
                                    <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activities.map((act, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--bg-main)' }}>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{ fontWeight: 600 }}>{act.customer}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                padding: '4px 10px',
                                                borderRadius: '100px',
                                                background: act.status === 'Success' ? 'var(--success)15' : act.status === 'Pending' ? 'var(--warning)15' : 'var(--primary-50)',
                                                color: act.status === 'Success' ? 'var(--success)' : act.status === 'Pending' ? 'var(--warning)' : 'var(--primary-600)'
                                            }}>
                                                {act.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontWeight: 700 }}>{act.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Card */}
                <div className="card glass" style={{
                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>Ready for the next delivery?</h2>
                        <p style={{ marginTop: 'var(--space-2)', opacity: 0.8 }}>มี 8 รายการที่รอการจัดส่งในวันนี้ เช็คสถานะได้ที่ปุ่มด้านล่าง</p>
                    </div>
                    <button style={{
                        marginTop: 'var(--space-6)',
                        background: 'white',
                        color: 'var(--primary-700)',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        Go to Logistics <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
