import React, { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    label?: string; // Optional label for future use, essentially unused visually per 'FormInput' style
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', icon: Icon, type = 'text', style, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none z-10 transition-colors group-focus-within:text-primary-500"
                    />
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`input-field w-full transition-all duration-200 ${!props.value ? 'placeholder-faded' : ''} ${className}`}
                    style={{
                        paddingLeft: Icon ? '38px' : '12px',
                        ...style
                    }}
                    {...props}
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
);

Input.displayName = 'Input';
