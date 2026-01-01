import { supabase } from './supabase';

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - Storage bucket name (default: 'product-images')
 * @param folder - Optional folder path within the bucket
 * @returns Public URL of the uploaded image
 */
export async function uploadImageToStorage(
    file: File,
    bucket: string = 'product-images',
    folder: string = ''
): Promise<string> {
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomSuffix}.${extension}`;

    // Construct full path
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @param bucket - Storage bucket name
 */
export async function deleteImageFromStorage(
    url: string,
    bucket: string = 'product-images'
): Promise<void> {
    // Extract file path from URL
    const match = url.match(new RegExp(`${bucket}/(.+)$`));
    if (!match) return;

    const filePath = match[1];

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        console.error('Storage delete error:', error);
    }
}

/**
 * Check if URL is a Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
    return url.includes('supabase.co/storage/v1/object/public');
}

/**
 * Check if URL is a temporary blob URL
 */
export function isBlobUrl(url: string): boolean {
    return url.startsWith('blob:');
}
