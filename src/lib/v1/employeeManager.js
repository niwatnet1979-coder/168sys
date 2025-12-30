/**
 * Employee Manager V1 (168sys)
 * Handles CRUD for Employees with detailed relations (Contacts, Addresses, Bank, Docs).
 */

import { supabase } from '../supabase'

/**
 * Fetch all employees with their relations
 */
export const getEmployees = async () => {
    try {
        const { data, error } = await supabase
            .from('employees')
            .select(`
                *,
                team:teams(name, team_type),
                contacts:employee_contacts(*),
                addresses:employee_addresses(*),
                bank_accounts:employee_bank_accounts(*),
                documents:employee_documents(*)
            `)
            .order('eid', { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('getEmployees Error:', error);
        return { success: false, data: [], error: error.message };
    }
};

/**
 * Save Employee and all related data
 */
export const saveEmployee = async (formData) => {
    try {
        const employeeId = formData.id;
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        // 1. Main Employee Payload
        const payload = {
            eid: formData.eid,
            nickname: formData.nickname,
            first_name: formData.first_name,
            last_name: formData.last_name,
            team_id: formData.team_id,
            job_position: formData.job_position,
            job_level: formData.job_level,
            employment_type: formData.employment_type,
            work_type: formData.work_type,
            pay_type: formData.pay_type,
            pay_rate: formData.pay_rate,
            incentive_rate: formData.incentive_rate,
            citizen_id: formData.citizen_id,
            birth_date: formData.birth_date,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: formData.status || 'current',
            photos: formData.photos || {},
            updated_by: userId
        };

        let result;
        if (employeeId) {
            result = await supabase.from('employees').update(payload).eq('id', employeeId).select().single();
        } else {
            result = await supabase.from('employees').insert({ ...payload, created_by: userId }).select().single();
        }

        if (result.error) throw result.error;
        const newId = result.data.id;

        // Auto-generate EID from UUID suffix if it's a new record
        if (!employeeId) {
            const shortId = newId.substring(newId.length - 6);
            const autoEid = `EP${shortId}`;
            await supabase.from('employees').update({ eid: autoEid }).eq('id', newId);
            result.data.eid = autoEid; // Update return data
        }

        // 2. Handle Related Tables (Delete then Insert)

        // --- Contacts ---
        if (formData.contacts) {
            await supabase.from('employee_contacts').delete().eq('employee_id', newId);
            const contactPayload = formData.contacts
                .filter(c => c.value)
                .map(c => ({
                    employee_id: newId,
                    name: c.name,
                    contact_type: c.contact_type,
                    value: c.value,
                    is_primary: c.is_primary,
                    created_by: userId,
                    updated_by: userId
                }));
            if (contactPayload.length > 0) {
                await supabase.from('employee_contacts').insert(contactPayload);
            }
        }

        // --- Addresses ---
        if (formData.addresses) {
            await supabase.from('employee_addresses').delete().eq('employee_id', newId);
            const addressPayload = formData.addresses
                .filter(a => a.subdistrict || a.province)
                .map(a => ({
                    employee_id: newId,
                    label: a.label,
                    place_name: a.place_name,
                    number: a.number,
                    villageno: a.villageno,
                    village: a.village,
                    lane: a.lane,
                    road: a.road,
                    subdistrict: a.subdistrict,
                    district: a.district,
                    province: a.province,
                    zipcode: a.zipcode,
                    maps: a.maps,
                    is_default: a.is_default,
                    created_by: userId,
                    updated_by: userId
                }));
            if (addressPayload.length > 0) {
                await supabase.from('employee_addresses').insert(addressPayload);
            }
        }

        // --- Bank Accounts ---
        if (formData.bank_accounts) {
            await supabase.from('employee_bank_accounts').delete().eq('employee_id', newId);
            const bankPayload = formData.bank_accounts
                .filter(b => b.account_number)
                .map(b => ({
                    employee_id: newId,
                    bank_name: b.bank_name,
                    account_number: b.account_number,
                    account_name: b.account_name,
                    is_default: b.is_default,
                    created_by: userId,
                    updated_by: userId
                }));
            if (bankPayload.length > 0) {
                await supabase.from('employee_bank_accounts').insert(bankPayload);
            }
        }

        // --- Documents ---
        if (formData.documents) {
            await supabase.from('employee_documents').delete().eq('employee_id', newId);
            const docPayload = formData.documents
                .filter(d => d.file_url)
                .map(d => ({
                    employee_id: newId,
                    doc_type: d.doc_type,
                    file_url: d.file_url,
                    file_name: d.file_name,
                    created_by: userId,
                    updated_by: userId
                }));
            if (docPayload.length > 0) {
                await supabase.from('employee_documents').insert(docPayload);
            }
        }

        return { success: true, data: result.data };
    } catch (error) {
        console.error('saveEmployee Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete Employee
 */
export const deleteEmployee = async (id) => {
    try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('deleteEmployee Error:', error);
        return { success: false, error: error.message };
    }
};
