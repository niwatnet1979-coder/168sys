import React from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import AddItemButton from './AddItemButton';

interface MultiImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    title?: string;
    maxHeight?: string;
    placeholder?: string;
}

/**
 * MultiImageUploader - Reusable component for uploading multiple images
 * Used in ProductModal (รูปภาพสินค้า) and VariantManager (รูปภาพตัวเลือก)
 * Features: Add multiple images, delete images, show count
 */
export default function MultiImageUploader({
    images,
    onChange,
    title = 'รูปภาพ',
    maxHeight = '100px',
    placeholder = 'คลิกเพื่ออัปโหลดรูปภาพ'
}: MultiImageUploaderProps) {
    // Ensure at least one slot exists
    const imageList = images.length > 0 ? images : [''];

    const handleImageChange = (index: number, url: string) => {
        const updated = [...imageList];
        updated[index] = url;
        onChange(updated);
    };

    const handleAddImage = () => {
        onChange([...imageList, '']);
    };

    const handleRemoveImage = (index: number) => {
        const updated = imageList.filter((_, i) => i !== index);
        onChange(updated.length > 0 ? updated : ['']);
    };

    const uploadedCount = imageList.filter(url => url).length;

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <ImageIcon size={14} style={{ color: '#94a3b8' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                    {title} ({uploadedCount})
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {imageList.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                        <ImageUploader
                            imageUrl={url}
                            onImageChange={(newUrl) => handleImageChange(idx, newUrl)}
                            label={imageList.length > 1 ? `รูปที่ ${idx + 1}` : ''}
                            placeholder={placeholder}
                            maxHeight={maxHeight}
                        />
                        {imageList.length > 1 && (
                            <button
                                onClick={() => handleRemoveImage(idx)}
                                style={{
                                    position: 'absolute',
                                    top: imageList.length > 1 ? '24px' : '8px',
                                    right: '8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: '#fda4af',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="ลบรูปนี้"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                ))}
                <AddItemButton
                    onClick={handleAddImage}
                    label="เพิ่มรูปภาพ"
                />
            </div>
        </div>
    );
}
