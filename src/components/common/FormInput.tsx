import React, { CSSProperties, ChangeEvent } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
    label?: string; // Kept for API compatibility, though not used in render based on previous code
    value: string | number | null | undefined;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    icon?: LucideIcon;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties;
}

/**
 * Standard Form Input with Icon
 * Follows .cursorrules: Icon inside (Left 12px), Padding Left 38px, Faded Thai Placeholder.
 */
export default function FormInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    icon: Icon,
    disabled = false,
    readOnly = false,
    style
}: FormInputProps) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="field-group" style={style}>
            {label && (
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
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
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{ paddingLeft: Icon ? '38px' : '12px', width: '100%' }}
                />
            </div>
            <style jsx>{`
                .placeholder-faded::placeholder {
                    color: #94a3b8;
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
}
