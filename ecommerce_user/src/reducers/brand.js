import * as Types from './../constants/BrandTypes';

var initialState = []

const discounts = (state = initialState, action) => {
    if (action.type === Types.FETCH_BRAND) {
        return [...action.brands];
    }
    return state;
}

export default discounts