import * as Types from '../constants/OrderTypes';
import callApi from "../utils/apiCaller";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actDelAllCartAfterOrder } from "./cart";
import { getKh, getTokenUser } from './getUser';

const MySwal = withReactContent(Swal)



function listCTPD(cart) {
    var list = []
    for (let index = 0; index < cart.length; index++) {
        if (cart[index].product.CT_KM !== null) {
            let itemCart = {
                MA_SP: cart[index].product.SanPhams.MA_SP,
                SOLUONG: cart[index].quantity,
                GIA: Math.round(cart[index].product.SanPhams.GIA * (100 - cart[index].product.CT_KM.PHANTRAMKM) / 100)
            }
            list.push(itemCart)
        } else {
            let itemCart = {
                MA_SP: cart[index].product.SanPhams.MA_SP,
                SOLUONG: cart[index].quantity,
                GIA: Math.round(cart[index].product.SanPhams.GIA)
            }
            list.push(itemCart)
        }
    }
    return list
}

export const actAddOrderReq = (cart, value, history,transactionID) => {
    let kh = getKh(history)
    // if (kh == null) {
    //     MySwal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: "Vui lòng đăng nhập để đặt hàng"
    //     })
    //     return
    // }
    // console.log(kh)
    let order = {
        HOTEN: value.name,
        DIACHI: value.address,
        SODIENTHOAI: value.phoneNumber,
        NGAYDAT: new Date(),
        NGAYGIAO: new Date(value.ngaygiao),
        TRANGTHAI: 0,
        GHICHU: value.GHICHU,
        TRANSACTIONID: transactionID,
        MA_KH: kh.actort,
        CT_PHIEUDAT: listCTPD(cart)
    }
    // `Bearer ${kh.token}`
    return async  (dispatch) => {
        return await callApi('OrderUser', 'POST', order, `Bearer ${getTokenUser()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.removeItem('CART')
                history.push('/order')
                dispatch(actDelAllCartAfterOrder())
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
            console.log(res)
        });
    }
}

export const actFetchOrderReq = (status, history) => {
    var kh = getKh(history)
    if(kh != null){
        return async (dispatch) => {
            return await callApi(`OrderUser?MA_KH=${kh.actort}&TRANGTHAI=${status}`, 'GET', null, `Bearer ${getTokenUser()}`).then(res => {
                dispatch(actFetchOrder(res.data, status));
            });
        }
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

export const actUpdateStatusReq = (itemUpdate, status) => {
    return async (dispatch) => {
        return await callApi(`OrderUser`, 'PUT', itemUpdate, `Bearer ${getTokenUser()}`).then(res => {
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

export const actUpdateStatus = (itemUpdate, status) => {
    return {
        type: Types.UPDATE_STATUS,
        order: itemUpdate,
        status
    }

}

export const actCheckQuantity = (order) => {
    return async () => {
        return await callApi(`CheckQuantity`, 'POST', order, `Bearer ${getTokenUser()}`).then(res => {
            return res.data
        });
    }
}