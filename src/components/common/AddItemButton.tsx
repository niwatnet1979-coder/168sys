import React from 'react';
import { Plus, LucideIcon } from 'lucide-react';

interface AddItemButtonProps {
    onClick: () => void;
    label: string;
    icon?: LucideIcon;
}

/**
 * AddItemButton - Reusable dashed add button
 * Used in DocumentTab, ContactTab, AddressTab, BankTab, etc.
 * Consistent styling with hover effects.
 */
export default function AddItemButton({
    onClick,
    label,
    icon: Icon = Plus
}: AddItemButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '16px',
                border: '2px dashed #e2e8f0',
                borderRadius: '16px',
                background: 'none',
                color: '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-300)';
                e.currentTarget.style.color = 'var(--primary-600)';
                e.currentTarget.style.background = 'var(--primary-50)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'none';
            }}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}
