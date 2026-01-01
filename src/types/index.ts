export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: {
        total?: number;
        page?: number;
        per_page?: number;
        [key: string]: any;
    };
}

export interface SelectOption {
    value: string | number;
    label: string;
    [key: string]: any;
}

export interface BaseEntity {
    id?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
}
