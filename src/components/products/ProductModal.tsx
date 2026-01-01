import React, { useState } from 'react';
import { X, Package, Sparkles, Box, FileText, Save, AlertCircle, Tag } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';
import { useSystemOptions } from '../../hooks/useSystemOptions';
import VariantManager from './VariantManager';
import { Product } from '../../types/product';
import Swal from 'sweetalert2';
import FormInput from '../common/FormInput';
import DynamicSelect from '../common/DynamicSelect';
import MultiImageUploader from '../common/MultiImageUploader';
import FormTextarea from '../common/FormTextarea';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess?: () => void;
}

export default function ProductModal({ isOpen, onClose, product = null, onSuccess }: ProductModalProps) {
    const { formData, setFormData, loading, handleCategoryChange, saveProduct } = useProductForm(product);
    const { options: materials, loading: loadingMaterials, addOption: addMaterial } = useSystemOptions('materials');
    const { options: categoryOptions, loading: loadingCategories, addOption: addCategory } = useSystemOptions('productTypes');
    const [activeTab, setActiveTab] = useState<'general' | 'variants'>('general');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const success = await saveProduct();
        if (success) {
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    const tabs = [
        { id: 'general', label: 'ข้อมูลทั่วไป', icon: Box },
        { id: 'variants', label: `ตัวเลือกสินค้า (${formData.variants?.length || 0})`, icon: Tag }
    ] as const;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '640px',
                maxHeight: '90vh',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s ease-out'
            }}>
                <style>{`
                    @keyframes modalSlideUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .custom-tab {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 12px 8px;
                        gap: 4px;
                        border: none;
                        background: none;
                        cursor: pointer;
                        transition: all 0.2s;
                        border-bottom: 2px solid transparent;
                        flex: 1;
                    }
                    .custom-tab.active {
                        color: var(--primary-600);
                        border-bottom-color: var(--primary-600);
                        background: var(--primary-50);
                    }
                    .custom-tab:not(.active):hover {
                        background: #f8fafc;
                        color: var(--text-main);
                    }
                    .magic-icon-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: var(--primary-50);
                        color: var(--primary-600);
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s;
                        flex-shrink: 0;
                    }
                    .magic-icon-btn:hover {
                        background: var(--primary-100);
                        transform: scale(1.1);
                        box-shadow: 0 0 12px var(--primary-200);
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>

                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            padding: '10px',
                            background: 'var(--primary-100)',
                            color: 'var(--primary-600)',
                            borderRadius: '12px'
                        }}>
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                {product ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                            </h2>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>
                                Product Management System
                            </span>
                        </div>
                        <button className="magic-icon-btn" title="กรอกอัตโนมัติ (AI)">
                            <Sparkles size={14} />
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#64748b'
                        }}
                        title="ปิด"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`custom-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={18} />
                            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Body */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {activeTab === 'general' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Section: ข้อมูลหลัก */}
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Box size={18} style={{ color: 'var(--primary-500)' }} />
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลหลัก</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <DynamicSelect
                                            label="หมวดหมู่สินค้า *"
                                            placeholder="เลือกหมวดหมู่..."
                                            value={formData.category}
                                            onChange={(v) => handleCategoryChange(String(v))}
                                            options={categoryOptions}
                                            onAddItem={async (newValue) => {
                                                if (newValue) {
                                                    const result = await addCategory(newValue, newValue);
                                                    if (result) {
                                                        handleCategoryChange(result.value);
                                                    }
                                                }
                                            }}
                                        />
                                        <FormInput
                                            label="รหัสสินค้า (Auto) *"
                                            placeholder="AA000"
                                            value={formData.product_code}
                                            onChange={(v) => setFormData({ ...formData, product_code: v })}
                                            icon={Tag}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <FormInput
                                            label="ชื่อสินค้า *"
                                            placeholder="ระบุชื่อสินค้า..."
                                            value={formData.name}
                                            onChange={(v) => setFormData({ ...formData, name: v })}
                                            icon={Package}
                                        />
                                        <DynamicSelect
                                            label="วัสดุหลัก"
                                            placeholder="เลือกวัสดุ..."
                                            value={formData.material}
                                            onChange={(v) => setFormData({ ...formData, material: String(v) })}
                                            options={materials}
                                            onAddItem={async (newValue) => {
                                                if (newValue) {
                                                    const result = await addMaterial(newValue, newValue);
                                                    if (result) {
                                                        setFormData(prev => ({ ...prev, material: result.value }));
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <FormTextarea
                                        label="รายละเอียดเพิ่มเติม"
                                        placeholder="รายละเอียดสินค้า..."
                                        value={formData.description}
                                        onChange={(v) => setFormData({ ...formData, description: v })}
                                    />
                                </div>
                            </div>

                            {/* Section: รูปภาพสินค้า */}
                            <MultiImageUploader
                                images={formData.image_url ? formData.image_url.split(',') : ['']}
                                onChange={(urls) => setFormData({ ...formData, image_url: urls.filter(u => u).join(',') })}
                                title="รูปภาพสินค้า"
                                placeholder="คลิกเพื่ออัปโหลดรูปภาพสินค้า"
                            />
                        </div>
                    )}

                    {activeTab === 'variants' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


                            <VariantManager
                                variants={formData.variants || []}
                                setVariants={(newVars) => setFormData({ ...formData, variants: newVars })}
                                productCode={formData.product_code}
                            />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            cursor: 'pointer'
                        }}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="button-primary"
                        style={{ flex: 2, padding: '14px', justifyContent: 'center' }}
                    >
                        {loading ? <span style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
                        <span>{loading ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}</span>
                    </button>
                </div>
            </div>
        </div >
    );
}
