import React from 'react';

/**
 * Standard Form Input with Icon
 * Follows .cursorrules: Icon inside (Left 12px), Padding Left 38px, Faded Thai Placeholder.
 */
export default function FormInput({ label, value, onChange, placeholder, type = 'text', icon: Icon, disabled, readOnly, style }) {
    return (
        <div className="field-group" style={{ position: 'relative', ...style }}>
            {Icon && (
                <Icon
                    size={16}
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                />
            )}
            <input
                className={`input-field ${!value ? 'placeholder-faded' : ''}`}
                type={type}
                value={value || ''}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                style={{ paddingLeft: Icon ? '38px' : '12px' }}
            />
            <style jsx>{`
                .placeholder-faded::placeholder {
                    color: #94a3b8;
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
}
