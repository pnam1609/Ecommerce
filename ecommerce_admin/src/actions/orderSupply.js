import * as Types from '../constants/OrderSupplyTypes';
import callApi from './../utils/apiCaller';
import { getTokenEmployee } from './getNV';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export const actFetchOrderSupplysRequest = () => {
    return async (dispatch) => {
        return await callApi('OrderSupply', 'GET', null, `Bearer ${getTokenEmployee()}`)
            .then(res => {
                dispatch(actFetchOrderSupplys(res.data));
            });
    }
}

export const actFetchOrderSupplys = (orderSupply) => {
    return {
        type: Types.FETCH_ORDER_SUPPLY,
        orderSupply
    }
}

export const actAddOrderSupplyRequest = (orderSupply, history) => {
    return async (dispatch) => {
        return await callApi('OrderSupply', 'POST', orderSupply, `Bearer ${getTokenEmployee()}`)
            .then(res => {
                if (res.data.result === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // dispatch(actAddLineorderSupply(res.data));
                    history.goBack()
                }
                else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message
                    })
                }
            });
    }
}

export const actUpdateOrderSupplyRequest = (orderSupply, history, updateStatus) => {
    return async (dispatch) => {
        return await callApi(`OrderSupply?updateStatus=${updateStatus}`, 'PUT', orderSupply, `Bearer ${getTokenEmployee()}`)
            .then(res => {
                if (updateStatus) {
                    dispatch(actUpdatOrderSupply(orderSupply))
                }
                return res.data
            });
    }
}

export const actUpdatOrderSupply = (orderSupply) => {
    return {
        type: Types.UPDATE_ORDER_SUPPLY,
        orderSupply
    }
}

export const actDeleteOrderSupplyRequest = (MA_DDH) => {
    return async (dispatch) => {
        return await callApi(`/OrderSupply/${MA_DDH}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Xóa sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actDeleteOrderSupply(MA_DDH));
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
export const actDeleteOrderSupply = (MA_DDH) => {
    return {
        type: Types.DELETE_ORDER_SUPPLY,
        MA_DDH
    }
}

export const actDeleteDetailOrderSupplyRequest = (MA_DDH, MA_SP) => {
    return async (dispatch) => {
        return await callApi(`OrderSupplyDetail?MA_DDH=${MA_DDH}&MA_SP=${MA_SP}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`)
            .then(res => {
                return res.data
            });
    }
}



export const actAddOrderSupply = (orderSupply) => {
    return {
        type: Types.ADD_ORDER_SUPPLY,
        orderSupply
    }
}