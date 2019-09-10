import { PENDING } from '@angular/forms/src/model';

export const SAP_CONSTANT = {
    STATUS: {
        CONNECTION_FAIL: {
            CONST: 'SAP_CONNECTION_FAIL',
            DESC: 'ไม่สามารถเชื่อมต่อ SAP ได้'
        },
        SUCCESS: {
            CONST: 'SAP_SUCCESS',
            DESC: 'ส่งสำเร็จ'
        },
        FAIL: {
            CONST: 'SAP_FAIL',
            DESC: 'เกิดข้อผิดพลาด'
        },
        PENDING: {
            DESC: 'รอการส่ง'
        }
    }
};
