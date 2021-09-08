import { combineReducers } from 'redux';
import products from './products'
import discounts from './discount'
import cart from './cart'
import brands from './brand'
import order from "./order"
import hotSell from "./hotSell"
import productsByBrand from './productsByBrand'
import newProduct from './newProduct'

const appReducers = combineReducers({
    products,
    discounts,
    cart,
    brands,
    order,
    hotSell,
    productsByBrand,
    newProduct
});

export default appReducers;