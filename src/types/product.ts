export interface ProductVariant {
    id?: string;
    product_id?: string;
    sku: string;
    color: string;
    crystal_color?: string;
    size?: string;
    dimensions?: {
        length: number | string;
        width: number | string;
        height: number | string;
    };
    price: number;
    min_stock_level: number;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    uuid: string;
    product_code: string;
    name: string;
    category: string;
    description?: string;
    material?: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
    variants?: ProductVariant[];
}

export interface ProductFormData {
    uuid?: string;
    product_code: string;
    name: string;
    category: string;
    description: string;
    material: string;
    image_url: string;
    variants: ProductVariant[];
}
