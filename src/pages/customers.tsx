import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CustomerModal from '../components/customers/CustomerModal';
import CustomerTable from '../components/customers/CustomerTable';
import { getCustomers, saveCustomer, deleteCustomer } from '../lib/v1/customerManager';
import { Search, Plus } from 'lucide-react';
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
                <CustomerTable
                    customers={filteredCustomers}
                    isLoading={isLoading}
                    onEdit={(customer) => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                />
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

