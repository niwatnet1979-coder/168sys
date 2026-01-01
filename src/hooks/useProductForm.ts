import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';
import { Product, ProductFormData, ProductVariant } from '../types/product';

// Helper to parse codes
const parseCode = (value: string, defaultVal = '') => {
  if (!value) return defaultVal;
  // If value is "GD ทอง", returns "GD"
  const parts = value.split(' ');
  return parts[0] || defaultVal;
};

export const useProductForm = (initialData: Product | null = null) => {
  const [formData, setFormData] = useState<ProductFormData>({
    product_code: '',
    name: '',
    category: '',
    description: '',
    material: '',
    image_url: '',
    variants: []
  });

  const [loading, setLoading] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({
        uuid: initialData.uuid,
        product_code: initialData.product_code || '',
        name: initialData.name || '',
        category: initialData.category || '',
        description: initialData.description || '',
        material: initialData.material || '',
        image_url: initialData.image_url || '',
        variants: initialData.variants || []
      });
    } else {
      setFormData({
        product_code: '',
        name: '',
        category: '',
        description: '',
        material: '',
        image_url: '',
        variants: []
      });
    }
  }, [initialData]);

  // Handle Category Change -> Auto Logic
  const handleCategoryChange = async (categoryInput: string) => {
    if (!categoryInput) return;

    // 1. Extract Prefix & Name
    // Example: "WL โคมไฟกริ่ง"
    const parts = categoryInput.split(' ');
    const prefix = parts[0]; // "WL"
    const baseName = parts.slice(1).join(' '); // "โคมไฟกริ่ง" or rest

    let nextCode = prefix + "001";

    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_code')
        .ilike('product_code', `${prefix}%`)
        .order('product_code', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const lastCode = data[0].product_code;
        // Extract number part
        const numPart = lastCode.replace(prefix, '');
        if (!isNaN(Number(numPart))) {
          const nextNum = parseInt(numPart) + 1;
          nextCode = prefix + nextNum.toString().padStart(3, '0');
        }
      }
    } catch (err) {
      console.error("Error generating code:", err);
    }

    setFormData(prev => ({
      ...prev,
      category: categoryInput,
      product_code: initialData?.product_code || nextCode, // Don't overwrite if editing existing
      name: initialData?.name || baseName // Don't overwrite if editing existing
    }));
  };

  // SKU Generation Logic
  const generateSKU = (variant: ProductVariant, productCode: string) => {
    if (!productCode) return '';

    let sku = productCode;

    // Size
    if (variant.dimensions) {
      const { length = 0, width = 0, height = 0 } = variant.dimensions;
      if (length || width || height) {
        sku += `-L${length}W${width}H${height}`;
      }
    } else if (variant.size) {
      // Fallback if dimensions obj is missing but size string exists
      sku += `-${variant.size}`;
    }

    // Material Color
    const matColorCode = parseCode(variant.color, 'XX');
    sku += `-${matColorCode}`;

    // Crystal Color
    if (variant.crystal_color) {
      const cryColorCode = parseCode(variant.crystal_color);
      if (cryColorCode) {
        sku += `-${cryColorCode}`;
      }
    }

    return sku;
  };

  const saveProduct = async () => {
    setLoading(true);
    try {
      if (!formData.product_code) throw new Error('กรุณาระบุรหัสสินค้า');
      if (!formData.name) throw new Error('กรุณาระบุชื่อสินค้า');

      // Check Unique Code
      const { data: existingProducts, error: checkError } = await supabase
        .from('products')
        .select('uuid')
        .eq('product_code', formData.product_code)
        .neq('uuid', formData.uuid || '00000000-0000-0000-0000-000000000000'); // Exclude current product if editing

      if (checkError) throw checkError;
      if (existingProducts && existingProducts.length > 0) {
        throw new Error(`รหัสสินค้า "${formData.product_code}" มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น`);
      }

      // 1. Prepare Product Payload
      const productPayload: any = {
        product_code: formData.product_code,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        material: formData.material,
        image_url: formData.image_url,
        // Audit Fields
        updated_at: new Date().toISOString(),
        updated_by: 'System' // In real app, get from Auth Context
      };

      let productId = formData.uuid;

      // Upsert Product
      if (!productId) {
        // Create New
        productPayload.created_at = new Date().toISOString();
        productPayload.created_by = 'System';

        const { data, error } = await supabase.from('products').insert(productPayload).select().single();
        if (error) throw error;
        productId = data.uuid;
      } else {
        // Update
        const { error } = await supabase.from('products').update(productPayload).eq('uuid', productId);
        if (error) throw error;
      }

      // 2. Prepare Variants Payload
      if (formData.variants && formData.variants.length > 0) {
        const variantsPayload = formData.variants.map(v => ({
          product_id: productId,
          sku: generateSKU(v, formData.product_code), // Ensure SKU is fresh
          color: v.color,
          crystal_color: v.crystal_color,
          size: v.dimensions ? `L${v.dimensions.length}W${v.dimensions.width}H${v.dimensions.height}` : v.size,
          price: v.price || 0,
          min_stock_level: v.min_stock_level || 0,
          image_url: v.image_url,
          updated_at: new Date().toISOString(),
          updated_by: 'System'
        }));

        // Delete old and Insert new strategy
        const { error: deleteError } = await supabase.from('product_variants').delete().eq('product_id', productId);
        if (deleteError) {
          console.warn("Cannot delete old variants:", deleteError);
          const { error: upsertError } = await supabase.from('product_variants').upsert(variantsPayload, { onConflict: 'sku' });
          if (upsertError) throw upsertError;
        } else {
          const { error: insertError } = await supabase.from('product_variants').insert(variantsPayload);
          if (insertError) throw insertError;
        }
      } else {
        // No variants, ensure cleared
        await supabase.from('product_variants').delete().eq('product_id', productId);
      }

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'ข้อมูลสินค้าถูกบันทึกเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });

      return true;

    } catch (error: any) {
      console.error('Error saving product:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถบันทึกข้อมูลได้'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleCategoryChange,
    generateSKU,
    saveProduct
  };
};
