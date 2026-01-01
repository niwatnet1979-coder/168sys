import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    icon?: LucideIcon;
    label?: string;
}

/**
 * Base Textarea Component
 * Standard textarea with optional icon and consistent styling.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', icon: Icon, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-3 top-3 text-secondary-400 pointer-events-none z-10 transition-colors group-focus-within:text-primary-500"
                    />
                )}
                <textarea
                    ref={ref}
                    className={`input-field w-full resize-none transition-all duration-200 ${!props.value ? 'placeholder-faded' : ''} ${className}`}
                    style={{
                        paddingLeft: Icon ? '38px' : '12px',
                        minHeight: '100px'
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

Textarea.displayName = 'Textarea';
