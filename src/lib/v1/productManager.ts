/**
 * Product Manager V1 (168sys)
 * Handles CRUD for Products and ProductVariants.
 */

import { supabase } from '../supabase';
import { Product, ProductVariant } from '../../types/product';
import { ApiResponse } from '../../types/index';

/**
 * Fetch all products with their variants
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(*)
            `)
            .order('name', { ascending: true });

        if (error) throw error;
        // Cast to unknown first if strict typing mismatch on deep relations
        return { success: true, data: data as unknown as Product[] || [] };
    } catch (error: any) {
        console.error('getProducts Error:', error);
        return { success: false, data: [], error: error.message };
    }
};

/**
 * Save Product and all related variants
 */
export const saveProduct = async (formData: Product): Promise<ApiResponse<Product>> => {
    try {
        const productId = formData.id;
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        // 1. Upsert Main Product
        const productPayload = {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            images: formData.images,
            status: formData.status,
            updated_by: userId
        };

        let result;
        if (productId) {
            result = await supabase.from('products').update(productPayload).eq('id', productId).select().single();
        } else {
            result = await supabase.from('products').insert({ ...productPayload, created_by: userId }).select().single();
        }

        if (result.error) throw result.error;
        const savedProduct = result.data as Product;
        const newId = savedProduct.id as string;

        // 2. Handle Variants (Delete then Insert strategy)
        if (formData.variants) {
            // Delete existing variants
            await supabase.from('product_variants').delete().eq('product_id', newId);

            // Prepare new variants
            const variantPayload = formData.variants
                .filter(v => v.sku)
                .map(v => ({
                    product_id: newId,
                    sku: v.sku,
                    name: v.name || `${savedProduct.name} - ${v.sku}`,
                    price: v.price || 0,
                    cost_price: v.cost_price || 0,
                    stock: v.stock || 0,
                    min_stock: v.min_stock || 0,

                    // Attributes
                    material: v.material,
                    material_color: v.material_color,
                    crystal_color: v.crystal_color,
                    light_color: v.light_color,
                    bulb_type: v.bulb_type,
                    remote: v.remote,

                    image_url: v.image_url,
                    status: v.status || 'active',

                    created_by: userId,
                    updated_by: userId
                }));

            if (variantPayload.length > 0) {
                const { error: ve } = await supabase.from('product_variants').insert(variantPayload);
                if (ve) console.error('Variant Save Error:', ve);
            }
        }

        return { success: true, data: savedProduct };
    } catch (error: any) {
        console.error('saveProduct Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete Product (Cascade will handle variants)
 */
export const deleteProduct = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('deleteProduct Error:', error);
        return { success: false, error: error.message };
    }
};
