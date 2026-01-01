
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Package, Box, Trash2, Tag, Layers, Palette, Gem, StickyNote, FileText, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types/product';
import { Button } from '../../components/common/Button';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, TableEmptyState } from '../../components/common/Table';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onRefresh?: () => void;
}

export default function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    const handleDelete = async (product: Product) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            html: `คุณต้องการลบสินค้า < strong > ${product.product_code}</strong ><br/><strong>${product.name}</strong> หรือไม่ ? `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                // Delete variants first (due to foreign key)
                await supabase.from('product_variants').delete().eq('product_id', product.uuid);

                // Then delete product
                const { error } = await supabase.from('products').delete().eq('uuid', product.uuid);

                if (error) throw error;

                await Swal.fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ',
                    text: 'ลบสินค้าเรียบร้อยแล้ว',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Refresh the list
                if (onRefresh) onRefresh();
            } catch (error: any) {
                await Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.message || 'ไม่สามารถลบสินค้าได้'
                });
            }
        }
    };

    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th style={{ width: '50px' }}></Th>
                        <Th style={{ width: '100px' }}></Th>
                        <Th style={{ width: '35%', paddingLeft: '16px' }}>สินค้า</Th>
                        <Th style={{ width: '35%', paddingLeft: '8px' }} align="left">จำนวน Variant</Th>
                        <Th align="center">Action</Th>
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
                                        <Td>
                                            <div className="flex items-center justify-center text-slate-400">
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                        </Td>
                                        <Td style={{ width: '100px' }}>
                                            <div style={{ width: '80px', height: '80px' }} className="rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 mx-auto">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-slate-300" size={32} />
                                                )}
                                            </div>
                                        </Td>
                                        <Td style={{ width: '35%', paddingLeft: '16px' }}>
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold text-slate-700 text-sm">{product.product_code}</div>
                                                <div className="text-sm text-slate-600">{product.name}</div>
                                                {product.description && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-500" title="รายละเอียด">
                                                        <FileText size={12} className="text-slate-400" />
                                                        <span className="line-clamp-1">{product.description}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Td>
                                        <Td style={{ width: '35%', paddingLeft: '8px' }} align="left">
                                            <span className="text-sm font-medium text-slate-700">{variantCount} รายการ</span>
                                        </Td>
                                        <Td align="center">
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    className="table-action-btn"
                                                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                                    title="แก้ไข"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="table-action-btn"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                                                    title="ลบ"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </Td>
                                    </Tr>

                                    {/* Variant Expanded Row */}
                                    {isExpanded && variantCount > 0 && (
                                        <React.Fragment>
                                            {/* Variant Header Row - Optional, or just list items directly if headers are redundant */}
                                            <Tr className="bg-slate-50 border-b border-slate-200">
                                                <Td></Td>
                                                <Td></Td>
                                                <Td style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>VARIANT SKU</Td>
                                                <Td style={{ padding: '8px 8px', fontSize: '11px', fontWeight: 600, color: '#64748b' }} align="left">ราคา</Td>
                                                <Td style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 600, color: '#64748b' }} align="center">Stock</Td>
                                            </Tr>

                                            {product.variants?.map((v: any, idx: number) => (
                                                <Tr key={v.id || idx} className="bg-slate-50 border-b border-slate-100 hover:bg-slate-100">
                                                    <Td style={{ padding: 0 }}></Td>

                                                    {/* Variant Image - Aligned with Main Product Image */}
                                                    <Td style={{ width: '100px' }}>
                                                        <div style={{ width: '80px', height: '80px' }} className="rounded-lg bg-white flex items-center justify-center overflow-hidden border border-slate-200 mx-auto">
                                                            {v.image_url ? (
                                                                <img src={v.image_url} alt={v.sku} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="text-slate-300 text-[10px]">No img</div>
                                                            )}
                                                        </div>
                                                    </Td>

                                                    {/* Variant Details - Aligned with Main Product Details */}
                                                    <Td style={{ width: '35%', padding: '16px' }}>
                                                        <div className="flex flex-col gap-1.5 min-h-[60px]">
                                                            <div className="font-bold text-slate-800 text-sm font-mono tracking-wide">{v.sku}</div>
                                                            <div className="text-sm text-slate-600 font-medium">{product.name}</div>

                                                            {/* Line 3: Specs - Dimensions, Material, Color, Crystal using Flex wrap */}
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                                {(v.size || (v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height))) && (
                                                                    <div className="flex items-center gap-1 font-medium text-slate-600 mr-1" title="ขนาด">
                                                                        <span>
                                                                            {v.size ? v.size : ''}
                                                                            {v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height)
                                                                                ? `${v.size ? ' ' : ''}(L${v.dimensions.length} W${v.dimensions.width} H${v.dimensions.height})`
                                                                                : ''}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {product.material && (
                                                                    <div className="flex items-center gap-1" title="วัสดุ">
                                                                        <Layers size={12} className="text-slate-400" />
                                                                        <span>{product.material}</span>
                                                                    </div>
                                                                )}
                                                                {v.color && (
                                                                    <div className="flex items-center gap-1" title="สีวัสดุ">
                                                                        <Palette size={12} className="text-slate-400" />
                                                                        <span>{v.color ? v.color.replace(/GD/i, '').trim() : ''}</span>
                                                                    </div>
                                                                )}
                                                                {v.crystal_color && (
                                                                    <div className="flex items-center gap-1" title="สีคริสตัล">
                                                                        <Gem size={12} className="text-slate-400" />
                                                                        <span>{v.crystal_color.replace(/CL/i, '').trim()}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Line 4: Product Description */}
                                                            {product.description && (
                                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5" title="รายละเอียด">
                                                                    <FileText size={12} className="text-slate-400" />
                                                                    <span className="line-clamp-1">{product.description}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Td>

                                                    {/* Price Column */}
                                                    <Td align="left" style={{ width: '35%', padding: '16px 8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                                                        ฿{v.price?.toLocaleString()}
                                                    </Td>

                                                    {/* Stock Column */}
                                                    <Td align="center" style={{ padding: '16px', fontSize: '13px', color: (v.stock || 0) <= (v.min_stock_level || 5) ? '#ef4444' : '#64748b' }}>
                                                        {v.stock || 0}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </Tbody>
            </Table>
        </TableContainer >
    );
}

