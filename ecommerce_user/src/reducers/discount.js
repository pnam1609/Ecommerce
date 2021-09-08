import * as Types from './../constants/DiscountTypes';

var initialState = []

const discounts = (state = initialState, action) => {
    if (action.type === Types.FETCH_DISCOUNT) {
        return [...action.discounts];
    }
    return state;
}

export default discounts