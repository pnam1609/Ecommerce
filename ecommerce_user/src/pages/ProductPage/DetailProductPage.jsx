import React from 'react'
import DetailProduct from '../../Components/Product/DetailProduct'
import Header from "./../../Components/Header/Header"
import Footer from "./../../Components/Footer/Footer"

function DetailProductPage({ match }) {
    return (
        <div>
            <Header />
            <DetailProduct match={match} />
            <Footer />
        </div>
    )
}

export default DetailProductPage
