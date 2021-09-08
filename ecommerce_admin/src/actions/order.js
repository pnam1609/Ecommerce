import * as Types from '../constants/OrderTypes';
import callApi from "../utils/apiCaller";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getNV, getTokenEmployee } from './getNV';
import callApiForPaypal from '../utils/apiCallerPaypal';

const MySwal = withReactContent(Swal)





export const actFetchOrderReq = (status) => {
    return async (dispatch) => {
        return await callApi(`OrderUser?TRANGTHAI=${status}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchOrder(res.data, status));
        });
    }
}

export const actFetchOrder = (orders, status) => {
    if (status === 0) {
        return {
            type: Types.FETCH_ORDER_PENDING,
            orders
        }
    } else if (status === 1) {
        return {
            type: Types.FETCH_ORDER_SHIPPING,
            orders
        }
    }
    else if (status === 2) {
        return {
            type: Types.FETCH_ORDER_SUCCESS,
            orders
        }
    }
    else {
        return {
            type: Types.FETCH_ORDER_CANCEL,
            orders
        }
    }
}

export const actUpdateStatusReq = (itemUpdate, status,history,transactionID) => {
    console.log(itemUpdate)
    
    itemUpdate.MA_NV = getNV(history).actort
    return async (dispatch) => {
        if(itemUpdate.TRANGTHAI === 3){
            dispatch(actRefundPaypal(transactionID))
        }
        return await callApi(`OrderUser`, 'PUT', itemUpdate, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actUpdateStatus(itemUpdate, status))
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

export const actUpdateStatus = (order, status) => {
    return {
        type: Types.UPDATE_STATUS,
        order,
        status
    }

}

export const actRefundPaypal = (transactionID) => {
    return async () => {
        return await callApiForPaypal(`v1/payments/sale/${transactionID}/refund`, "POST", {}, "Bearer A21AAJn-7Lmt4fdgDwKSwb_HlILl8Dx1iwsMIhGsYmAaSS_rObBjTJEu1RmlnAYTDy1L0Xsx1yqncApCTqvoHcleFm2u2-Opg")
    }
}