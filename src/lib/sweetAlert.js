import Swal from 'sweetalert2'

// Base configuration to match the centralized design
const baseConfig = {
    customClass: {
        popup: 'rounded-2xl shadow-xl border border-secondary-100',
        confirmButton: 'rounded-lg px-6 py-2.5 font-medium shadow-lg shadow-primary-500/30',
        cancelButton: 'rounded-lg px-6 py-2.5 font-medium',
        title: 'text-secondary-900',
        htmlContainer: 'text-secondary-600'
    },
    buttonsStyling: true, // Use SweetAlert2's styling but applied via classes
    heightAuto: false, // Fix blinking/jumping issue
    scrollbarPadding: false // Fix double padding issue with other modals
}

/**
 * Show a confirmation dialog
 */
export const showConfirm = async (titleOrOptions = 'ยืนยันการดำเนินการ', text = 'คุณต้องการดำเนินการต่อหรือไม่?') => {
    let title = titleOrOptions;
    let icon = 'warning';
    let confirmButtonText = 'ยืนยัน';
    let cancelButtonText = 'ยกเลิก';
    let confirmButtonColor = '#3b82f6';
    let cancelButtonColor = '#ef4444';

    if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
        title = titleOrOptions.title || 'ยืนยันการดำเนินการ';
        text = titleOrOptions.text || 'คุณต้องการดำเนินการต่อหรือไม่?';
        icon = titleOrOptions.icon || 'warning';
        confirmButtonText = titleOrOptions.confirmButtonText || 'ยืนยัน';
        cancelButtonText = titleOrOptions.cancelButtonText || 'ยกเลิก';
        confirmButtonColor = titleOrOptions.confirmButtonColor || '#3b82f6';
        cancelButtonColor = titleOrOptions.cancelButtonColor || '#ef4444';
    } else if (typeof titleOrOptions === 'string') {
        // If it's a string, we treat it as the title and use defaults for the rest
        icon = 'question';
    }

    const result = await Swal.fire({
        ...baseConfig,
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
        cancelButtonText
    });
    return result.isConfirmed;
}

/**
 * Show a success message (auto-close)
 */
export const showSuccess = async (titleOrOptions = 'สำเร็จ', text = 'ดำเนินการเสร็จสิ้น') => {
    let title = titleOrOptions;
    let timer = 1500;

    if (typeof titleOrOptions === 'object') {
        title = titleOrOptions.title || 'สำเร็จ';
        text = titleOrOptions.text || 'ดำเนินการเสร็จสิ้น';
        timer = titleOrOptions.timer || 1500;
    }

    return Swal.fire({
        ...baseConfig,
        icon: 'success',
        title,
        text,
        timer,
        showConfirmButton: false
    })
}

/**
 * Show an error message
 */
export const showError = async (titleOrOptions = 'เกิดข้อผิดพลาด', text = 'ไม่สามารถดำเนินการได้') => {
    let title = titleOrOptions;
    let confirmButtonText = 'ตกลง';

    if (typeof titleOrOptions === 'object') {
        title = titleOrOptions.title || 'เกิดข้อผิดพลาด';
        text = titleOrOptions.text || 'ไม่สามารถดำเนินการได้';
        confirmButtonText = titleOrOptions.confirmButtonText || 'ตกลง';
    }

    return Swal.fire({
        ...baseConfig,
        icon: 'error',
        title,
        text,
        confirmButtonText
    })
}

/**
 * Show a loading spinner (blocking)
 */
export const showLoading = (title = 'กำลังดำเนินการ...', text = 'กรุณารอสักครู่') => {
    Swal.fire({
        ...baseConfig,
        title,
        text,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    })
}

/**
 * Close the currently open SweetAlert2 popup
 */
export const closeSwal = () => {
    Swal.close()
}

export default {
    showConfirm,
    showSuccess,
    showError,
    showLoading,
    closeSwal
}
