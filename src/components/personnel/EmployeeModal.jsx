import React, { useState, useEffect } from 'react';
import {
    X,
    User,
    Phone,
    MapPin,
    Building2,
    CreditCard,
    Plus,
    Trash2,
    Sparkles,
    Save,
    Image as ImageIcon
} from 'lucide-react';
import { saveEmployee } from '../../lib/v1/employeeManager';
import addressParser from '../../lib/v1/addressParser';
import { showError, showSuccess } from '../../lib/sweetAlert';

/**
 * EmployeeModal - ฟอร์มจัดการข้อมูลพนักงาน ( Relational )
 */
export default function EmployeeModal({ isOpen, onClose, employee, teams, onSaveSuccess }) {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        eid: '',
        nickname: '',
        first_name: '',
        last_name: '',
        team_id: '',
        job_position: '',
        job_level: '',
        employment_type: 'พนักงานประจำ',
        pay_type: 'รายเดือน',
        pay_rate: 0,
        incentive_rate: 0,
        status: 'current',
        contacts: [{ name: 'เบอร์หลัก', contact_type: 'phone', value: '', is_primary: true }],
        addresses: [{ label: 'ที่อยู่ปัจจุบัน', is_default: true }],
        bank_accounts: [{ bank_name: 'KBANK', account_number: '', is_default: true }]
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                ...employee,
                contacts: employee.contacts?.length ? employee.contacts : formData.contacts,
                addresses: employee.addresses?.length ? employee.addresses : formData.addresses,
                bank_accounts: employee.bank_accounts?.length ? employee.bank_accounts : formData.bank_accounts
            });
        } else {
            setFormData({
                ...formData,
                id: null,
                eid: 'EP-NEW' // Show placeholder for new record
            });
        }
    }, [employee]);

    const handleSave = async () => {
        if (!formData.nickname) return showError('กรุณาระบุชื่อเล่น');
        setLoading(true);
        const res = await saveEmployee(formData);
        if (res.success) {
            showSuccess(formData.id ? 'แก้ไขข้อมูลพนักงานสำเร็จ' : 'เพิ่มพนักงานสำเร็จ');
            onSaveSuccess();
            onClose();
        } else {
            showError('เกิดข้อผิดพลาด: ' + res.error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title">
                        <User size={20} className="header-icon" />
                        <h2>{formData.id ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h2>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    {[
                        { id: 'general', label: 'ทั่วไป', icon: User },
                        { id: 'contact', label: 'ติดต่อ', icon: Phone },
                        { id: 'address', label: 'ที่อยู่', icon: MapPin },
                        { id: 'bank', label: 'ธนาคาร', icon: CreditCard }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="modal-body">
                    {activeTab === 'general' && (
                        <div className="form-grid">
                            <div className="section-header">
                                <User size={18} color="var(--primary-500)" />
                                <span>ข้อมูลพื้นฐาน</span>
                                <button className="magic-icon-btn"><Sparkles size={14} /></button>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>รหัสพนักงาน</label>
                                    <input type="text" className="input-field" value={formData.eid} readOnly />
                                </div>
                                <div className="input-group">
                                    <label>ชื่อเล่น <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="เช่น กี"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>ชื่อจริง</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="ระบุชื่อจริง"
                                        value={formData.first_name || ''}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>นามสกุล</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="ระบุนามสกุล"
                                        value={formData.last_name || ''}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>ตำแหน่ง</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="เช่น หัวหน้าช่าง"
                                        value={formData.job_position || ''}
                                        onChange={e => setFormData({ ...formData, job_position: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>ทีม / ฝ่าย</label>
                                    <select
                                        className="input-field"
                                        value={formData.team_id || ''}
                                        onChange={e => setFormData({ ...formData, team_id: e.target.value })}
                                    >
                                        <option value="">เลือกทีม</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>ประเภทการจ้างงาน</label>
                                    <select
                                        className="input-field"
                                        value={formData.employment_type}
                                        onChange={e => setFormData({ ...formData, employment_type: e.target.value })}
                                    >
                                        <option value="พนักงานประจำ">พนักงานประจำ</option>
                                        <option value="พนักงานชั่วคราว">พนักงานชั่วคราว</option>
                                        <option value="สัญญาจ้าง">สัญญาจ้าง</option>
                                        <option value="ฝึกงาน">ฝึกงาน</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>สถานะพนักงาน</label>
                                    <select
                                        className="input-field"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="current">พนักงานปัจจุบัน (Current)</option>
                                        <option value="resigned">ลาออกแล้ว (Resigned)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>รูปแบบการจ่ายเงิน</label>
                                    <select
                                        className="input-field"
                                        value={formData.pay_type}
                                        onChange={e => setFormData({ ...formData, pay_type: e.target.value })}
                                    >
                                        <option value="รายเดือน">รายเดือน</option>
                                        <option value="รายวัน">รายวัน</option>
                                        <option value="รายชิ้น">รายชิ้น (Incentive)</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>อัตราค่าจ้าง (บาท)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="0.00"
                                        value={formData.pay_rate}
                                        onFocus={e => e.target.select()}
                                        onChange={e => setFormData({ ...formData, pay_rate: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>ค่าคอมฯ (%)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="0"
                                        value={formData.incentive_rate}
                                        onFocus={e => e.target.select()}
                                        onChange={e => setFormData({ ...formData, incentive_rate: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>เลขบัตรประชาชน</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="13 หลัก"
                                        value={formData.citizen_id || ''}
                                        onChange={e => setFormData({ ...formData, citizen_id: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>วันเกิด</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.birth_date || ''}
                                        onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>วันที่เริ่มงาน</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.start_date || ''}
                                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>วันที่ลาออก (ถ้ามี)</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.end_date || ''}
                                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="form-grid">
                            {formData.contacts.map((contact, idx) => (
                                <div key={idx} className="relational-card">
                                    <div className="section-header">
                                        <Phone size={18} color="var(--primary-500)" />
                                        <span>ข้อมูลติดต่อ #{idx + 1}</span>
                                        <button className="magic-icon-btn"><Sparkles size={14} /></button>
                                    </div>
                                    <div className="field-row">
                                        <input
                                            className="input-field"
                                            placeholder="ป้ายชื่อ (เช่น เบอร์หลัก)"
                                            value={contact.name || ''}
                                            onChange={e => {
                                                const newContacts = [...formData.contacts];
                                                newContacts[idx].name = e.target.value;
                                                setFormData({ ...formData, contacts: newContacts });
                                            }}
                                        />
                                        <select
                                            className="input-field"
                                            value={contact.contact_type}
                                            onChange={e => {
                                                const newContacts = [...formData.contacts];
                                                newContacts[idx].contact_type = e.target.value;
                                                setFormData({ ...formData, contacts: newContacts });
                                            }}
                                        >
                                            <option value="phone">โทรศัพท์</option>
                                            <option value="line">Line</option>
                                            <option value="email">Email</option>
                                        </select>
                                    </div>
                                    <input
                                        className="input-field"
                                        placeholder="ระบุเบอร์โทร / Line ID / Email"
                                        value={contact.value || ''}
                                        onChange={e => {
                                            const newContacts = [...formData.contacts];
                                            newContacts[idx].value = e.target.value;
                                            setFormData({ ...formData, contacts: newContacts });
                                        }}
                                    />
                                </div>
                            ))}
                            <button className="add-rel-btn" onClick={() => setFormData({ ...formData, contacts: [...formData.contacts, { name: '', contact_type: 'phone', value: '' }] })}>
                                <Plus size={16} /> เพิ่มช่องทางติดต่อ
                            </button>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div className="form-grid">
                            {formData.addresses.map((addr, idx) => (
                                <div key={idx} className="relational-card">
                                    <div className="section-header">
                                        <MapPin size={18} color="var(--primary-500)" />
                                        <span>ข้อมูลที่อยู่ #{idx + 1}</span>
                                        <button className="magic-icon-btn"><Sparkles size={14} /></button>
                                    </div>
                                    <div className="field-row">
                                        <input
                                            className="input-field"
                                            placeholder="ป้ายชื่อ (เช่น ที่อยู่ติดตั้ง)"
                                            value={addr.label || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].label = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                    </div>
                                    <div className="field-row">
                                        <input
                                            className="input-field"
                                            placeholder="ชื่อสถานที่ / หมู่บ้าน (ถ้ามี)"
                                            value={addr.place_name || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].place_name = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                    </div>
                                    <div className="field-row flex-wrap">
                                        <input
                                            className="input-field half"
                                            placeholder="เลขที่"
                                            value={addr.number || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].number = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                        <input
                                            className="input-field half"
                                            placeholder="หมู่ที่"
                                            value={addr.villageno || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].villageno = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                        <input
                                            className="input-field half"
                                            placeholder="ซอย (ถ้ามี)"
                                            value={addr.lane || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].lane = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                        <input
                                            className="input-field half"
                                            placeholder="ถนน"
                                            value={addr.road || ''}
                                            onChange={e => {
                                                const next = [...formData.addresses];
                                                next[idx].road = e.target.value;
                                                setFormData({ ...formData, addresses: next });
                                            }}
                                        />
                                    </div>
                                    <div className="field-row">
                                        <input
                                            className="input-field"
                                            placeholder="ตำบล / อำเภอ / จังหวัด (พิมพ์เพื่อหาที่อยู่)"
                                            onChange={async (e) => {
                                                const val = e.target.value;
                                                if (val.length > 2) {
                                                    // Logic for address simulation or parser integration
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="field-row flex-wrap">
                                        <input className="input-field third" placeholder="ตำบล" value={addr.subdistrict || ''} readOnly />
                                        <input className="input-field third" placeholder="อำเภอ" value={addr.district || ''} readOnly />
                                        <input className="input-field third" placeholder="จังหวัด" value={addr.province || ''} readOnly />
                                    </div>
                                </div>
                            ))}
                            <button className="add-rel-btn" onClick={() => setFormData({ ...formData, addresses: [...formData.addresses, { label: '', is_default: false }] })}>
                                <Plus size={16} /> เพิ่มที่อยู่ใหม่
                            </button>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="form-grid">
                            {formData.bank_accounts.map((bank, idx) => (
                                <div key={idx} className="relational-card">
                                    <div className="section-header">
                                        <CreditCard size={18} color="var(--primary-500)" />
                                        <span>ข้อมูลธนาคาร #{idx + 1}</span>
                                        <button className="magic-icon-btn"><Sparkles size={14} /></button>
                                    </div>
                                    <div className="field-row">
                                        <select
                                            className="input-field"
                                            value={bank.bank_name}
                                            onChange={e => {
                                                const next = [...formData.bank_accounts];
                                                next[idx].bank_name = e.target.value;
                                                setFormData({ ...formData, bank_accounts: next });
                                            }}
                                        >
                                            <option value="KBANK">กสิกรไทย</option>
                                            <option value="SCB">ไทยพาณิชย์</option>
                                            <option value="BBL">กรุงเทพ</option>
                                            <option value="KTB">กรุงไทย</option>
                                            <option value="TTB">ทหารไทยธนชาต</option>
                                        </select>
                                        <input
                                            className="input-field"
                                            placeholder="เลขที่บัญชี (เช่น 123-x-xxxxx-x)"
                                            value={bank.account_number || ''}
                                            onChange={e => {
                                                const next = [...formData.bank_accounts];
                                                next[idx].account_number = e.target.value;
                                                setFormData({ ...formData, bank_accounts: next });
                                            }}
                                        />
                                    </div>
                                    <input
                                        className="input-field"
                                        placeholder="ชื่อเจ้าของบัญชี (เช่น นายปัญญ์ สุขใจ)"
                                        value={bank.account_name || ''}
                                        onChange={e => {
                                            const next = [...formData.bank_accounts];
                                            next[idx].account_name = e.target.value;
                                            setFormData({ ...formData, bank_accounts: next });
                                        }}
                                    />
                                </div>
                            ))}
                            <button className="add-rel-btn" onClick={() => setFormData({ ...formData, bank_accounts: [...formData.bank_accounts, { bank_name: 'KBANK', account_number: '', is_default: false }] })}>
                                <Plus size={16} /> เพิ่มบัญชีธนาคาร
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="secondary-btn" onClick={onClose}>ยกเลิก</button>
                    <button className="primary-btn" onClick={handleSave} disabled={loading}>
                        <Save size={18} />
                        {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </button>
                </div>
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden;
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafafa;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: var(--primary-600);
        }

        .header-title h2 {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          background: #f1f5f9;
          border: none;
          color: #64748b;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
        }

        .modal-tabs {
          display: flex;
          padding: 12px 32px 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 20px;
          overflow-x: auto;
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 4px;
          border: none;
          background: none;
          color: #94a3b8;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-item.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-600);
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Section Header Standard */
        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .section-header span {
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          line-height: 1;
        }

        .magic-icon-btn {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          color: var(--primary-600);
          padding: 4px;
          border-radius: 8px;
          cursor: pointer;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .field-row {
          display: flex;
          gap: 12px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }

        .required {
          color: #ef4444;
        }

        .input-field {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .input-field:focus {
          border-color: var(--primary-400);
          box-shadow: 0 0 0 4px var(--primary-50);
        }

        .relational-card {
          padding: 24px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .add-rel-btn {
          width: 100%;
          padding: 12px;
          background: white;
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          color: #64748b;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-rel-btn:hover {
          border-color: var(--primary-300);
          color: var(--primary-600);
          background: var(--primary-50);
        }

        .modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #fafafa;
        }

        .primary-btn {
          background: var(--primary-600);
          color: white;
          border: none;
          height: 44px;
          padding: 0 24px;
          border-radius: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .secondary-btn {
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;
          height: 44px;
          padding: 0 24px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
