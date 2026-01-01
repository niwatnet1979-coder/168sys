import React, { useState } from 'react';
import { X, Package, Sparkles, Box, Tag, Save } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';
import { useSystemOptions } from '../../hooks/useSystemOptions';
import { Product, ProductVariant } from '../../types/product';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import VariantTab from './tabs/VariantTab';

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

    // Helper functions for Variant Logic
    const getPreviewSKU = (variantData = newVariant) => {
        if (!formData.product_code) return 'กรุณาระบุรหัสสินค้าก่อน';

        let sku = formData.product_code;

        // Add Size
        if (variantData.dimensions.length && variantData.dimensions.width && variantData.dimensions.height) {
            sku += `-L${variantData.dimensions.length}W${variantData.dimensions.width}H${variantData.dimensions.height}`;
        }

        // Helper to parse code from "Code Name" format
        const parseCode = (val: string) => {
            if (!val) return '';
            const parts = val.split(' ');
            return parts[0] || '';
        };

        // Add Color Code
        if (variantData.color) {
            const colorCode = parseCode(variantData.color);
            if (colorCode) sku += `-${colorCode}`;
        }

        // Add Crystal Color Code
        if (variantData.crystal_color) {
            const cryColorCode = parseCode(variantData.crystal_color);
            if (cryColorCode) sku += `-${cryColorCode}`;
        }

        return sku;
    };

    const hasPendingVariant = () => {
        return (
            newVariant.dimensions.length !== '' ||
            newVariant.dimensions.width !== '' ||
            newVariant.dimensions.height !== '' ||
            newVariant.color !== '' ||
            newVariant.crystal_color !== '' ||
            newVariant.price !== ''
        );
    };

    const createVariantObject = (): ProductVariant => {
        return {
            id: crypto.randomUUID(), // Temporary ID
            product_id: product?.uuid || '',
            sku: getPreviewSKU(),
            color: newVariant.color,
            crystal_color: newVariant.crystal_color,
            dimensions: newVariant.dimensions,
            price: parseFloat(newVariant.price) || 0,
            min_stock_level: newVariant.min_stock_level,
            image_url: newVariant.image_urls.filter(u => u).join(',') // Join multiple URLs
        };
    };

    const handleSubmit = async () => {
        let variantsToSave = [...(formData.variants || [])];

        // Check if there is a pending variant in the form
        if (activeTab === 'variants' && hasPendingVariant()) {
            // Validate pending variant
            const isDimensionsIncomplete = !newVariant.dimensions.length || !newVariant.dimensions.width || !newVariant.dimensions.height;
            const isColorMissing = !newVariant.color && !newVariant.crystal_color;

            // Only auto-add if it has enough info, otherwise warn or ignore?
            // User requested "save variant with the same button".
            // If data is incomplete, we should probably warn them OR just try to add and let validation fail if strict.
            // But let's be smart: if they typed *something*, try to save it.

            if (isDimensionsIncomplete && isColorMissing) {
                // If missing basic info, maybe just ask confirmation?
                // For now, let's assume if they filled anything, they want to save it.
            } else {
                const pendingVariant = createVariantObject();
                console.log('Auto-adding pending variant:', pendingVariant);
                variantsToSave.push(pendingVariant);

                // Update local state to reflect UI immediately (optional, but good for feedback)
                setFormData(prev => ({ ...prev, variants: variantsToSave }));

                // Clear form
                setNewVariant({ color: '', crystal_color: '', dimensions: { length: '', width: '', height: '' }, price: '', min_stock_level: 0, image_urls: [''] });
            }
        }

        const success = await saveProduct(variantsToSave);
        if (success) {
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'general', label: 'ข้อมูลทั่วไป', icon: Box },
        { id: 'variants', label: `ตัวเลือกสินค้า (${formData.variants?.length || 0}${hasPendingVariant() ? ' +1' : ''})`, icon: Tag }
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
                        <GeneralInfoTab
                            formData={formData}
                            setFormData={setFormData}
                            handleCategoryChange={handleCategoryChange}
                            categoryOptions={categoryOptions}
                            materials={materials}
                            addCategory={addCategory}
                            addMaterial={addMaterial}
                        />
                    )}

                    {activeTab === 'variants' && (
                        <VariantTab
                            variants={formData.variants || []}
                            setVariants={(newVars) => setFormData(prev => ({ ...prev, variants: newVars }))}
                            productCode={formData.product_code}
                            // Pass down lifted state
                            newVariant={newVariant}
                            setNewVariant={setNewVariant}
                            getPreviewSKU={getPreviewSKU}
                            onCreateVariant={createVariantObject}
                            productName={formData.name}
                            productMaterial={formData.material}
                            productDescription={formData.description}
                        />
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
                        <span>{loading ? 'กำลังบันทึก...' :
                            (activeTab === 'variants' && hasPendingVariant()) ? '+ เพิ่มและบันทึก' : 'บันทึกสินค้า'
                        }</span>
                    </button>
                </div>
            </div>
        </div >
    );
}
