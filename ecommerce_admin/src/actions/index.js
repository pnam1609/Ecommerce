import * as Types from './../constants/LineProductTypes';
import callApi from './../utils/apiCaller';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actPutPostChangePrice } from './changePrice';
import { getTokenEmployee } from './getNV';

const MySwal = withReactContent(Swal)

export const actFetchLineProductsRequest = () => {
    return async (dispatch) => {
        return await callApi('LinePerfume', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchLineProducts(res.data));
        });
    }
}

export const actFetchLineProducts = (lineProduct) => {
    return {
        type: Types.FETCH_LINE_PRODUCTS,
        lineProduct
    }
}

export const actAddLineProductRequest = (lineProduct, history) => {
    return async (dispatch) => {
        return await callApi('LinePerfume', 'POST', lineProduct, `Bearer ${getTokenEmployee()}`).then(res => {
            // console.log(employee)
            console.log(res.data)
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm dòng sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                lineProduct.SanPhams.forEach(element => {
                    dispatch(actPutPostChangePrice(element.THAYDOIGIAs))
                });
                // dispatch(actAddLineProduct(res.data));
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

export const actUpdateLineProductRequest = (lineProduct, history) => {
    return async (dispatch) => {
        return await callApi(`LinePerfume`, 'PUT', lineProduct, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Sửa dòng sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                lineProduct.SanPhams.forEach(element => {
                    dispatch(actPutPostChangePrice(element.THAYDOIGIAs))
                });
                history.goBack()
                // dispatch(actUpdateLineProduct(lineProduct));
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

export const actDeleteLineProductRequest = (MA_DSP) => {
    return (dispatch) => {
        return callApi(`/LinePerfume/${MA_DSP}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Xóa dòng sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actDeleteLineProduct(MA_DSP));
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
export const actDeleteLineProduct = (MA_DSP) => {
    return {
        type: Types.DELETE_LINE_PRODUCT,
        MA_DSP
    }
}

export const actDeleteProductRequest = (MA_SP) => {
    return async () => {
        return await callApi(`Perfume/${MA_SP}`, 'DELETE', MA_SP, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}


export const actAddLineProduct = (lineProduct) => {
    return {
        type: Types.ADD_LINE_PRODUCT,
        lineProduct
    }
}

export const actUpdateLineProduct = (lineProduct) => {
    console.log(lineProduct)
    return {
        type: Types.UPDATE_LINE_PRODUCT,
        lineProduct
    }
}

