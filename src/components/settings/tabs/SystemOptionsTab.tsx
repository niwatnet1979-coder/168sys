import React from 'react';
import {
    List, Sparkles, Users, Globe, User, CreditCard, FileText, Plus, Trash2, LucideIcon,
    Tags, Package, Palette, Gem, Lightbulb, Wifi, Zap, MessageCircle, Briefcase, BadgeCheck,
    BarChart2, Banknote, Coins, Percent, Landmark, Receipt
} from 'lucide-react';
import { SettingsData, SystemOption } from '../../../types/settings';

interface OptionSectionProps {
    category: { id: string; label: string; icon: LucideIcon };
    settings: SettingsData;
    setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
    handleSyncOptions: (category: string, items: SystemOption[]) => Promise<void>;
}

const OptionSection: React.FC<OptionSectionProps> = ({ category, settings, setSettings, handleSyncOptions }) => {
    const items = settings.systemOptions[category.id] || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <category.icon size={16} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{category.label}</span>
                </div>
                <button
                    className="button-ghost"
                    style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '8px' }}
                    onClick={() => {
                        const val = prompt(`เพิ่ม${category.label}`);
                        if (val) {
                            const newOption: SystemOption = { id: Date.now(), value: val, label: val };
                            const updated = [...items, newOption];
                            setSettings({ ...settings, systemOptions: { ...settings.systemOptions, [category.id]: updated } });
                            handleSyncOptions(category.id, updated);
                        }
                    }}
                >
                    <Plus size={12} /> เพิ่ม
                </button>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px',
                background: 'var(--bg-main)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                minHeight: '45px'
            }}>
                {items.length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>ไม่มีข้อมูล</span>}
                {items.map((item, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '12px',
                        fontWeight: 500,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {item.label}
                        <button
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', padding: 0, display: 'flex' }}
                            className="hover:text-red-500 transition-colors"
                            onClick={() => {
                                const updated = items.filter((_, i) => i !== idx);
                                setSettings({ ...settings, systemOptions: { ...settings.systemOptions, [category.id]: updated } });
                                handleSyncOptions(category.id, updated);
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface SystemOptionsTabProps {
    settings: SettingsData;
    setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
    handleSyncOptions: (category: string, items: SystemOption[]) => Promise<void>;
}

export default function SystemOptionsTab({ settings, setSettings, handleSyncOptions }: SystemOptionsTabProps) {
    if (!settings) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Product Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                    <Package size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ตัวเลือกสินค้า</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { id: 'productTypes', label: 'ประเภทสินค้า', icon: Tags },
                        { id: 'materials', label: 'วัสดุสินค้า', icon: Package },
                        { id: 'materialColors', label: 'สีวัสดุ', icon: Palette },
                        { id: 'crystalColors', label: 'สีคริสตัล', icon: Gem },
                        { id: 'lightColors', label: 'สีแสงไฟ', icon: Lightbulb },
                        { id: 'remotes', label: 'รีโมท', icon: Wifi },
                        { id: 'bulbTypes', label: 'ประเภทหลอดไฟ', icon: Zap }
                    ].map(category => (
                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                    <Users size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>การขายและลูกค้า</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { id: 'customerChannels', label: 'ช่องทางติดต่อ (Channels)', icon: MessageCircle },
                    ].map(category => (
                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                    ))}
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Human Resources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                    <User size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ทีมงานและบุคลากร</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { id: 'teamNames', label: 'รายชื่อทีมงาน', icon: Users },
                        { id: 'teamTypes', label: 'ประเภททีม', icon: Briefcase },
                        { id: 'jobPositions', label: 'ตำแหน่งงาน', icon: BadgeCheck },
                        { id: 'jobLevels', label: 'ระดับงาน', icon: BarChart2 },
                        { id: 'employmentTypes', label: 'ประเภทการจ้างงาน', icon: FileText },
                        { id: 'paymentTypes', label: 'รูปแบบการจ่ายเงิน', icon: Banknote },
                        { id: 'payRates', label: 'อัตราค่าจ้างมาตรฐาน', icon: Coins },
                        { id: 'incentiveRates', label: 'อัตราคอมมิชชัน', icon: Percent }
                    ].map(category => (
                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                    ))}
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Finance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                    <CreditCard size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>การเงิน</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { id: 'bankNames', label: 'รายชื่อธนาคาร', icon: Landmark },
                        { id: 'documentTypes', label: 'ประเภทเอกสาร', icon: FileText },
                        { id: 'expenseTypes', label: 'ประเภทรายจ่าย', icon: Receipt }
                    ].map(category => (
                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                    ))}
                </div>
            </div>

        </div>
    );
}
