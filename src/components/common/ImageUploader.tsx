import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
    imageUrl: string;
    onImageChange: (url: string, file?: File) => void;
    label?: string;
    placeholder?: string;
    accept?: string;
    maxHeight?: string;
}

/**
 * ImageUploader - Reusable image upload component
 * Adapted from DocumentTab upload pattern for use in ProductModal and VariantManager.
 */
export default function ImageUploader({
    imageUrl,
    onImageChange,
    label = 'รูปภาพสินค้า',
    placeholder = 'คลิกเพื่ออัปโหลดรูปภาพ',
    accept = 'image/*',
    maxHeight = '180px'
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            onImageChange(fileUrl, file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const isValidImageUrl = (url: string) => {
        return url && (url.startsWith('blob:') || url.startsWith('http') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {label && (
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    {label}
                </label>
            )}
            <div
                onClick={() => inputRef.current?.click()}
                style={{
                    border: '2px dashed #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: imageUrl ? '#f8fafc' : 'white',
                    transition: 'all 0.2s',
                    position: 'relative',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-300)';
                    e.currentTarget.style.background = '#fafaff';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = imageUrl ? '#f8fafc' : 'white';
                }}
            >
                {imageUrl && isValidImageUrl(imageUrl) ? (
                    <>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{
                                maxHeight: maxHeight,
                                maxWidth: '100%',
                                borderRadius: '12px',
                                objectFit: 'contain'
                            }}
                        />
                        <button
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                border: 'none',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="ลบรูป"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: 'var(--primary-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ImageIcon size={28} style={{ color: 'var(--primary-400)' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>
                            {placeholder}
                        </span>
                        <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                            JPG, PNG, GIF (max 5MB)
                        </span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept={accept}
                    onChange={handleFileSelect}
                    title="เลือกรูปภาพ"
                />
            </div>
        </div>
    );
}
