import React, { CSSProperties, ChangeEvent } from 'react';

interface FormTextareaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties;
    minHeight?: string;
}

/**
 * Standard Form Textarea
 * Matches style of FormInput and DynamicSelect.
 */
export default function FormTextarea({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    readOnly = false,
    style,
    minHeight = '48px'
}: FormTextareaProps) {

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="field-group" style={style}>
            {label && (
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <textarea
                    className={`input-field ${!value ? 'placeholder-faded' : ''}`}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{
                        width: '100%',
                        minHeight: minHeight,
                        padding: '12px',
                        resize: 'vertical',
                        lineHeight: '1.5'
                    }}
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
