import React, { useState } from 'react';
import { Trash2, Package, Plus, AlertCircle, Ruler, DollarSign, Boxes, Palette, Gem, Tag } from 'lucide-react';
import { ProductVariant } from '../../types/product';
import { useSystemOptions } from '../../hooks/useSystemOptions';
import DynamicSelect from '../common/DynamicSelect';
import FormInput from '../common/FormInput';
import MultiImageUploader from '../common/MultiImageUploader';
import AddItemButton from '../common/AddItemButton';
import { Image as ImageIcon } from 'lucide-react';

interface VariantManagerProps {
    variants: ProductVariant[];
    setVariants: (variants: ProductVariant[]) => void;
    productCode: string;
}

export default function VariantManager({ variants, setVariants, productCode }: VariantManagerProps) {
    // Fetch Options from DB
    const { options: colorOptions } = useSystemOptions('materialColors');
    const { options: crystalOptions } = useSystemOptions('crystalColors');

    // Local state for the "Add New Variant" form
    const [newVariant, setNewVariant] = useState<{
        color: string;
        crystal_color: string;
        dimensions: { length: string; width: string; height: string };
        price: string;
        min_stock_level: number;
        image_urls: string[];
    }>({
        color: '',
        crystal_color: '',
        dimensions: { length: '', width: '', height: '' },
        price: '',
        min_stock_level: 0,
        image_urls: ['']
    });

    const parseCode = (val: string) => val ? val.split(' ')[0] : '';

    const getPreviewSKU = () => {
        if (!productCode) return 'กรุณาระบุรหัสสินค้าก่อน';
        let sku = productCode;

        const { length, width, height } = newVariant.dimensions;
        if (length || width || height) {
            sku += `-L${length || 0}W${width || 0}H${height || 0}`;
        }

        if (newVariant.color) sku += `-${parseCode(newVariant.color)}`;
        if (newVariant.crystal_color) sku += `-${parseCode(newVariant.crystal_color)}`;

        return sku;
    };

    const handleAdd = () => {
        // Validate
        if (!productCode) return;
        if (!newVariant.color && !newVariant.dimensions.length && !newVariant.dimensions.width && !newVariant.dimensions.height) {
            return;
        }

        // Add to list
        const variantToAdd: ProductVariant = {
            sku: '',
            color: newVariant.color,
            crystal_color: newVariant.crystal_color,
            dimensions: newVariant.dimensions,
            price: parseFloat(newVariant.price) || 0,
            min_stock_level: newVariant.min_stock_level,
            image_url: newVariant.image_urls.filter(u => u).join(',') // Join multiple URLs
        };

        setVariants([...variants, variantToAdd]);

        // Reset form
        setNewVariant({
            color: '',
            crystal_color: '',
            dimensions: { length: '', width: '', height: '' },
            price: '',
            min_stock_level: 0,
            image_urls: ['']
        });
    };

    const removeVariant = (index: number) => {
        const newVars = [...variants];
        newVars.splice(index, 1);
        setVariants(newVars);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Existing Variants List */}
            {variants.length > 0 && (
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Package size={18} style={{ color: 'var(--primary-500)' }} />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>
                            รายการตัวเลือก ({variants.length})
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {variants.map((v, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: '#f1f5f9',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {v.image_url ? (
                                        <img src={v.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                    ) : (
                                        <Package size={24} style={{ color: '#94a3b8' }} />
                                    )}
                                </div>

                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>SKU</div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>
                                            {productCode}-
                                            {v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height) ? `L${v.dimensions.length}W${v.dimensions.width}H${v.dimensions.height}` : ''}-
                                            {parseCode(v.color)}
                                            {v.crystal_color ? `-${parseCode(v.crystal_color)}` : ''}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>คุณสมบัติ</div>
                                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                                            {v.color} {v.crystal_color ? `/ ${v.crystal_color}` : ''}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>ราคา</div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>฿{v.price.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>Min Stock</div>
                                        <div style={{ fontSize: '13px', color: '#475569' }}>{v.min_stock_level}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeVariant(idx)}
                                    style={{
                                        padding: '8px',
                                        background: 'none',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fda4af',
                                        cursor: 'pointer'
                                    }}
                                    title="ลบตัวเลือก"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* Add New Variant Section */}
            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Plus size={18} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>เพิ่มตัวเลือกสินค้า (New Variant)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Section: ข้อมูลตัวเลือกสินค้า */}
                    {/* Section: ข้อมูลตัวเลือกสินค้า */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Row 1: ขนาดสินค้า */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="ยาว (L)"
                                    placeholder="0"
                                    value={newVariant.dimensions.length}
                                    onChange={v => setNewVariant({ ...newVariant, dimensions: { ...newVariant.dimensions, length: v } })}
                                    icon={Ruler}
                                    type="number"
                                />
                                <FormInput
                                    label="กว้าง (W)"
                                    placeholder="0"
                                    value={newVariant.dimensions.width}
                                    onChange={v => setNewVariant({ ...newVariant, dimensions: { ...newVariant.dimensions, width: v } })}
                                    icon={Ruler}
                                    type="number"
                                />
                                <FormInput
                                    label="สูง (H)"
                                    placeholder="0"
                                    value={newVariant.dimensions.height}
                                    onChange={v => setNewVariant({ ...newVariant, dimensions: { ...newVariant.dimensions, height: v } })}
                                    icon={Ruler}
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Row 2: สีและคุณสมบัติ */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <DynamicSelect
                                    label="สีวัสดุ"
                                    placeholder="เลือกสีวัสดุ..."
                                    value={newVariant.color}
                                    onChange={(v) => setNewVariant({ ...newVariant, color: String(v) })}
                                    options={colorOptions}
                                    onAddItem={(v) => console.log('Add color:', v)}
                                />
                                <DynamicSelect
                                    label="สีคริสตัล"
                                    placeholder="สีคริสตัล (ถ้ามี)..."
                                    value={newVariant.crystal_color}
                                    onChange={(v) => setNewVariant({ ...newVariant, crystal_color: String(v) })}
                                    options={crystalOptions}
                                    onAddItem={(v) => console.log('Add crystal:', v)}
                                />
                            </div>
                        </div>

                        {/* Row 3: ราคาและสต็อก */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="ราคาขาย"
                                    placeholder="0.00"
                                    value={newVariant.price}
                                    onChange={v => setNewVariant({ ...newVariant, price: v })}
                                    icon={DollarSign}
                                    type="number"
                                />
                                <FormInput
                                    label="Min Stock Level"
                                    placeholder="0"
                                    value={String(newVariant.min_stock_level)}
                                    onChange={v => setNewVariant({ ...newVariant, min_stock_level: parseInt(v) || 0 })}
                                    icon={Boxes}
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: รูปภาพ */}
                    {/* Section: รูปภาพ */}
                    <MultiImageUploader
                        images={newVariant.image_urls}
                        onChange={(urls) => setNewVariant({ ...newVariant, image_urls: urls })}
                        title="รูปภาพตัวเลือก"
                        placeholder="คลิกเพื่ออัปโหลดรูปภาพตัวเลือก"
                    />

                    {/* Add Button */}
                    <AddItemButton
                        onClick={handleAdd}
                        label="เพิ่มรายการ"
                    />


                </div>
            </div>
        </div>
    );
}
