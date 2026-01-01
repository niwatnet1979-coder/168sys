/**
 * Team Manager V1 (168sys)
 * Handles CRUD for Teams with Audit Trail.
 */

import { supabase } from '../supabase'
import { Team } from '../../types/personnel'
import { ApiResponse } from '../../types/index'

/**
 * Fetch all teams
 */
export const getTeams = async (): Promise<ApiResponse<Team[]>> => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return { success: true, data: data as Team[] || [] };
    } catch (error: any) {
        console.error('getTeams Error:', error);
        return { success: false, data: [], error: error.message };
    }
};

/**
 * Save Team
 */
export const saveTeam = async (formData: Team): Promise<ApiResponse<Team>> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        const payload = {
            name: formData.name,
            team_type: formData.team_type,
            payment_qr_url: formData.payment_qr_url,
            status: formData.status || 'active',
            sort_order: formData.sort_order || 0,
            updated_by: userId
        };

        let result;
        if (formData.id) {
            result = await supabase.from('teams').update(payload).eq('id', formData.id).select().single();
        } else {
            result = await supabase.from('teams').insert({ ...payload, created_by: userId }).select().single();
        }

        if (result.error) throw result.error;
        return { success: true, data: result.data as Team };
    } catch (error: any) {
        console.error('saveTeam Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete Team
 */
export const deleteTeam = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const { error } = await supabase.from('teams').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('deleteTeam Error:', error);
        return { success: false, error: error.message };
    }
};
