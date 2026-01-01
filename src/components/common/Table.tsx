import React from 'react';
import { Package } from 'lucide-react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export function TableContainer({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    return (
        <div className={`table-container ${className}`} style={style}>
            <div style={{ overflowX: 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export function Table({ children, className = '', style = {} }: TableProps) {
    return (
        <table className={`table-standard ${className}`} style={style}>
            {children}
        </table>
    );
}

export function Thead({ children, className = '', style = {} }: React.HTMLAttributes<HTMLSectionElement>) {
    return <thead className={className} style={style}>{children}</thead>;
}

export function Tbody({ children, className = '', style = {} }: React.HTMLAttributes<HTMLSectionElement>) {
    return <tbody className={className} style={style}>{children}</tbody>;
}

export function Tr({ children, className = '', style = {}, onClick }: React.HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={className} style={style} onClick={onClick}>{children}</tr>;
}

export function Th({ children, className = '', style = {}, align = 'left' }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
    return <th className={className} style={{ textAlign: align, ...style }}>{children}</th>;
}

export function Td({ children, className = '', style = {}, align = 'left', colSpan }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={className} style={{ textAlign: align, ...style }} colSpan={colSpan}>{children}</td>;
}

export function TableEmptyState({ title = "ไม่พบข้อมูล", message = "ยังไม่มีข้อมูลในระบบ", icon: Icon = Package }: { title?: string, message?: string, icon?: React.ElementType }) {
    return (
        <tr>
            <td colSpan={100} style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
                    <div style={{
                        padding: '16px',
                        background: 'var(--bg-main)',
                        borderRadius: '50%',
                        opacity: 0.8
                    }}>
                        <Icon size={40} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-main)' }}>{title}</div>
                        <div style={{ fontSize: '14px' }}>{message}</div>
                    </div>
                </div>
            </td>
        </tr>
    );
}
