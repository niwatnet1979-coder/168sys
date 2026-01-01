import {
    FileText,
    Upload,
    Trash2
} from 'lucide-react';
import DynamicSelect from '../../common/DynamicSelect';
import AddItemButton from '../../common/AddItemButton';
import { DocumentTabProps, SystemOptionsMap } from './types';

// Default document type options
const DEFAULT_DOC_TYPES = [
    { value: 'id_card', label: 'บัตรประชาชน' },
    { value: 'house_reg', label: 'ทะเบียนบ้าน' },
    { value: 'resume', label: 'Resume / CV' },
    { value: 'contract', label: 'สัญญาจ้าง' },
    { value: 'other', label: 'อื่นๆ' }
];

interface ExtendedDocumentTabProps extends DocumentTabProps {
    systemOptions: SystemOptionsMap;
    onAddNewOption: (category: string, value: string) => Promise<void>;
    onUpdateListItem: (listName: 'documents', id: string | number, field: string, value: any) => void;
}

/**
 * DocumentTab - เอกสาร Tab
 * Manages employee documents with file upload support.
 * Updated to match CustomerModal card-style layout.
 */
export default function DocumentTab({
    formData,
    systemOptions,
    onFileSelect,
    onAddListItem,
    onRemoveListItem,
    onAddNewOption,
    onUpdateListItem
}: ExtendedDocumentTabProps) {
    // Combine system options with defaults, remove duplicates
    const docTypeOptions = [
        ...(systemOptions.documentTypes || []),
        ...DEFAULT_DOC_TYPES
    ].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formData.documents?.map((doc, idx) => (
                <div key={doc.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} style={{ color: 'var(--primary-500)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>เอกสาร #{idx + 1}</span>
                        </div>
                        <button
                            onClick={() => onRemoveListItem('documents', doc.id)}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="ลบเอกสาร"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <DynamicSelect
                            label="ประเภทเอกสาร"
                            placeholder="เลือกประเภทเอกสาร..."
                            value={doc.doc_type}
                            onChange={v => onUpdateListItem('documents', doc.id, 'doc_type', v)}
                            options={docTypeOptions}
                            onAddItem={v => onAddNewOption('documentTypes', v)}
                        />

                        {/* Upload Area */}
                        <div
                            style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '16px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: doc.file_url ? '#f8fafc' : 'white',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.background = '#fafafa'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = doc.file_url ? '#f8fafc' : 'white'; }}
                        >
                            {doc.file_url ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    {doc.file_obj?.type?.startsWith('image/') || doc.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img
                                            src={doc.file_url}
                                            alt="Preview"
                                            style={{ maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <FileText size={48} style={{ color: '#94a3b8' }} />
                                    )}
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                                        {doc.file_name || 'Attached File'}
                                    </span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                                    <Upload size={32} />
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                        คลิกเพื่ออัปโหลดรูปหรือไฟล์ PDF
                                    </span>
                                </div>
                            )}
                            <input
                                type="file"
                                id={`file-upload-${doc.id}`}
                                style={{ display: 'none' }}
                                accept="image/*,application/pdf"
                                onChange={(e) => onFileSelect(doc.id as string, e)}
                                title="เลือกไฟล์"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <AddItemButton
                onClick={() => onAddListItem('documents', {
                    doc_type: 'id_card',
                    file_url: '',
                    file_name: '',
                    file_obj: null
                })}
                label="เพิ่มเอกสาร"
            />
        </div>
    );
}
