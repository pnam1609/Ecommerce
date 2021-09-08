import * as Types from './../constants/ProductTypes';

var initialState = []

const products = (state = initialState, action) => {
    if (action.type === Types.FETCH_PRODUCTS_BY_BRAND) {
        if(action.product.result === -1){
            return []
        }
        else{
            return [...action.product];
        }
        
    }
    return [...state];
}

export default products