import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ProductItems from './ProductItems'
import { actFetchProductsRequest } from './../../actions/product'
import { actFetchDiscountReq } from '../../actions/discount'

export const Product = ({ products, onFetchProduct }) => {
    useEffect(() => {
        async function fetchProduct() {
            await onFetchProduct('')
        }
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var productList = products.map((pro, index) => {
        return <ProductItems key={index} item={pro} grid={3} /> // grid này để cho product item chia col md to nhỏ
    })


    return (
        <section className="section-request bg padding-y-sm">
            <div className="container">
                <header className="section-heading heading-line">
                    <h4 className="title-section bg text-uppercase">Tất cả sản phẩm</h4>
                </header>
                <div className="col-md-12">
                    <div className="filters-content">
                        <div className="row grid">
                            {productList}
                        </div>
                    </div>
                </div>
                {/* <!-- row.// --> */}

            </div>
            {/* <!-- container // --> */}
        </section>
    )
}

const mapStateToProps = (state) => ({
    products: state.products,
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchProduct: (keyword) => {
            dispatch(actFetchProductsRequest(keyword))
        },
        onFetchDiscount: () => {
            dispatch(actFetchDiscountReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
