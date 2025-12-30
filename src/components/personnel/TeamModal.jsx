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

/**
 * TeamModal - ฟอร์มจัดการข้อมูลฝ่าย / ทีม
 */
export default function TeamModal({ isOpen, onClose, team, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    team_type: 'ช่าง',
    payment_qr_url: '',
    status: 'active',
    sort_order: 0
  });

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (team) {
      setFormData(team);
      setPreviewUrl(team.payment_qr_url);
    } else {
      setFormData({
        id: null,
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
              <label>ชื่อทีม <span className="required">*</span></label>
              <input
                type="text"
                className="input-field"
                placeholder="เช่น ทีมช่าง A"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>ประเภททีม</label>
                <select
                  className="input-field"
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
                <label>ลำดับการแสดงผล</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.sort_order}
                  onFocus={e => e.target.select()}
                  onChange={e => setFormData({ ...formData, sort_order: e.target.value === '' ? '' : parseInt(e.target.value) })}
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
                    <Upload size={32} />
                    <p>คลิกเพื่อเลือกรูป QR Code</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                      // In a real app, you'd upload here and set the URL
                      setFormData({ ...formData, payment_qr_url: 'https://via.placeholder.com/150' }); // Mock
                    }
                  }}
                />
              </div>
              {previewUrl && (
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
              )}
            </div>
          </div>
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
          font-size: 18px;
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

        .modal-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

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
          gap: 20px;
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

        .qr-section {
          margin-top: 10px;
        }

        .qr-upload-area {
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          background: #f8fafc;
        }

        .qr-upload-area:hover {
          border-color: var(--primary-300);
          background: var(--primary-50);
        }

        .upload-placeholder {
          text-align: center;
          color: #94a3b8;
        }

        .upload-placeholder p {
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        .qr-preview {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .remove-qr-btn {
          margin-top: 8px;
          background: none;
          border: none;
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
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

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
}
