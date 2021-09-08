import * as Types from './../constants/HotSellTypes';

var initialState = []

const discounts = (state = initialState, action) => {
    if (action.type === Types.FETCH_HOT_SELL) {
        return [...action.hotSell];
    }
    return state;
}

export default discounts