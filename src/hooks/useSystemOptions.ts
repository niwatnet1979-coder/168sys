import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';

export interface SystemOption {
    id: string;
    category: string;
    label: string;
    value: string;
}

export const useSystemOptions = (category: string) => {
    const [options, setOptions] = useState<SystemOption[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOptions = async () => {
        try {
            const { data, error } = await supabase
                .from('system_options_lists')
                .select('*')
                .eq('category', category)
                .eq('is_active', true)
                .order('sort_order', { ascending: true })
                .order('label', { ascending: true });

            if (error) {
                console.error('Error fetching options:', error);
                return;
            }

            setOptions(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();

        // Realtime subscription
        const channel = supabase
            .channel(`system_options_${category}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'system_options_lists',
                    filter: `category=eq.${category}`
                },
                () => {
                    fetchOptions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [category]);

    const addOption = async (label: string, value: string) => {
        try {
            // Check if exists
            const existing = options.find(o => o.value === value || o.label === label);
            if (existing) {
                return existing;
            }

            const { data, error } = await supabase
                .from('system_options_lists')
                .insert([
                    { category, label, value }
                ])
                .select()
                .single();

            if (error) throw error;

            await fetchOptions();
            return data;
        } catch (error: any) {
            console.error('Error adding option:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to add option'
            });
            return null;
        }
    };

    return {
        options,
        loading,
        addOption,
        refresh: fetchOptions
    };
};
