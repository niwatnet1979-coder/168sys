import React from 'react';
import { User, Phone, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Customer } from '../../types/customer';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, TableEmptyState } from '../../components/common/Table';

interface CustomerTableProps {
    customers: Customer[];
    isLoading: boolean;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

export default function CustomerTable({ customers, isLoading, onEdit, onDelete }: CustomerTableProps) {
    if (isLoading) {
        return (
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>ลูกค้า</Th>
                            <Th>การติดต่อ</Th>
                            <Th>วันที่ลงทะเบียน</Th>
                            <Th align="center">เครื่องมือ</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                ดาวน์โหลดข้อมูล...
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        );
    }

    if (customers.length === 0) {
        return (
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>ลูกค้า</Th>
                            <Th>การติดต่อ</Th>
                            <Th>วันที่ลงทะเบียน</Th>
                            <Th align="center">เครื่องมือ</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <TableEmptyState
                            title="ไม่พบข้อมูลลูกค้า"
                            message="เริ่มสร้างฐานข้อมูลลูกค้าของคุณได้ง่ายๆ เพียงกดปุ่มเพิ่มลูกค้าใหม่"
                            icon={Users}
                        />
                    </Tbody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th>ลูกค้า</Th>
                        <Th>การติดต่อ</Th>
                        <Th>วันที่ลงทะเบียน</Th>
                        <Th align="center">เครื่องมือ</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {customers.map((customer) => (
                        <Tr key={customer.id}>
                            <Td>
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
                            </Td>
                            <Td>
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
                            </Td>
                            <Td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--font-small)' }}>
                                    <Calendar size={14} />
                                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString('th-TH') : '-'}
                                </div>
                            </Td>
                            <Td align="center">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <button
                                        className="table-action-btn"
                                        onClick={() => onEdit(customer)}
                                        title="แก้ไข"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className="table-action-btn delete"
                                        onClick={() => onDelete(customer.id)}
                                        title="ลบ"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
