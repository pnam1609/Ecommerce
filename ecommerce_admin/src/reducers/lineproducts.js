import * as Types from './../constants/LineProductTypes';

var initialState = []

const lineProducts = (state = initialState, action) => {
    // var { lineProduct, MA_DSP } = action;
    
    if (action.type === Types.FETCH_LINE_PRODUCTS) {
        return [...action.lineProduct];
    }
    // else if (action.type === Types.ADD_LINE_PRODUCT) {
    //     state.push(lineProduct);
    //     return [...state];
    // }
    // else if (action.type === Types.UPDATE_LINE_PRODUCT) {
    //     console.log(action)
    //     let index = findIndex(state, action.lineProduct.MA_DSP);
    //     console.log(state[index])
    //     console.log(lineProduct)
    //     console.log(state)
    //     // state[index].TEN = lineProduct.TEN;
    //     // state[index].XUATXU = lineProduct.XUATXU;
    //     // state[index].MA_HANG = lineProduct.MA_HANG;
    //     // state[index].GIOITINH = lineProduct.GIOITINH;
    //     // state[index].MOTA = lineProduct.MOTA;
    //     // state[index].HINHANH = lineProduct.HINHANH;
    //     // state[index].DOLUUHUONG = lineProduct.DOLUUHUONG;
    //     // state[index].TENHANG = lineProduct.TENHANG;   
    //     return [...state];
    // }
    else if (action.type === Types.DELETE_LINE_PRODUCT) {
        let index = findIndex(state, action.MA_DSP);
        state.splice(index, 1);
        return [...state];
    }
    return [...state];
}

var findIndex = (products, id) => {
    var result = -1;
    products.forEach((product, index) => {
        if (product.MA_DSP.trim() === id.trim()) {
            result = index;
        }
    });
    return result;
}


export default lineProducts;