import * as Types from './../constants/CartTypes';
var data = JSON.parse(localStorage.getItem('CART'));
var initialState = data ? data : [];

const cart = (state = initialState, action) => {
    var { product, quantity } = action;
    // console.log(JSON.stringify(state))

    if (action.type === Types.ADD_TO_CART) {
        let index = state.findIndex(x => x.product.SanPhams.MA_SP === product.SanPhams.MA_SP)
        if (index !== -1) {
            state[index].quantity += 1;
        } else {
            state.push({
                product,
                quantity: quantity
            });

        }
        localStorage.setItem('CART', JSON.stringify(state));
        return [...state];
    } else if (action.type === Types.DELETE_PRODUCT_IN_CART) {
        let indexMaSP = state.findIndex(cartItem => cartItem.product.SanPhams.MA_SP === action.MA_SP)
        if (indexMaSP !== -1) {
            state.splice(indexMaSP, 1);
        }
        localStorage.setItem('CART', JSON.stringify(state));
        return [...state];
    } else if (action.type === Types.UPDATE_PRODUCT_IN_CART) {
        let indexMaSP = state.findIndex(cartItem => cartItem.product.SanPhams.MA_SP === action.MA_SP)

        if (indexMaSP !== -1) {
            state[indexMaSP].quantity = parseInt(quantity);
        }
        localStorage.setItem('CART', JSON.stringify(state));
        return [...state];
        
    } else if (action.type === Types.DEL_CART_AFTER_ORDER) {
        return []
    }

    return [...state];
}


export default cart