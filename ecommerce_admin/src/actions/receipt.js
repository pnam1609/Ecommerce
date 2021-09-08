import * as Types from '../constants/ReceiptType';
import callApi from './../utils/apiCaller';
import { actUpdateOrderSupplyRequest } from './orderSupply';
import { getTokenEmployee } from './getNV';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
// var employee = JSON.parse(localStorage.getItem("employee"))


export const actFetchReceiptReq = () => {
    return async (dispatch) => {
        return await callApi('Receipt', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchReceipt(res.data));
        });
    }
}

export const actFetchReceipt = (receipt) => {
    return {
        type: Types.FETCH_RECEIPT,
        receipt
    }
}

export const actAddReceiptRequest = (receipt, history, order) => {
    return async (dispatch) => {
        let res = await callApi('Receipt', 'POST', receipt, `Bearer ${getTokenEmployee()}`).then(res => {
            // console.log(employee)
            // console.log(res.data)

            return res
        });
        if (res.data.result === 1) {
            MySwal.fire({
                icon: 'success',
                title: 'Thêm phiếu nhập thành công',
                showConfirmButton: false,
                timer: 1500
            })
            var orderSupply = {
                ...order,
                TRANGTHAI : 1
            }
            let respone = await dispatch(actUpdateOrderSupplyRequest(orderSupply, history, true));
            if (respone.result === 1) history.goBack()
        }
        else {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: res.data.message
            })
        }
        return res
    }
}