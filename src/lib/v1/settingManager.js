/**
 * Setting Manager (v1.0.0.6)
 * Handles shop configuration and dynamic system options with full audit trail.
 */

import { supabase } from '../supabase'

/**
 * Fetch all system settings and options
 */
export const getSettings = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            console.warn('No active session found in getSettings')
            // return null
        }

        const [settingsResult, optionsResult] = await Promise.all([
            supabase.from('settings').select('*').eq('id', 'default').maybeSingle(),
            supabase.from('system_options_lists').select('*').eq('is_active', true).order('sort_order')
        ])

        if (settingsResult.error) {
            console.error('Settings Fetch Error:', settingsResult.error)
            throw settingsResult.error
        }

        const settings = settingsResult.data
        if (!settings) {
            console.warn('Settings row "default" not found')
            return null
        }

        const optionsList = optionsResult.data || []

        // Group options by category
        const systemOptions = {}
        optionsList.forEach(item => {
            if (!systemOptions[item.category]) {
                systemOptions[item.category] = []
            }
            systemOptions[item.category].push({
                id: item.id,
                value: item.value,
                label: item.label
            })
        })

        return {
            shop: {
                name: settings.name,
                place_name: settings.place_name,
                number: settings.number,
                villageno: settings.villageno,
                village: settings.village,
                soi: settings.soi,
                road: settings.road,
                subdistrict: settings.subdistrict,
                district: settings.district,
                province: settings.province,
                zipcode: settings.zipcode,
                google_map_link: settings.google_map_link,
                phone: settings.phone,
                email: settings.email,
                tax_id: settings.tax_id,
                updated_at: settings.updated_at
            },
            financial: {
                vat_registered: settings.vat_registered,
                vat_rate: settings.vat_rate,
                promptpay_qr: settings.promptpay_qr
            },
            documents: {
                default_terms: settings.default_terms,
                warranty_policy: settings.warranty_policy
            },
            systemOptions
        }
    } catch (error) {
        console.error('Error in getSettings:', error)
        return null
    }
}

/**
 * Save Shop Settings
 */
export const saveShopSettings = async (settingsData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    try {
        const payload = {
            ...settingsData,
            updated_by: user.id,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('settings')
            .upsert({ id: 'default', ...payload })

        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error in saveShopSettings:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Sync System Options (List)
 * Uses a delete-then-insert strategy for a specific category
 */
export const syncSystemOptions = async (category, items) => {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    // Fallback for development if no user found (remove in production)
    // if (!user) throw new Error('Unauthorized')

    try {
        // 1. Delete existing for this category
        const { error: deleteError } = await supabase
            .from('system_options_lists')
            .delete()
            .eq('category', category)

        if (deleteError) throw deleteError

        // 2. Insert new ones
        if (items && items.length > 0) {
            const insertPayload = items.map((item, idx) => ({
                category,
                value: typeof item === 'string' ? item : item.value,
                label: typeof item === 'string' ? item : (item.label || item.value),
                sort_order: idx,
                is_active: true,
                created_by: user.id,
                updated_by: user.id
            }))

            const { error: insertError } = await supabase
                .from('system_options_lists')
                .insert(insertPayload)

            if (insertError) throw insertError
        }

        return { success: true }
    } catch (error) {
        console.error(`Error syncing options for ${category}:`, error)
        return { success: false, error: error.message }
    }
}
