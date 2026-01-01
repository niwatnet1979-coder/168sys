import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

// Base configuration to match the centralized design
const baseConfig: SweetAlertOptions = {
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

interface ConfirmOptions {
    title?: string;
    text?: string;
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
}

/**
 * Show a confirmation dialog
 */
export const showConfirm = async (titleOrOptions: string | ConfirmOptions = 'ยืนยันการดำเนินการ', text: string = 'คุณต้องการดำเนินการต่อหรือไม่?'): Promise<boolean> => {
    let title = typeof titleOrOptions === 'string' ? titleOrOptions : 'ยืนยันการดำเนินการ';
    let icon: ConfirmOptions['icon'] = 'warning';
    let confirmButtonText = 'ยืนยัน';
    let cancelButtonText = 'ยกเลิก';
    let confirmButtonColor = '#3b82f6';
    let cancelButtonColor = '#ef4444';

    if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
        title = titleOrOptions.title || title;
        text = titleOrOptions.text || text;
        icon = titleOrOptions.icon || icon;
        confirmButtonText = titleOrOptions.confirmButtonText || confirmButtonText;
        cancelButtonText = titleOrOptions.cancelButtonText || cancelButtonText;
        confirmButtonColor = titleOrOptions.confirmButtonColor || confirmButtonColor;
        cancelButtonColor = titleOrOptions.cancelButtonColor || cancelButtonColor;
    } else if (typeof titleOrOptions === 'string') {
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

interface SuccessOptions {
    title?: string;
    text?: string;
    timer?: number;
}

/**
 * Show a success message (auto-close)
 */
export const showSuccess = async (titleOrOptions: string | SuccessOptions = 'สำเร็จ', text: string = 'ดำเนินการเสร็จสิ้น'): Promise<SweetAlertResult> => {
    let title = typeof titleOrOptions === 'string' ? titleOrOptions : 'สำเร็จ';
    let timer = 1500;

    if (typeof titleOrOptions === 'object') {
        title = titleOrOptions.title || title;
        text = titleOrOptions.text || text;
        timer = titleOrOptions.timer || timer;
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

interface ErrorOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
}

/**
 * Show an error message
 */
export const showError = async (titleOrOptions: string | ErrorOptions = 'เกิดข้อผิดพลาด', text: string = 'ไม่สามารถดำเนินการได้'): Promise<SweetAlertResult> => {
    let title = typeof titleOrOptions === 'string' ? titleOrOptions : 'เกิดข้อผิดพลาด';
    let confirmButtonText = 'ตกลง';

    if (typeof titleOrOptions === 'object') {
        title = titleOrOptions.title || title;
        text = titleOrOptions.text || text;
        confirmButtonText = titleOrOptions.confirmButtonText || confirmButtonText;
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
export const showLoading = (title: string = 'กำลังดำเนินการ...', text: string = 'กรุณารอสักครู่'): void => {
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
export const closeSwal = (): void => {
    Swal.close()
}

export default {
    showConfirm,
    showSuccess,
    showError,
    showLoading,
    closeSwal
}
