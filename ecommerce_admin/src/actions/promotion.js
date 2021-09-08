import * as Types from '../constants/PromotionTypes';
import callApi from './../utils/apiCaller';
// var employee = localStorage.getItem("employee")
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenEmployee } from './getNV';

const MySwal = withReactContent(Swal)

export const actFetchPromotionsRequest = () => {
    return async (dispatch) => {
        return await callApi('/Promotion', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchPromotions(res.data));
        });
    }
}

export const actFetchPromotions = (promotion) => {
    return {
        type: Types.FETCH_PROMOTION,
        promotion
    }
}


export const actAddPromotionRequest = (Promotion, history) => {
    // var manv = getNV(history).actort
    // console.log(manv)
    // var promo = {
    //     ...Promotion,
    //     MA_NV: manv,
    //     NGAYBD: new Date(Promotion.NGAYBD),
    //     NGAYKT: new Date(Promotion.NGAYKT)
    //     // CT_KM: Promotion.CT_KMs
    // }
    return async () => {
        return await callApi('Promotion', 'POST', Promotion, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm khuyến mãi thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                // dispatch(actAddLinePromotion(res.data));
                // Promotion.CT_KMs.forEach(element => {
                //     dispatch(actAddDetailPromotionReq(element))
                // });
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

// export const actAddDetailPromotionReq = (DetailPromotion) => {
//     return async () => {
//         return await callApi('/Promotion', 'POST', DetailPromotion, null).then(res => {

//         });
//     }
// }

export const actUpdatePromotionRequest = (Promotion, history) => {
    return async (dispatch) => {
        return await callApi(`Promotion`, 'PUT', Promotion, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                history.goBack()
                // dispatch(actUpdateLinePromotion(linePromotion));
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

export const actDeletePromotionRequest = (MA_KM) => {
    return async (dispatch) => {
        return await callApi(`/Promotion/${MA_KM}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actDeletePromotion(MA_KM));
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
export const actDeletePromotion = (MA_KM) => {
    return {
        type: Types.DELETE_PROMOTION,
        MA_KM
    }
}

export const actDeleteDetailPromotionReq = (MA_KM, MA_DSP) => {
    return async () => {
        return await callApi(`DetailPromotion?MA_KM=${MA_KM}&MA_DSP=${MA_DSP}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            return res.data
        });
    }
}