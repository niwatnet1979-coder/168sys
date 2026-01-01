import React from 'react';
import { MapPin, Globe, Trash2, Sparkles } from 'lucide-react';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import { Customer, CustomerAddress } from '../../../types/customer';

interface AddressTabProps {
    formData: Customer;
    onChange: (data: Customer) => void;
    onMagicPaste: (id: string) => void;
}

export default function AddressTab({ formData, onChange, onMagicPaste }: AddressTabProps) {
    const addresses = formData.addresses || [];

    const handleUpdate = (id: string, field: keyof CustomerAddress, value: any) => {
        const updatedAddresses = addresses.map(item =>
            String(item.id) === String(id) ? { ...item, [field]: value } : item
        );
        onChange({ ...formData, addresses: updatedAddresses });
    };

    const handleRemove = (id: string) => {
        const updatedAddresses = addresses.filter(item => String(item.id) !== String(id));
        onChange({ ...formData, addresses: updatedAddresses });
    };

    const handleAdd = () => {
        const newAddress: CustomerAddress = {
            id: Date.now().toString(),
            label: 'สาขา ' + ((addresses.length || 0) + 1),
            place_name: '',
            number: '',
            villageno: '',
            village: '',
            lane: '',
            road: '',
            subdistrict: '',
            district: '',
            province: '',
            zipcode: '',
            maps: ''
        };
        onChange({ ...formData, addresses: [...addresses, newAddress] });
    };

    return (
        <div className="flex flex-col gap-6">
            {addresses.map((addr, idx) => (
                <div key={addr.id} className="card p-5 relative border border-slate-100 rounded-2xl shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary-500" />
                            <span className="text-[15px] font-bold text-slate-600">ข้อมูลที่อยู่ #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onMagicPaste(String(addr.id))}
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
                            onClick={() => handleRemove(String(addr.id))}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className="hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <FormInput
                            label="ป้ายชื่อที่อยู่"
                            placeholder="ป้ายชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ, หน้าไซต์งาน)"
                            value={addr.label || ''}
                            onChange={v => handleUpdate(String(addr.id), 'label', v)}
                            icon={MapPin}
                        />
                        <FormInput
                            label="ชื่อสถานที่"
                            placeholder="ชื่อสถานที่ (เช่น ร้านแสงเจริญ, ตึกภิรัช)"
                            value={addr.place_name || ''}
                            onChange={v => handleUpdate(String(addr.id), 'place_name', v)}
                            icon={MapPin}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="เลขที่"
                                placeholder="เลขที่"
                                value={addr.number || ''}
                                onChange={v => handleUpdate(String(addr.id), 'number', v)}
                                icon={MapPin}
                            />
                            <FormInput
                                label="หมู่ที่"
                                placeholder="หมู่ที่"
                                value={addr.villageno || ''}
                                onChange={v => handleUpdate(String(addr.id), 'villageno', v)}
                                icon={MapPin}
                            />
                        </div>
                        <FormInput
                            label="หมู่บ้าน / อาคาร"
                            placeholder="หมู่บ้าน / อาคาร"
                            value={addr.village || ''}
                            onChange={v => handleUpdate(String(addr.id), 'village', v)}
                            icon={MapPin}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="ซอย"
                                placeholder="ซอย"
                                value={addr.lane || ''}
                                onChange={v => handleUpdate(String(addr.id), 'lane', v)}
                                icon={MapPin}
                            />
                            <FormInput
                                label="ถนน"
                                placeholder="ถนน"
                                value={addr.road || ''}
                                onChange={v => handleUpdate(String(addr.id), 'road', v)}
                                icon={MapPin}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="แขวง / ตำบล"
                                placeholder="แขวง / ตำบล"
                                value={addr.subdistrict || ''}
                                onChange={v => handleUpdate(String(addr.id), 'subdistrict', v)}
                                icon={MapPin}
                            />
                            <FormInput
                                label="เขต / อำเภอ"
                                placeholder="เขต / อำเภอ"
                                value={addr.district || ''}
                                onChange={v => handleUpdate(String(addr.id), 'district', v)}
                                icon={MapPin}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="จังหวัด"
                                placeholder="จังหวัด"
                                value={addr.province || ''}
                                onChange={v => handleUpdate(String(addr.id), 'province', v)}
                                icon={MapPin}
                            />
                            <FormInput
                                label="รหัสไปรษณีย์"
                                placeholder="รหัสไปรษณีย์"
                                value={addr.zipcode || ''}
                                onChange={v => handleUpdate(String(addr.id), 'zipcode', v)}
                                icon={MapPin}
                            />
                        </div>
                        <FormInput
                            label="Google Maps Link"
                            placeholder="Link Google Maps (ถ้ามี)"
                            value={addr.maps || ''}
                            onChange={v => handleUpdate(String(addr.id), 'maps', v)}
                            icon={Globe}
                        />
                    </div>
                </div>
            ))}

            <AddItemButton onClick={handleAdd} label="เพิ่มที่อยู่ติดตั้งเพิ่ม" />
        </div>
    );
}
