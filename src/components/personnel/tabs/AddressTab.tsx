import React from 'react';
import {
    MapPin,
    Globe,
    Trash2,
    Sparkles
} from 'lucide-react';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import { AddressTabProps } from './types';

/**
 * AddressTab - ที่อยู่ Tab
 * Manages employee addresses with full Thai address fields.
 * Updated to match CustomerModal card-style layout.
 */
export default function AddressTab({
    formData,
    onUpdateListItem,
    onAddListItem,
    onRemoveListItem,
    onOpenMagicPaste
}: AddressTabProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formData.addresses.map((addr, idx) => (
                <div key={addr.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} style={{ color: 'var(--primary-500)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลที่อยู่ #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onOpenMagicPaste('address', addr.id)}
                                title="กรอกอัตโนมัติ (AI)"
                            >
                                <Sparkles size={14} />
                            </button>
                            {addr.is_default && (
                                <span className="badge-primary">
                                    PRIMARY
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onRemoveListItem('addresses', addr.id)}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="ลบที่อยู่"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <FormInput
                                label="ป้ายชื่อ"
                                placeholder="ป้ายชื่อที่อยู่ (เช่น บ้าน, หอพัก)"
                                value={addr.label}
                                onChange={v => onUpdateListItem('addresses', addr.id, 'label', v)}
                                icon={MapPin}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="เลขที่"
                                    placeholder="เลขที่"
                                    value={addr.number}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'number', v)}
                                    icon={MapPin}
                                />
                                <FormInput
                                    label="หมู่ที่"
                                    placeholder="หมู่ที่"
                                    value={addr.villageno}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'villageno', v)}
                                    icon={MapPin}
                                />
                            </div>
                            <FormInput
                                label="หมู่บ้าน / อาคาร"
                                placeholder="หมู่บ้าน / อาคาร"
                                value={addr.village}
                                onChange={v => onUpdateListItem('addresses', addr.id, 'village', v)}
                                icon={MapPin}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="ซอย"
                                    placeholder="ซอย"
                                    value={addr.lane}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'lane', v)}
                                    icon={MapPin}
                                />
                                <FormInput
                                    label="ถนน"
                                    placeholder="ถนน"
                                    value={addr.road}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'road', v)}
                                    icon={MapPin}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="ตำบล / แขวง"
                                    placeholder="ตำบล / แขวง"
                                    value={addr.subdistrict}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'subdistrict', v)}
                                    icon={MapPin}
                                />
                                <FormInput
                                    label="อำเภอ / เขต"
                                    placeholder="อำเภอ / เขต"
                                    value={addr.district}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'district', v)}
                                    icon={MapPin}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput
                                    label="จังหวัด"
                                    placeholder="จังหวัด"
                                    value={addr.province}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'province', v)}
                                    icon={MapPin}
                                />
                                <FormInput
                                    label="รหัสไปรษณีย์"
                                    placeholder="รหัสไปรษณีย์"
                                    value={addr.zipcode}
                                    onChange={v => onUpdateListItem('addresses', addr.id, 'zipcode', v)}
                                    icon={MapPin}
                                />
                            </div>
                            <FormInput
                                label="Google Maps Link"
                                icon={Globe}
                                placeholder="Link Google Maps (ถ้ามี)"
                                value={addr.maps}
                                onChange={v => onUpdateListItem('addresses', addr.id, 'maps', v)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <AddItemButton
                onClick={() => onAddListItem('addresses', {
                    label: 'ที่อยู่ #' + ((formData.addresses?.length || 0) + 1),
                    number: '',
                    villageno: '',
                    village: '',
                    lane: '',
                    road: '',
                    subdistrict: '',
                    district: '',
                    province: '',
                    zipcode: '',
                    maps: '',
                    is_default: false
                })}
                label="เพิ่มที่อยู่"
            />
        </div>
    );
}
