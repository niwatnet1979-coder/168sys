import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Users2,
  Sparkles,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { saveTeam } from '../../lib/v1/teamManager';
import { showError, showSuccess } from '../../lib/sweetAlert';
import FormInput from '../common/FormInput';
import { Team } from '../../types/personnel';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onSaveSuccess: () => void;
}

export default function TeamModal({ isOpen, onClose, team, onSaveSuccess }: TeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Team>({
    id: undefined,
    name: '',
    team_type: 'ช่าง',
    payment_qr_url: '',
    status: 'active',
    sort_order: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      setFormData(team);
      setPreviewUrl(team.payment_qr_url || null);
    } else {
      setFormData({
        id: undefined,
        name: '',
        team_type: 'ช่าง',
        payment_qr_url: '',
        status: 'active',
        sort_order: 0
      });
      setPreviewUrl(null);
    }
  }, [team]);

  const handleSave = async () => {
    if (!formData.name) return showError('กรุณาระบุชื่อทีม');
    setLoading(true);
    const res = await saveTeam(formData);
    if (res.success) {
      showSuccess(formData.id ? 'แก้ไขข้อมูลทีมสำเร็จ' : 'สร้างทีมใหม่สำเร็จ');
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
            <Users2 size={20} className="header-icon" />
            <h2>{formData.id ? 'แก้ไขข้อมูลทีม' : 'สร้างทีมใหม่'}</h2>
          </div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-grid">
            <div className="section-header">
              <Users2 size={18} color="var(--primary-500)" />
              <span>ข้อมูลทีม</span>
              <button className="magic-icon-btn"><Sparkles size={14} /></button>
            </div>

            <div className="input-group">
              <FormInput
                label="ชื่อทีม (Required *)"
                placeholder="ระบุชื่อทีม (เช่น ทีมช่าง A)"
                value={formData.name}
                onChange={v => setFormData({ ...formData, name: v })}
                icon={Users2}
              />
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>ประเภททีม</label>
                <select
                  className="select-field"
                  value={formData.team_type}
                  onChange={e => setFormData({ ...formData, team_type: e.target.value })}
                >
                  <option value="ช่าง">ช่าง</option>
                  <option value="QC">QC</option>
                  <option value="SALE">SALE</option>
                  <option value="บริหาร">บริหาร</option>
                </select>
              </div>
              <div className="input-group">
                <FormInput
                  label="ลำดับการแสดงผล"
                  type="number"
                  placeholder="0"
                  value={formData.sort_order}
                  onChange={v => setFormData({ ...formData, sort_order: v === '' ? 0 : parseInt(v) })}
                />
              </div>
            </div>

            <div className="qr-section">
              <div className="section-header">
                <ImageIcon size={18} color="var(--primary-500)" />
                <span>QR Code รับเงิน</span>
              </div>
              <div
                className="qr-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="QR Preview" className="qr-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={48} color="var(--text-muted)" strokeWidth={1.5} />
                    <span className="placeholder-title">อัปโหลด QR Code</span>
                    <span className="placeholder-desc">รองรับไฟล์ JPG, PNG</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                      // In a real app, you'd upload here and set the URL
                      setFormData({ ...formData, payment_qr_url: 'https://via.placeholder.com/150' }); // Mock
                    }
                  }}
                />
              </div>
              {previewUrl && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    className="remove-qr-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                      setFormData({ ...formData, payment_qr_url: '' });
                    }}
                  >
                    <Trash2 size={14} /> ลบรูปภาพ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>ยกเลิก</button>
          <button className="button-primary" onClick={handleSave} disabled={loading}>
            <Save size={18} />
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
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
          max-width: 560px; /* Slightly more compact */
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: var(--primary-600);
          background: var(--primary-50);
          padding: 6px;
          border-radius: 10px;
          box-sizing: content-box;
        }

        .header-title h2 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #ef4444;
        }

        .modal-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px; /* Rule #77: 12px gap */
        }

        .section-header span {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          line-height: 1;
        }

        .magic-icon-btn {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          color: var(--primary-600);
          padding: 4px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          margin-left: 4px;
        }

        .required {
          color: #ef4444;
          margin-left: 2px;
        }

        /* QR Section */
        .qr-section {
          margin-top: 8px;
        }

        .qr-upload-area {
          border: 2px dashed #e2e8f0;
          border-radius: 20px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          background: #f8fafc;
          position: relative;
        }

        .qr-upload-area:hover {
          border-color: var(--primary-400);
          background: var(--primary-50);
          transform: translateY(-2px);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .placeholder-title {
          font-size: 14px;
          font-weight: 700;
          color: #475569;
        }
        
        .placeholder-desc {
          font-size: 12px;
          color: #94a3b8;
        }

        .qr-preview {
          height: 100%;
          width: 100%;
          object-fit: contain;
          padding: 16px;
        }

        .remove-qr-btn {
          margin-top: 12px;
          background: white;
          border: 1px solid #fee2e2;
          color: #ef4444;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: var(--shadow-sm);
        }
        
        .remove-qr-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: white;
        }

        /* 48px Height Rule */
        .secondary-btn {
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;
          height: 48px;
          padding: 0 24px;
          border-radius: 12px; /* radius-lg */
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }
        
        .hidden { display: none; }
      `}</style>
    </div>
  );
}
