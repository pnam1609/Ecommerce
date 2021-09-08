import * as Types from './../constants/BrandTypes';

var initialState = []

const brand = (state = initialState, action) => {
    if (action.type === Types.FETCH_BRAND) {
        return [...action.brand];
    }
    else if (action.type === Types.DELETE_BRAND) {
        let index = state.findIndex(x=> x.MA_HANG === action.MA_HANG)
        state.splice(index, 1);
        return [...state];
    }
    return [...state];
}


export default brand;