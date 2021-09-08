
import * as Types from './../constants/ProductTypes';

var initialState = []

const newProduct = (state = initialState, action) => {
    if (action.type === Types.FETCH_LINE_PRODUCTS_NEW) {
        return [...action.newProduct];
    }
    return [...state];
}



export default newProduct;