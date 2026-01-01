import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Package, Box } from 'lucide-react';
import { Product } from '../../types/product';
import { Button } from '../../components/common/Button';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, TableEmptyState } from '../../components/common/Table';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onEdit }: ProductTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th style={{ width: '50px' }}></Th>
                        <Th>สินค้า</Th>
                        <Th>หมวดหมู่</Th>
                        <Th align="center">จำนวน Variant</Th>
                        <Th align="right">Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {products.length === 0 ? (
                        <TableEmptyState
                            title="ไม่พบรายการสินค้า"
                            message='คุณสามารถเพิ่มสินค้าใหม่ได้โดยกดปุ่ม "+ เพิ่มสินค้าใหม่" ด้านบน'
                            icon={Package}
                        />
                    ) : (
                        products.map((product) => {
                            const isExpanded = expandedRows.has(product.uuid);
                            const variantCount = product.variants?.length || 0;

                            return (
                                <React.Fragment key={product.uuid}>
                                    {/* Main Row */}
                                    <Tr
                                        onClick={() => toggleRow(product.uuid)}
                                        className={isExpanded ? 'bg-slate-50' : ''}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Td align="center">
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-primary-500"
                                                onClick={(e) => { e.stopPropagation(); toggleRow(product.uuid); }}
                                            >
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </Button>
                                        </Td>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-200">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="h-full w-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Box className="text-slate-400" size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm">{product.product_code}</div>
                                                    <div className="text-sm text-slate-600">{product.name}</div>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {product.category}
                                            </span>
                                        </Td>
                                        <Td align="center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantCount > 0 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                                                {variantCount} รายการ
                                            </span>
                                        </Td>
                                        <Td align="right">
                                            <button
                                                className="table-action-btn"
                                                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </Td>
                                    </Tr>

                                    {/* Variant Expanded Row */}
                                    {isExpanded && variantCount > 0 && (
                                        <Tr style={{ background: '#f8fafc' }}>
                                            <Td colSpan={5} style={{ padding: '0 24px 24px 64px', borderBottom: 'none' }}>
                                                <div style={{
                                                    background: 'white',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    marginTop: '12px'
                                                }}>
                                                    <Table>
                                                        <Thead>
                                                            <Tr>
                                                                <Th style={{ padding: '12px 16px', fontSize: '11px' }}>SKU</Th>
                                                                <Th style={{ padding: '12px 16px', fontSize: '11px' }}>ขนาด/สี</Th>
                                                                <Th align="right" style={{ padding: '12px 16px', fontSize: '11px' }}>ราคา</Th>
                                                                <Th align="center" style={{ padding: '12px 16px', fontSize: '11px' }}>Stock</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {product.variants?.map((v: any, idx: number) => (
                                                                <Tr key={v.id || idx}>
                                                                    <Td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#475569' }}>{v.sku}</Td>
                                                                    <Td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                                        {v.size} {v.color ? `• ${v.color}` : ''}
                                                                        {v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height) ?
                                                                            <span style={{ marginLeft: '4px', color: '#94a3b8', fontSize: '11px' }}>
                                                                                (L{v.dimensions.length} W{v.dimensions.width} H{v.dimensions.height})
                                                                            </span>
                                                                            : ''}
                                                                    </Td>
                                                                    <Td align="right" style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                                                                        ฿{parseFloat(v.price).toLocaleString()}
                                                                    </Td>
                                                                    <Td align="center" style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                                        {v.min_stock_level}
                                                                    </Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </div>
                                            </Td>
                                        </Tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

