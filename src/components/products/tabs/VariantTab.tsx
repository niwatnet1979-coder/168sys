import React, { useState } from 'react';
import { Trash2, Package, Plus, AlertCircle, Ruler, DollarSign, Boxes, Palette, Gem, Tag, Layers, FileText, Settings } from 'lucide-react';
import { ProductVariant } from '../../types/product';
import { useSystemOptions } from '../../../hooks/useSystemOptions';
import DynamicSelect from '../../common/DynamicSelect';
import FormInput from '../../common/FormInput';
import MultiImageUploader from '../../common/MultiImageUploader';
import AddItemButton from '../../common/AddItemButton';
import { Image as ImageIcon } from 'lucide-react';

interface NewVariantState {
    color: string;
    crystal_color: string;
    dimensions: { length: string; width: string; height: string };
    price: string;
    min_stock_level: number;
    image_urls: string[];
}

interface VariantTabProps {
    variants: ProductVariant[];
    setVariants: (variants: ProductVariant[]) => void;
    productCode: string;
    newVariant: NewVariantState;
    setNewVariant: (v: NewVariantState) => void;
    getPreviewSKU: () => string;
    onCreateVariant: () => ProductVariant;
    productName?: string;
    productMaterial?: string;
    productDescription?: string;
}

export default function VariantTab({
    variants,
    setVariants,
    productCode,
    newVariant,
    setNewVariant,
    getPreviewSKU,
    onCreateVariant,
    productName,
    productMaterial,
    productDescription
}: VariantTabProps) {
    // Fetch Options from DB
    const { options: colorOptions } = useSystemOptions('materialColors');
    const { options: crystalOptions } = useSystemOptions('crystalColors');

    // Internal state REMOVED - using props 'newVariant' and 'setNewVariant'

    const parseCode = (val: string) => val ? val.split(' ')[0] : '';

    const handleAdd = () => {
        // Validate product code
        if (!productCode) {
            alert('กรุณาบันทึกสินค้าก่อน');
            return;
        }

        // Validate - need at least color OR one dimension
        const hasColor = !!newVariant.color;
        const hasLength = !!newVariant.dimensions.length && newVariant.dimensions.length !== '0';
        const hasWidth = !!newVariant.dimensions.width && newVariant.dimensions.width !== '0';
        const hasHeight = !!newVariant.dimensions.height && newVariant.dimensions.height !== '0';

        if (!hasColor && !hasLength && !hasWidth && !hasHeight) {
            alert('ต้องระบุ สีวัสดุ หรือ ขนาด (L/W/H) อย่างน้อย 1 อย่าง');
            return;
        }

        // Add to list using the function from parent
        const variantToAdd = onCreateVariant();

        console.log('Adding variant:', variantToAdd);
        const newVariants = [...variants, variantToAdd];
        console.log('New variants list:', newVariants);
        setVariants(newVariants);

        // Reset form
        setNewVariant({
            color: '',
            crystal_color: '',
            dimensions: { length: '', width: '', height: '' },
            price: '',
            min_stock_level: 0,
            image_urls: ['']
        });

        // alert(`เพิ่ม Variant: ${variantToAdd.sku} สำเร็จ!`); 
        // Commented out alert to be less intrusive, or keep it? User might like confirmation.
        // But UX request was "record with same button", so manual add might still want feedback.
        // Let's use Swal or just keep simple alert for now.
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
                                    width: '80px',
                                    height: '80px',
                                    background: '#f1f5f9',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: '1px solid #e2e8f0',
                                    overflow: 'hidden'
                                }}>
                                    {v.image_url ? (
                                        <img src={v.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Package size={24} style={{ color: '#94a3b8' }} />
                                    )}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {/* Line 1: SKU */}
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>
                                        {`${productCode}-${v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height) ? `L${v.dimensions.length}W${v.dimensions.width}H${v.dimensions.height}` : ''}-${parseCode(v.color)}${v.crystal_color ? `-${parseCode(v.crystal_color)}` : ''}`}
                                    </div>

                                    {/* Line 2: Product Name */}
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                                        {productName || '-'}
                                    </div>

                                    {/* Line 3: Specs with Icons */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b' }}>
                                        {/* Dimensions */}
                                        {(v.dimensions && (v.dimensions.length || v.dimensions.width || v.dimensions.height)) && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>{`L${v.dimensions.length}W${v.dimensions.width}H${v.dimensions.height}`}</span>
                                            </div>
                                        )}

                                        {/* Material */}
                                        {productMaterial && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Layers size={14} className="text-slate-400" />
                                                <span>{productMaterial}</span>
                                            </div>
                                        )}

                                        {/* Color (Strip GD) */}
                                        {v.color && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Palette size={14} className="text-slate-400" />
                                                <span>{v.color.replace(/GD/i, '').trim()}</span>
                                            </div>
                                        )}

                                        {/* Crystal (Strip CL, use Gem) */}
                                        {v.crystal_color && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Gem size={14} className="text-slate-400" />
                                                <span>{v.crystal_color.replace(/CL/i, '').trim()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Line 4: Description */}
                                    {productDescription && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                                            <FileText size={14} className="text-slate-400" />
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                                                {productDescription}
                                            </span>
                                        </div>
                                    )}

                                    {/* Line 5: Price and Stock (moved from separate columns to here or just keep them?) */}
                                    {/* User request didn't explicitly say to remove Price/Stock but the screenshot doesn't show them clearly in the main block.
                                        However, keeping them visible is crucial for a variant list.
                                        Let's keep them in a separate block on the right, or integrated?
                                        The user's screenshot seems to mostly show the text info. 
                                        The price and actions were to the right in the original layout.
                                        I will keep Price and Stock in a small row below or to the side if there is space?
                                        The original used a grid.
                                        I replaced the grid with flex column.
                                        I should probably add Price/Stock back in a subtle way or check if I can keep the grid layout but merge the first column.
                                        Actually, let's look at the screenshot again carefully. 
                                        It shows a "List View" style.
                                        Let's put Price and Min Stock on the right side using flex: space-between.
                                    */}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', minWidth: '100px' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>ราคา</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>฿{v.price.toLocaleString()}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Min Stock: {v.min_stock_level}</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <button
                                        onClick={() => { /* TODO: Implement Edit Logic */ }}
                                        style={{
                                            padding: '8px',
                                            background: 'none',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#94a3b8',
                                            cursor: 'pointer'
                                        }}
                                        className="hover:text-blue-500 transition-colors"
                                        title="แก้ไขข้อมูล"
                                    >
                                        <Settings size={18} />
                                    </button>
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
                                        className="hover:text-red-500 transition-colors"
                                        title="ลบตัวเลือก"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Row 1: Variant ID + ราคาขาย (ย้ายมาบนสุด) */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {/* Variant ID (SKU Preview) - Readonly */}
                                <FormInput
                                    label="Variant ID"
                                    placeholder="auto-generate"
                                    value={getPreviewSKU()}
                                    onChange={() => { }} // Readonly
                                    icon={Tag}
                                    disabled
                                />
                                <FormInput
                                    label="ราคาขาย"
                                    placeholder="0.00"
                                    value={newVariant.price}
                                    onChange={v => setNewVariant({ ...newVariant, price: v })}
                                    icon={DollarSign}
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Row 2: ขนาดสินค้า (L/W/H) */}
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

                        {/* Row 3: สีวัสดุ + สีคริสตัล + Min Stock */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
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
