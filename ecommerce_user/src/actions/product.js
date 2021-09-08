import * as Types from '../constants/ProductTypes';
import callApi from "../utils/apiCaller";

export const actFetchProductsRequest = (keyword) => {
    return async (dispatch) => {
        return await callApi('DisplayLP', 'GET', null, null).then(res => {
            dispatch(actFetchProducts(res.data,keyword));
        });
    }
}

export const actFetchProducts = (product,keyword) => {
    return {
        type: Types.FETCH_PRODUCTS,
        product,
        keyword
    }
}

export const actFetchProductsByBrandReq = (MA_HANG) => {
    return async (dispatch) => {
        return await callApi(`DisplayLP?MA_HANG=${MA_HANG}`, 'GET', null, null).then(res => {
            dispatch(actFetchProductsByBrand(res.data));
        });
    }
}

export const actFetchProductsByBrand = (product,keyword) => {
    return {
        type: Types.FETCH_PRODUCTS_BY_BRAND,
        product
    }
}

export const actFetchNewLineProductReq = () => {
    return async (dispatch) => {
        return await callApi('/newproduct', 'GET', null, null).then(res => {
            dispatch(actFetchNewLineProduct(res.data));
        });
    }
}

export const actFetchNewLineProduct = (newProduct) => {
    return {
        type: Types.FETCH_LINE_PRODUCTS_NEW,
        newProduct
    }
}