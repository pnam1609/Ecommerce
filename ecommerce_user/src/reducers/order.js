import * as Types from './../constants/OrderTypes';

var initialState = {
    pending : [],
    shipping: [],
    success : [],
    cancel: []
}

const order = (state = initialState, action) => {
    if (action.type === Types.FETCH_ORDER_PENDING) {
        state.pending = action.orders
        return {...state};
    }
    else if (action.type === Types.FETCH_ORDER_SHIPPING) {
        state.shipping = action.orders
        return {...state};
    }
    else if (action.type === Types.FETCH_ORDER_SUCCESS) {
        state.success = action.orders
        return {...state};
    }
    else if (action.type === Types.FETCH_ORDER_CANCEL) {
        state.cancel = action.orders
        return {...state};
    }
    else if(action.type === Types.UPDATE_STATUS){
        if(action.status === 0){
            let index = state.pending.findIndex(order => order.ID_PHIEUDAT === action.order.ID_PHIEUDAT)
            state.pending.splice(index,1)
        }
        return {...state}
    }
    return state;
}

export default order