/**
 * Customer Manager V1 (168sys)
 * Handles CRUD for Customers with strict relational integrity.
 * Rules applied: No JSON columns, all multi-row data in separate tables.
 */

import { supabase } from '../supabase'
import { Customer, CustomerAddress, CustomerContact, CustomerTaxInvoice } from '../../types/customer'
import { ApiResponse } from '../../types/index'

/**
 * Fetch all customers with their relations
 */
export const getCustomers = async (): Promise<ApiResponse<Customer[]>> => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select(`
                *,
                addresses:customer_addresses(*),
                contacts:customer_contacts(*),
                tax_invoices:customer_tax_invoices(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        // Cast to unknown first if strict typing mismatch on deep relations
        return { success: true, data: data as unknown as Customer[] || [] };
    } catch (error: any) {
        console.error('getCustomers Error:', error);
        return { success: false, data: [], error: error.message };
    }
};

/**
 * Save Customer and all related data in a transaction-like flow
 */
export const saveCustomer = async (formData: Customer): Promise<ApiResponse<Customer>> => {
    try {
        const customerId = formData.id;
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        // 1. Upsert Main Customer Data
        const customerPayload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            line: formData.line,
            facebook: formData.facebook,
            instagram: formData.instagram,
            media: formData.media,
            note: formData.note,
            avatar_url: formData.avatar_url, // Make sure this exists in schema or ignore
            updated_by: userId
        };

        let result;
        if (customerId) {
            result = await supabase.from('customers').update(customerPayload).eq('id', customerId).select().single();
        } else {
            result = await supabase.from('customers').insert({ ...customerPayload, created_by: userId }).select().single();
        }

        if (result.error) throw result.error;
        const savedCustomer = result.data as Customer;
        const newId = savedCustomer.id as string;

        // 2. Handle Related Tables (Simplified: Delete then Insert for this version)
        // Note: Real production apps might want Upsert/Diff for better performance, 
        // but for initial robustness, clean-and-rebuild is safer for complex grids.

        // --- Addresses ---
        if (formData.addresses) {
            await supabase.from('customer_addresses').delete().eq('customer_id', newId);
            const addressPayload = formData.addresses
                .filter(addr => addr.subdistrict || addr.district || addr.province) // Simple validation
                .map(addr => ({
                    customer_id: newId,
                    label: addr.label,
                    place_name: addr.place_name,
                    number: addr.number,
                    villageno: addr.villageno,
                    village: addr.village,
                    lane: addr.lane,
                    road: addr.road,
                    subdistrict: addr.subdistrict,
                    district: addr.district,
                    province: addr.province,
                    zipcode: addr.zipcode,
                    maps: addr.maps,
                    // distance: addr.distance, // Ensure schema supports this or remove
                    is_default: addr.is_default,
                    created_by: userId,
                    updated_by: userId
                }));
            if (addressPayload.length > 0) {
                const { error: ae } = await supabase.from('customer_addresses').insert(addressPayload);
                if (ae) console.error('Address Save Error:', ae);
            }
        }

        // --- Contacts ---
        if (formData.contacts) {
            await supabase.from('customer_contacts').delete().eq('customer_id', newId);
            const contactPayload = formData.contacts
                .filter(c => c.name)
                .map(c => ({
                    customer_id: newId,
                    name: c.name,
                    position: c.position,
                    phone: c.phone,
                    email: c.email,
                    line: c.line,
                    facebook: c.facebook,
                    instagram: c.instagram,
                    note: c.note,
                    created_by: userId,
                    updated_by: userId
                }));
            if (contactPayload.length > 0) {
                const { error: ce } = await supabase.from('customer_contacts').insert(contactPayload);
                if (ce) console.error('Contact Save Error:', ce);
            }
        }

        // --- Tax Invoices ---
        if (formData.tax_invoices) {
            await supabase.from('customer_tax_invoices').delete().eq('customer_id', newId);
            const taxPayload = formData.tax_invoices
                .filter(t => t.company)
                .map(t => ({
                    customer_id: newId,
                    company: t.company,
                    taxid: t.taxid,
                    branch: t.branch,
                    number: t.number,
                    villageno: t.villageno,
                    village: t.village,
                    building: t.building, // Ensure checked in schema? Assuming yes based on migration sql
                    lane: t.lane,
                    road: t.road,
                    subdistrict: t.subdistrict,
                    district: t.district,
                    province: t.province,
                    zipcode: t.zipcode,
                    maps: t.maps,
                    created_by: userId,
                    updated_by: userId
                }));
            if (taxPayload.length > 0) {
                const { error: te } = await supabase.from('customer_tax_invoices').insert(taxPayload);
                if (te) console.error('Tax Invoice Save Error:', te);
            }
        }

        return { success: true, data: savedCustomer };
    } catch (error: any) {
        console.error('saveCustomer Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete Customer (Cascade will handle related tables)
 */
export const deleteCustomer = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('deleteCustomer Error:', error);
        return { success: false, error: error.message };
    }
};
