import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageToStorage, isBlobUrl } from '../../lib/storageService';

interface ImageUploaderProps {
    imageUrl: string;
    onImageChange: (url: string, file?: File) => void;
    label?: string;
    placeholder?: string;
    accept?: string;
    maxHeight?: string;
    bucket?: string;
    folder?: string;
}

/**
 * ImageUploader - Reusable image upload component with Supabase Storage integration
 * Uploads images directly to Supabase Storage and returns permanent URLs.
 */
export default function ImageUploader({
    imageUrl,
    onImageChange,
    label = 'รูปภาพสินค้า',
    placeholder = 'คลิกเพื่ออัปโหลดรูปภาพ',
    accept = 'image/*',
    maxHeight = '180px',
    bucket = 'product-images',
    folder = ''
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        onImageChange(previewUrl, file);

        // Start upload to Supabase Storage
        setIsUploading(true);
        setUploadProgress('กำลังอัปโหลด...');

        try {
            const permanentUrl = await uploadImageToStorage(file, bucket, folder);
            onImageChange(permanentUrl);
            setUploadProgress('อัปโหลดสำเร็จ!');

            // Clear progress after 2 seconds
            setTimeout(() => setUploadProgress(''), 2000);
        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadProgress(`อัปโหลดไม่สำเร็จ: ${error.message}`);
            // Keep the blob preview so user can see what they selected
        } finally {
            setIsUploading(false);
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
                onClick={() => !isUploading && inputRef.current?.click()}
                style={{
                    border: '2px dashed #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: isUploading ? 'wait' : 'pointer',
                    background: imageUrl ? '#f8fafc' : 'white',
                    transition: 'all 0.2s',
                    position: 'relative',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isUploading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                    if (!isUploading) {
                        e.currentTarget.style.borderColor = 'var(--primary-300)';
                        e.currentTarget.style.background = '#fafaff';
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = imageUrl ? '#f8fafc' : 'white';
                }}
            >
                {imageUrl && isValidImageUrl(imageUrl) ? (
                    <div style={{ position: 'relative' }}>
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
                        {/* Upload status indicator */}
                        {(isUploading || uploadProgress) && (
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: isUploading ? 'var(--primary-600)' :
                                    uploadProgress.includes('สำเร็จ') ? '#16a34a' : '#dc2626',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                whiteSpace: 'nowrap'
                            }}>
                                {isUploading && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                                {uploadProgress || 'กำลังอัปโหลด...'}
                            </div>
                        )}
                        {/* Blob URL indicator */}
                        {isBlobUrl(imageUrl) && !isUploading && !uploadProgress && (
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 600
                            }}>
                                ⚠️ ยังไม่ได้อัปโหลด
                            </div>
                        )}
                    </div>
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
                    disabled={isUploading}
                />
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
