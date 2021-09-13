import React from 'react'
import NewProduct from '../../Components/NewProduct/NewProduct';
import Footer from './../../Components/Footer/Footer';
import Header from './../../Components/Header/Header';
import HotSell from './../../Components/HotSell/HotSell'
import Product  from './../../Components/Product/Product';
import Sales from './../../Components/Sales/Sales';
import Subscribe from './../../Components/Subscribe/Subscribe';

function ProductPage() {

    return (
        <div style ={{overflowX: 'hidden'}}>
            <Header />
            <Sales />
            <NewProduct/>
            <HotSell />
            <Product/>
            <Subscribe />
            <Footer />
        </div>
    )
}

export default ProductPage
