/**
 * 168sys Standard Formatters (v1)
 * บังคับใช้ตามกฏใน .cursorrules
 */

/**
 * ฟอร์แมตจำนวนเงินเป็นรูปแบบไทย (฿.00)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * ฟอร์แมตวันที่เป็นรูปแบบ DD/MM/YYYY HH:mm
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
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
 * @param {any} error 
 * @returns {string}
 */
export const getErrorMessage = (error) => {
    console.error("System Error:", error);
    return error?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";
};
