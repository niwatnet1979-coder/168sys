import React, { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { parseUniversalAddress } from '../../lib/v1/addressParser'

const MagicPasteModal = ({ isOpen, onClose, onParse }) => {
    const [text, setText] = useState('')

    if (!isOpen) return null

    const handleParse = () => {
        if (!text.trim()) return
        const result = parseUniversalAddress(text)
        onParse(result)
        setText('')
        onClose()
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s ease-out'
            }}>
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--primary-50)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} style={{ color: 'var(--primary-600)' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--primary-900)' }}>
                            ระบบกรอกข้อมูลอัตโนมัติ
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '6px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#64748b'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                        วางข้อความที่อยู่ เบอร์โทร หรือแชทลูกค้าที่นี่ ระบบจะแยกข้อมูลให้โดยอัตโนมัติ ✨
                    </p>
                    <textarea
                        style={{
                            width: '100%',
                            height: '160px',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            resize: 'none',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-400)'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="วางข้อความที่นี่..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            cursor: 'pointer'
                        }}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleParse}
                        style={{
                            padding: '10px 20px',
                            background: 'var(--primary-600)',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Sparkles size={16} />
                        แยกข้อมูลอัตโนมัติ
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MagicPasteModal
