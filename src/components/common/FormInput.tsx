import React, { CSSProperties, ChangeEvent } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
    label?: string;
    value: string | number | null | undefined;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties;
    // Icon prop is removed as requested, but kept optional in interface to prevent breaking existing usages until refactored
    icon?: LucideIcon;
}

/**
 * Standard Form Input (No Icon)
 * Follows .cursorrules: Padding Left 12px, Faded Thai Placeholder.
 */
export default function FormInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
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
                <input
                    className={`input-field ${!value ? 'placeholder-faded' : ''}`}
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{ paddingLeft: '12px', width: '100%' }}
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
