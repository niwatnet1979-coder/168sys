import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          variants:product_variants(*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            console.log('Products data from Supabase:', data);
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // Realtime Subscription
        const channel = supabase
            .channel('products-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload) => {
                    // For simplicity in list view, simple refetch is robust
                    fetchProducts();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'product_variants' },
                (payload) => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};
