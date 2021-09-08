import * as Types from '../constants/ShipperTypes';
import callApi from '../utils/apiCaller';
import { getTokenEmployee } from './getNV';
// var employee = localStorage.getItem("employee")


export const actFetchshipperReq = () => {
    return async (dispatch) => {
        return await callApi('Shipper', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchshipper(res.data));
        });
    }
}

export const actFetchshipper = (shipper) => {
    return {
        type: Types.FETCH_SHIPPER,
        shipper
    }
}


export const actAddShipperRequest = (Shipper) => {
    return async () => {
        return await callApi('Shipper', 'POST', Shipper, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}

export const actUpdateShipperRequest = (Shipper, history) => {
    return async () => {
        return await callApi(`Shipper`, 'PUT', Shipper, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}

export const actDeleteShipperRequest = (MA_NVGH) => {
    return async (dispatch) => {
        return await callApi(`Shipper/${MA_NVGH}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                dispatch(actDeleteShipper(MA_NVGH));
            }
            return res.data
        });
    }
}
export const actDeleteShipper = (MA_NVGH) => {
    return {
        type: Types.DELETE_SHIPPER,
        MA_NVGH
    }
}