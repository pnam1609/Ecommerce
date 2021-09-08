import * as Types from './../constants/PromotionTypes';

var initialState = []

const promotion = (state = initialState, action) => {
    // var { lineProduct, MA_DSP } = action;

    if (action.type === Types.FETCH_PROMOTION) {
        return [...action.promotion];
    }
    else if (action.type === Types.DELETE_PROMOTION) {
        let index = state.findIndex(x=> x.MA_KM === action.MA_KM);
        state.splice(index, 1);
        return [...state];
    }
    return [...state];
}



export default promotion;