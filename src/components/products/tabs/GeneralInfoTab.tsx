import React from 'react';
import { Box, Package, Tag } from 'lucide-react';
import FormInput from '../../common/FormInput';
import FormTextarea from '../../common/FormTextarea';
import DynamicSelect from '../../common/DynamicSelect';
import MultiImageUploader from '../../common/MultiImageUploader';
import { ProductFormData } from '../../../hooks/useProductForm';
import { Option as SystemOption } from '../../../hooks/useSystemOptions';

interface GeneralInfoTabProps {
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    handleCategoryChange: (value: string) => void;
    categoryOptions: SystemOption[];
    materials: SystemOption[];
    addCategory: (label: string, value: string) => Promise<any>;
    addMaterial: (label: string, value: string) => Promise<any>;
}

export default function GeneralInfoTab({
    formData,
    setFormData,
    handleCategoryChange,
    categoryOptions,
    materials,
    addCategory,
    addMaterial
}: GeneralInfoTabProps) {
    return (
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
                            onChange={(v) => setFormData(prev => ({ ...prev, product_code: v }))}
                            icon={Tag}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="ชื่อสินค้า *"
                            placeholder="ระบุชื่อสินค้า..."
                            value={formData.name}
                            onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
                            icon={Package}
                        />
                        <DynamicSelect
                            label="วัสดุหลัก"
                            placeholder="เลือกวัสดุ..."
                            value={formData.material}
                            onChange={(v) => setFormData(prev => ({ ...prev, material: String(v) }))}
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
                        onChange={(v) => setFormData(prev => ({ ...prev, description: v }))}
                    />
                </div>
            </div>

            {/* Section: รูปภาพสินค้า */}
            <MultiImageUploader
                images={formData.image_url ? formData.image_url.split(',') : ['']}
                onChange={(urls) => setFormData(prev => ({ ...prev, image_url: urls.join(',') }))}
                title="รูปภาพสินค้า"
                placeholder="คลิกเพื่ออัปโหลดรูปภาพสินค้า"
            />
        </div>
    );
}
