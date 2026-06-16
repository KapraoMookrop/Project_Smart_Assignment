import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  success(title: string, message: string = '') {
    return Swal.fire({
      icon: 'success',
      title: title,
      html: message,
      timer: 3000,
      showConfirmButton: false
    });
  }

  error(title: string, message: string = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'ตกลง'
    });
  }

  warning(title: string, message: string = '') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'ตกลง'
    });
  }

  info(title: string, message: string = '', confirmText: string = 'ตกลง') {
    return Swal.fire({
      icon: 'info',
      title: title,
      html: message.replace(/\n/g, '<br>'),
      confirmButtonText: confirmText,
      confirmButtonColor: '#00F2FF',
    });
  }

  confirm(title: string, message: string = '', confirmText: string = 'ยืนยัน', cancelText: string = 'ยกเลิก') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });
  }
}
