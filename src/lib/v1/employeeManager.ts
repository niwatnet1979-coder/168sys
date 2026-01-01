/**
 * Employee Manager V1 (168sys)
 * Handles CRUD for Employees with detailed relations (Contacts, Addresses, Bank, Docs).
 */

import { supabase } from '../supabase'
import { Employee, EmployeeContactDB, EmployeeAddress, EmployeeBankAccount, EmployeeDocument } from '../../types/personnel'
import { ApiResponse } from '../../types/index'

/**
 * Fetch all employees with their relations
 */
export const getEmployees = async (): Promise<ApiResponse<Employee[]>> => {
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
        return { success: true, data: data as unknown as Employee[] || [] };
    } catch (error: any) {
        console.error('getEmployees Error:', error);
        return { success: false, data: [], error: error.message };
    }
};

/**
 * Save Employee and all related data
 */
export const saveEmployee = async (formData: Employee): Promise<ApiResponse<Employee>> => {
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
            team_id: formData.team_id || null,
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
        // Note: DB Schema expects normalized Key-Value (type + value).
        // The UI should provide an array of EmployeeContactDB objects.
        if (formData.contacts) {
            // Fix: Logic was checking for non-existent .value prop if passed from old broken UI.
            // TypeScript ensures we now match the interface.
            await supabase.from('employee_contacts').delete().eq('employee_id', newId);
            const contactPayload = formData.contacts
                .filter(c => c.value && c.contact_type)
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
                // @ts-ignore
                .filter(a => a.subdistrict || a.province || a.label)
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
            // Don't delete all documents immediately, only sync changes if possible.
            // But this Delete-Insert pattern assumes full replacement.
            // CAUTION: Re-uploading files is expensive/impossible if we don't have the file_obj.
            // Ideally we only insert NEW documents and delete REMOVED ones.
            // But to keep it simple and consistent with other modules for now:

            // Filter out documents that are already uploaded (have URL) and keep them?
            // Actually, we must preserve existing records if we haven't changed them. 
            // Simplified: Delete all metadata rows, re-insert metadata. Files in Storage remain.
            await supabase.from('employee_documents').delete().eq('employee_id', newId);

            const docPayload = [];
            for (const d of formData.documents) {
                let finalUrl = d.file_url;

                // Upload if new file object exists
                if (d.file_obj) {
                    const fileExt = d.file_obj.name.split('.').pop();
                    const fileName = `${newId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('employee_documents')
                        .upload(fileName, d.file_obj);

                    if (uploadError) {
                        console.error('Upload Error:', uploadError);
                        continue;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('employee_documents')
                        .getPublicUrl(fileName);

                    finalUrl = publicUrl;
                }

                if (finalUrl) {
                    docPayload.push({
                        employee_id: newId,
                        doc_type: d.doc_type,
                        file_url: finalUrl,
                        file_name: d.file_name,
                        created_by: userId,
                        updated_by: userId
                    });
                }
            }

            if (docPayload.length > 0) {
                await supabase.from('employee_documents').insert(docPayload);
            }
        }

        return { success: true, data: result.data as Employee };
    } catch (error: any) {
        console.error('saveEmployee Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete Employee
 */
export const deleteEmployee = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('deleteEmployee Error:', error);
        return { success: false, error: error.message };
    }
};
