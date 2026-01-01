/**
 * 168sys Standard Formatters (v1)
 * บังคับใช้ตามกฏใน .cursorrules
 */

/**
 * ฟอร์แมตจำนวนเงินเป็นรูปแบบไทย (฿.00)
 * @param amount - จำนวนเงิน
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * ฟอร์แมตวันที่เป็นรูปแบบ DD/MM/YYYY HH:mm
 * @param date - Date object or date string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '-';
    // If it's a string, ensure it's parseable or handle specific formats if needed.
    // Assuming standard ISO strings or valid date strings.
    const d = new Date(date);

    // Check if date is valid
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

/**
 * จัดการ Error Messaging ภาษาไทย
 * @param error - Error object or any error
 * @returns Error message string
 */
export const getErrorMessage = (error: any): string => {
    console.error("System Error:", error);
    return error?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";
};
