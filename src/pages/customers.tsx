import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CustomerModal from '../components/customers/CustomerModal';
import { getCustomers, saveCustomer, deleteCustomer } from '../lib/v1/customerManager';
import { Search, Plus, User, Phone, Calendar, Edit2, Trash2, Users } from 'lucide-react';
import { Customer } from '../types/customer';
import { ApiResponse } from '../types/index';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            const result: ApiResponse<Customer[]> = await getCustomers();
            if (result.success && result.data) {
                setCustomers(result.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRequest = async (formData: Customer) => {
        const result: ApiResponse<Customer> = await saveCustomer(formData);
        if (result.success) {
            setIsModalOpen(false);
            loadCustomers();
        } else {
            alert('Error: ' + result.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('คุณแน่ใจว่าต้องการลบข้อมูลลูกค้ารายนี้?')) {
            const result = await deleteCustomer(id);
            if (result.success) loadCustomers();
        }
    };

    const filteredCustomers = (customers || []).filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm))
    );

    return (
        <MainLayout title="บริหารจัดการลูกค้า">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Top Bar */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '300px', maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '48px' }}
                            placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทร..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
                        className="button-primary"
                    >
                        <Plus size={20} />
                        <span>เพิ่มลูกค้าใหม่</span>
                    </button>
                </div>

                {/* Table Container */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 'var(--font-small)', fontWeight: 600, color: 'var(--text-muted)' }}>ลูกค้า</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 'var(--font-small)', fontWeight: 600, color: 'var(--text-muted)' }}>การติดต่อ</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 'var(--font-small)', fontWeight: 600, color: 'var(--text-muted)' }}>วันที่ลงทะเบียน</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 'var(--font-small)', fontWeight: 600, color: 'var(--text-muted)' }}>เครื่องมือ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>ดาวน์โหลดข้อมูล...</td></tr>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} style={{ borderBottom: '1px solid var(--bg-main)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'var(--primary-50)',
                                                        color: 'var(--primary-600)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 700
                                                    }}>
                                                        {customer.name?.charAt(0) || <User size={20} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{customer.name}</div>
                                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{customer.email || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 'var(--font-small)' }}>
                                                        <Phone size={14} style={{ color: 'var(--primary-400)' }} />
                                                        {customer.phone || '-'}
                                                    </div>
                                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Users size={12} />
                                                        {customer.contacts?.length || 0} ผู้ติดต่อ
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: 'var(--font-small)', color: 'var(--text-muted)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={14} />
                                                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString('th-TH') : '-'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                                                        style={{
                                                            padding: '8px',
                                                            border: 'none',
                                                            background: 'none',
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px'
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.color = 'var(--primary-600)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer.id)}
                                                        style={{
                                                            padding: '8px',
                                                            border: 'none',
                                                            background: 'none',
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px'
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = 'var(--error)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '80px 24px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    background: 'var(--bg-main)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--primary-100)'
                                                }}>
                                                    <Users size={40} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)' }}>ไม่พบข้อมูลสมาชิกลูกค้า</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-small)' }}>เริ่มสร้างฐานข้อมูลลูกค้าของคุณได้ง่ายๆ เพียงกดปุ่มด้านล่าง</div>
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
                                                    style={{
                                                        background: 'var(--primary-600)',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '10px 24px',
                                                        borderRadius: '10px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                                    }}
                                                >
                                                    + เพิ่มลูกค้าคนแรก
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                customer={selectedCustomer}
                onSave={handleSaveRequest}
            />
        </MainLayout>
    );
}
