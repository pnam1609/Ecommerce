import * as Types from '../constants/InvoiceTypes';
import callApi from './../utils/apiCaller';
// var employee = localStorage.getItem("employee")
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actUpdateStatusReq } from './order';
import { getTokenEmployee } from './getNV';

const MySwal = withReactContent(Swal)

export const actFetchInvoiceReq = () => {
    return async (dispatch) => {
        return await callApi('Invoice', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            console.log(res.data)
            dispatch(actFetchInvoice(res.data));
        });
    }
}

export const actFetchInvoice = (invoice) => {
    return {
        type: Types.FETCH_INVOICE,
        invoice
    }
}

export const actAddInvoiceRequest = (invoice, history) => {
    return async (dispatch) => {
        return await callApi('/Invoice', 'POST', invoice, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                var orderUpdateStatus = {
                    ID_PHIEUDAT: invoice.ID_PHIEUDAT,
                    TRANGTHAI: 1,//1 hash code vì act req này chỉ dùng cho add hóa đơn từ lúc nó status = 0 => 1
                    MA_NV: invoice.MA_NV
                }
                dispatch(actUpdateStatusReq(orderUpdateStatus, 1, history))
                history.push("/order")
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        });
    }
}
