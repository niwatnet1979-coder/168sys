import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

/**
 * Dynamic Select Component
 * Allows searching, selecting, and adding new options on the fly.
 * Adheres to "Ultimate Dropdown Standard" (48px height, Faded Thai Placeholder).
 */
export default function DynamicSelect({ label, value, onChange, options, onAddItem, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options
    const filtered = (options || []).filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        setSearch('');
    };

    const handleAdd = (e) => {
        e.stopPropagation();
        if (search.trim()) {
            onAddItem(search.trim());
            onChange(search.trim()); // Optimistic select
            setIsOpen(false);
            setSearch('');
        }
    };

    // Find label for current value
    const selectedObj = (options || []).find(o => o.value === value);
    const selectedLabel = selectedObj ? selectedObj.label : value;

    return (
        <div className="field-group" ref={wrapperRef} style={{ position: 'relative' }}>
            {label && <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>{label}</label>}
            <div
                className="input-field"
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: '12px',
                    height: '48px', // Standard 48px
                    background: 'white',
                    border: isOpen ? '1px solid var(--primary-500)' : '1px solid var(--border-color)',
                    boxShadow: isOpen ? '0 0 0 4px var(--primary-50)' : 'none',
                    transition: 'all 0.2s',
                    position: 'relative'
                }}
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <input
                    style={{
                        border: 'none', outline: 'none', width: '100%',
                        fontSize: '14px', fontWeight: 600, color: 'var(--text-main)',
                        background: 'transparent',
                        height: '100%',
                        padding: 0,
                        cursor: 'pointer'
                    }}
                    placeholder={!value && !isOpen ? "" : (isOpen ? "ค้นหา..." : (selectedLabel || placeholder))}
                    // Note: Placeholder logic is handled below for faded effect
                    value={isOpen ? search : (selectedLabel || '')}
                    onChange={e => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch('');
                    }}
                    className={!value && !isOpen ? 'placeholder-faded' : ''}
                />
                <ChevronDown size={16} color="#94a3b8" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', flexShrink: 0 }} />

                {/* Visual Placeholder Override for Faded Thai Text */}
                {!value && !isOpen && !search && (
                    <span style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '14px', fontWeight: 500, color: '#94a3b8', opacity: 0.6,
                        pointerEvents: 'none'
                    }}>
                        {placeholder}
                    </span>
                )}
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: 'white', borderRadius: '14px',
                    boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1), 0 8px 16px -4px rgba(0,0,0,0.05)', // Premium Shadow
                    border: '1px solid var(--border-color)',
                    zIndex: 100,
                    maxHeight: '220px', overflowY: 'auto',
                    padding: '8px',
                    animation: 'slideDown 0.2s ease-out'
                }}>
                    {filtered.length > 0 ? (
                        filtered.map((opt, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '10px 14px', borderRadius: '10px',
                                    fontSize: '14px', fontWeight: 500, color: '#334155',
                                    cursor: 'pointer', transition: '0.1s',
                                    background: value === opt.value ? 'var(--primary-50)' : 'transparent',
                                    color: value === opt.value ? 'var(--primary-700)' : '#334155'
                                }}
                                onMouseEnter={e => {
                                    if (value !== opt.value) e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={e => {
                                    if (value !== opt.value) e.currentTarget.style.background = 'transparent';
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(opt.value);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                            ไม่พบข้อมูล "{search}"
                        </div>
                    )}

                    {search.trim() && !filtered.find(f => f.value === search.trim()) && (
                        <button
                            style={{
                                width: '100%', padding: '12px', marginTop: '4px',
                                background: 'var(--primary-50)', color: 'var(--primary-600)',
                                border: '1px dashed var(--primary-200)', borderRadius: '10px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--primary-100)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'var(--primary-50)';
                            }}
                            onClick={handleAdd}
                        >
                            <Plus size={14} />
                            เพิ่ม "{search}" ในระบบ
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
