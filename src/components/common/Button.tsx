import React, { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => {

        let variantClasses = '';
        switch (variant) {
            case 'primary':
                variantClasses = 'button-primary justify-center'; // Global class
                break;
            case 'danger':
                // Inline logic or global if exists. EmployeeModal uses .btn-close (sort of). 
                // Let's stick to a reliable red/danger style if no global class exists.
                variantClasses = 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl font-semibold px-4 py-2 transition-colors';
                break;
            case 'secondary':
            case 'outline':
                variantClasses = 'button-secondary justify-center';
                break;
        }

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={`flex items-center gap-2 h-[48px] ${variantClasses} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                {...props}
            >
                {isLoading && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
