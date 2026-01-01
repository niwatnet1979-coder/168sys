import React from 'react';
import { FileText } from 'lucide-react';
import { SettingsData } from '../../../types/settings';

interface DocumentTabProps {
    settings: SettingsData;
    setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
}

export default function DocumentTab({ settings, setSettings }: DocumentTabProps) {
    if (!settings) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <FileText size={18} style={{ color: 'var(--primary-500)' }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: '1' }}>เงื่อนไขมาตรฐานในเอกสาร</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>เงื่อนไขการเสนอราคา (Default Terms)</label>
                    <textarea
                        className="input-field"
                        rows={6}
                        style={{ height: 'auto', padding: '12px' }}
                        value={settings.documents.default_terms || ''}
                        onChange={e => setSettings({ ...settings, documents: { ...settings.documents, default_terms: e.target.value } })}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>นโยบายการรับประกัน (Warranty Policy)</label>
                    <textarea
                        className="input-field"
                        rows={6}
                        style={{ height: 'auto', padding: '12px' }}
                        value={settings.documents.warranty_policy || ''}
                        onChange={e => setSettings({ ...settings, documents: { ...settings.documents, warranty_policy: e.target.value } })}
                    />
                </div>
            </div>
        </div>
    );
}
