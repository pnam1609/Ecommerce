import * as Types from './../constants/CartTypes';

export const actAddToCart = (product,quantity) => {
    return {
        type: Types.ADD_TO_CART,
        product,
        quantity
    }
}

export const actDeleteProductInCart = (MA_SP) => {
    return {
        type : Types.DELETE_PRODUCT_IN_CART,
        MA_SP
    }
}

export const actUpdateProductInCart = (MA_SP, quantity) => {
    return {
        type : Types.UPDATE_PRODUCT_IN_CART,
        MA_SP,
        quantity
    }
}

export const actDelAllCartAfterOrder = ()=>{
    return{
        type: Types.DEL_CART_AFTER_ORDER
    }
}