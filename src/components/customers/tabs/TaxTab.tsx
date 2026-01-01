import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, Trash2, MapPin } from 'lucide-react';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import DynamicSelect from '../../common/DynamicSelect';
import { Customer, CustomerTaxInvoice, CustomerAddress } from '../../../types/customer';

interface TaxTabProps {
    formData: Customer;
    onChange: (data: Customer) => void;
    onMagicPaste: (id: string) => void;
}

export default function TaxTab({ formData, onChange, onMagicPaste }: TaxTabProps) {
    const taxInvoices = formData.tax_invoices || [];
    const addresses = formData.addresses || [];

    const handleUpdate = (id: string, field: keyof CustomerTaxInvoice, value: any) => {
        const updatedTax = taxInvoices.map(item =>
            String(item.id) === String(id) ? { ...item, [field]: value } : item
        );
        onChange({ ...formData, tax_invoices: updatedTax });
    };

    const handleRemove = (id: string) => {
        const updatedTax = taxInvoices.filter(item => String(item.id) !== String(id));
        onChange({ ...formData, tax_invoices: updatedTax });
    };

    const handleAdd = () => {
        const newTax: CustomerTaxInvoice = {
            id: Date.now().toString(),
            company: '',
            branch: '00000',
            taxid: '',
        };
        onChange({ ...formData, tax_invoices: [...taxInvoices, newTax] });
    };

    const applyAddressToTax = (taxId: string, addressId: string) => {
        const addr = addresses.find(a => String(a.id) === String(addressId));
        if (!addr) return;

        const tax = taxInvoices.find(t => String(t.id) === String(taxId));
        if (!tax) return;

        const updatedItem: CustomerTaxInvoice = {
            ...tax,
            number: addr.number || '',
            villageno: addr.villageno || '',
            village: addr.village || '',
            lane: addr.lane || '',
            road: addr.road || '',
            subdistrict: addr.subdistrict || '',
            district: addr.district || '',
            province: addr.province || '',
            zipcode: addr.zipcode || '',
            maps: addr.maps || ''
        };

        const updatedList = taxInvoices.map(item => String(item.id) === String(taxId) ? updatedItem : item);
        onChange({ ...formData, tax_invoices: updatedList });
    };

    return (
        <div className="flex flex-col gap-6">
            {taxInvoices.map((tax, idx) => (
                <div key={tax.id} className="card p-5 relative border border-slate-100 rounded-2xl shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-primary-500" />
                            <span className="text-[15px] font-bold text-slate-600">ข้อมูลใบกำกับภาษี #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onMagicPaste(String(tax.id))}
                                title="กรอกอัตโนมัติ (AI)"
                            >
                                <Sparkles size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleRemove(String(tax.id))}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className="hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <FormInput
                            label="ชื่อจดทะเบียน"
                            placeholder="ชื่อจดทะเบียนบริษัท หรือ ชื่อบุคคล"
                            value={tax.company}
                            onChange={v => handleUpdate(String(tax.id), 'company', v)}
                            icon={FileText}
                        />

                        <div className="grid grid-cols-[2fr_1fr] gap-3">
                            <FormInput
                                label="เลขประจำตัวผู้เสียภาษี"
                                placeholder="เลขประจำตัวผู้เสียภาษี (13 หลัก)"
                                value={tax.taxid || ''}
                                onChange={v => handleUpdate(String(tax.id), 'taxid', v)}
                                icon={FileText}
                            />
                            <FormInput
                                label="รหัสสาขา"
                                placeholder="รหัสสาขา"
                                value={tax.branch || ''}
                                onChange={v => handleUpdate(String(tax.id), 'branch', v)}
                                icon={FileText}
                            />
                        </div>

                        {/* Registered Address Section */}
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <MapPin size={12} />
                                    ที่อยู่ตามใบกำกับภาษี
                                </label>
                                <div className="w-[200px]">
                                    <DynamicSelect
                                        placeholder="ดึงข้อมูลจากที่อยู่..."
                                        value=""
                                        onChange={(val) => applyAddressToTax(String(tax.id), String(val))}
                                        options={addresses.map(a => ({
                                            value: String(a.id),
                                            label: a.label || `บ้านเลขที่ ${a.number}` || 'ไม่ระบุชื่อ'
                                        }))}
                                        onAddItem={() => { }} // No-op for address selection
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="เลขที่" placeholder="เลขที่" value={tax.number || ''} onChange={v => handleUpdate(String(tax.id), 'number', v)} />
                                    <FormInput label="หมู่ที่" placeholder="หมู่ที่" value={tax.villageno || ''} onChange={v => handleUpdate(String(tax.id), 'villageno', v)} />
                                </div>
                                <FormInput label="หมู่บ้าน / อาคาร" placeholder="หมู่บ้าน / อาคาร" value={tax.village || ''} onChange={v => handleUpdate(String(tax.id), 'village', v)} />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="ซอย" placeholder="ซอย" value={tax.lane || ''} onChange={v => handleUpdate(String(tax.id), 'lane', v)} />
                                    <FormInput label="ถนน" placeholder="ถนน" value={tax.road || ''} onChange={v => handleUpdate(String(tax.id), 'road', v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="แขวง / ตำบล" placeholder="แขวง / ตำบล" value={tax.subdistrict || ''} onChange={v => handleUpdate(String(tax.id), 'subdistrict', v)} />
                                    <FormInput label="เขต / อำเภอ" placeholder="เขต / อำเภอ" value={tax.district || ''} onChange={v => handleUpdate(String(tax.id), 'district', v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="จังหวัด" placeholder="จังหวัด" value={tax.province || ''} onChange={v => handleUpdate(String(tax.id), 'province', v)} />
                                    <FormInput label="รหัสไปรษณีย์" placeholder="รหัสไปรษณีย์" value={tax.zipcode || ''} onChange={v => handleUpdate(String(tax.id), 'zipcode', v)} />
                                </div>
                                <FormInput label="Google Maps Link" placeholder="Google Maps Link" value={tax.maps || ''} onChange={v => handleUpdate(String(tax.id), 'maps', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <AddItemButton onClick={handleAdd} label="เพิ่มชุดข้อมูลภาษี" />
        </div>
    );
}
