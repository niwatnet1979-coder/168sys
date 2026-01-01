import React from 'react';
import { Store, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import FormInput from '../../common/FormInput';
import { SettingsData } from '../../../types/settings';

interface ShopInfoTabProps {
    settings: SettingsData;
    setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
}

export default function ShopInfoTab({ settings, setSettings }: ShopInfoTabProps) {
    if (!settings) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Standard Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Store size={18} style={{ color: 'var(--primary-500)' }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: '1' }}>ข้อมูลร้านค้าและพิกัด</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput
                    label="ชื่อร้าน / บริษัท"
                    placeholder="ชื่อร้าน / บริษัท"
                    value={settings.shop.name || ''}
                    onChange={v => setSettings({ ...settings, shop: { ...settings.shop, name: v } })}
                    icon={Store}
                />
                <FormInput
                    label="ชื่อสถานที่"
                    placeholder="ชื่อสถานที่ (เช่น อาคารบี, ชั้น 2)"
                    value={settings.shop.place_name || ''}
                    onChange={v => setSettings({ ...settings, shop: { ...settings.shop, place_name: v } })}
                    icon={MapPin}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormInput label="เลขที่" placeholder="เลขที่" value={settings.shop.number || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, number: v } })} icon={MapPin} />
                    <FormInput label="หมู่ที่" placeholder="หมู่ที่" value={settings.shop.villageno || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, villageno: v } })} icon={MapPin} />
                </div>
                <FormInput label="หมู่บ้าน/คอนโด" placeholder="หมู่บ้าน/คอนโด" value={settings.shop.village || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, village: v } })} icon={MapPin} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormInput label="ซอย" placeholder="ซอย" value={settings.shop.soi || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, soi: v } })} icon={MapPin} />
                    <FormInput label="ถนน" placeholder="ถนน" value={settings.shop.road || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, road: v } })} icon={MapPin} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormInput label="ตำบล/แขวง" placeholder="ตำบล/แขวง" value={settings.shop.subdistrict || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, subdistrict: v } })} icon={MapPin} />
                    <FormInput label="อำเภอ/เขต" placeholder="อำเภอ/เขต" value={settings.shop.district || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, district: v } })} icon={MapPin} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormInput label="จังหวัด" placeholder="จังหวัด" value={settings.shop.province || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, province: v } })} icon={MapPin} />
                    <FormInput label="รหัสไปรษณีย์" placeholder="รหัสไปรษณีย์" value={settings.shop.zipcode || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, zipcode: v } })} icon={MapPin} />
                </div>

                <div style={{ position: 'relative' }}>
                    <FormInput
                        label="Google Maps Link"
                        placeholder="Google Maps Link"
                        value={settings.shop.google_map_link || ''}
                        onChange={v => setSettings({ ...settings, shop: { ...settings.shop, google_map_link: v } })}
                        icon={MapPin}
                    />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Phone size={18} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: '1' }}>ข้อมูลติดต่อและภาษี</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormInput label="เบอร์โทรศัพท์" placeholder="เบอร์โทรศัพท์" value={settings.shop.phone || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, phone: v } })} icon={Phone} />
                    <FormInput label="อีเมล" placeholder="อีเมล" value={settings.shop.email || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, email: v } })} icon={Mail} />
                </div>
                <FormInput label="เลขประจำตัวผู้เสียภาษี" placeholder="เลขประจำตัวผู้เสียภาษี" value={settings.shop.tax_id || ''} onChange={v => setSettings({ ...settings, shop: { ...settings.shop, tax_id: v } })} icon={CreditCard} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="vat_reg"
                            checked={settings.financial.vat_registered}
                            onChange={e => setSettings({ ...settings, financial: { ...settings.financial, vat_registered: e.target.checked } })}
                        />
                        <label htmlFor="vat_reg" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>จดทะเบียน VAT</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>อัตราภาษี (%):</span>
                        <input
                            type="number"
                            className="input-field"
                            style={{ width: '80px', padding: '6px 12px' }}
                            value={settings.financial.vat_rate}
                            onFocus={e => e.target.select()}
                            onChange={e => setSettings({ ...settings, financial: { ...settings.financial, vat_rate: e.target.value === '' ? undefined : parseFloat(e.target.value) } })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
