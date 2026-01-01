import React from 'react';
import { Sparkles, LucideIcon } from 'lucide-react';

interface SectionTitleProps {
    icon: LucideIcon;
    text: string;
    onMagicClick?: () => void;
}

/**
 * Section Title Component
 * Used within modal tabs to display section headers with optional magic paste button.
 */
export default function SectionTitle({ icon: Icon, text, onMagicClick }: SectionTitleProps) {
    return (
        <div className="section-title">
            <Icon size={18} className="text-primary-500" />
            <span className="font-bold text-sm text-gray-600">{text}</span>
            {onMagicClick && (
                <button
                    type="button"
                    className="magic-icon-btn"
                    onClick={onMagicClick}
                    title="วางข้อมูลอัตโนมัติ"
                >
                    <Sparkles size={14} />
                </button>
            )}
        </div>
    );
}
