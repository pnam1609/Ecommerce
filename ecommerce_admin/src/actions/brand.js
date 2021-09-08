import * as Types from './../constants/BrandTypes';
import callApi from './../utils/apiCaller';
import { getTokenEmployee } from './getNV';
// var employee = localStorage.getItem("employee")


export const actFetchBrandsRequest = () => {
    return async (dispatch) => {
        return await callApi('Brand', 'GET', null, null).then(res => {
            dispatch(actFetchBrands(res.data));
        });
    }
}

export const actFetchBrands = (brand) => {
    return {
        type: Types.FETCH_BRAND,
        brand
    }
}



export const actAddBrandRequest = (Brand) => {
    return async (dispatch) => {
        return await callApi('Brand', 'POST', Brand, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}

export const actUpdateBrandRequest = (Brand) => {
    return async (dispatch) => {
        return await callApi(`Brand`, 'PUT', Brand, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}

export const actDeleteBrandRequest = (MA_HANG) => {
    return async (dispatch) => {
        return await callApi(`Brand/${MA_HANG}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                dispatch(actDeleteBrand(MA_HANG));
            }
            return res.data
        });
    }
}
export const actDeleteBrand = (MA_HANG) => {
    return {
        type: Types.DELETE_BRAND,
        MA_HANG
    }
}