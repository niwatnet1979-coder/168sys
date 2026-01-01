import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Package, Box } from 'lucide-react';
import { Product } from '../../types/product';
import { Button } from '../../components/ui/Button';

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
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[50px]"></th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สินค้า</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">หมวดหมู่</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">จำนวน Variant</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Package size={48} className="mb-3 opacity-20" />
                                    <p className="font-semibold text-lg text-slate-600">ไม่พบรายการสินค้า</p>
                                    <p className="text-sm mt-1 text-slate-400">คุณสามารถเพิ่มสินค้าใหม่ได้โดยกดปุ่ม "+ เพิ่มสินค้าใหม่" ด้านบน</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const isExpanded = expandedRows.has(product.uuid);
                            const variantCount = product.variants?.length || 0;

                            return (
                                <React.Fragment key={product.uuid}>
                                    {/* Main Row */}
                                    <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50/50' : ''}`} onClick={() => toggleRow(product.uuid)}>
                                        <td className="py-4 px-4 text-center">
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-primary-500"
                                                onClick={(e) => { e.stopPropagation(); toggleRow(product.uuid); }}
                                            >
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </Button>
                                        </td>
                                        <td className="py-4 px-4">
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
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantCount > 0 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                                                {variantCount} รายการ
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Button
                                                variant="secondary"
                                                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                                className="p-2 h-9 text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                                            >
                                                <Edit size={18} />
                                            </Button>
                                        </td>
                                    </tr>

                                    {/* Variant Expanded Row */}
                                    {isExpanded && variantCount > 0 && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={5} className="py-4 px-4 pl-16">
                                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-slate-50 text-xs text-slate-500 font-semibold border-b border-slate-200">
                                                            <tr>
                                                                <th className="py-2 px-4 w-[160px]">SKU</th>
                                                                <th className="py-2 px-4">ขนาด/สี</th>
                                                                <th className="py-2 px-4 text-right">ราคา</th>
                                                                <th className="py-2 px-4 text-center">Stock</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 text-sm">
                                                            {product.variants?.map((v: any, idx: number) => (
                                                                <tr key={v.id || idx} className="hover:bg-slate-50">
                                                                    <td className="py-2 px-4 font-mono text-slate-600">{v.sku}</td>
                                                                    <td className="py-2 px-4 text-slate-600">
                                                                        {v.size} {v.color ? `• ${v.color}` : ''}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-right text-slate-700 font-medium">
                                                                        ฿{parseFloat(v.price).toLocaleString()}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-center text-slate-600">
                                                                        {v.min_stock_level}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
