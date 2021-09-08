import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ProductItems from './../Product/ProductItems'
import { actFetchNewLineProductReq } from './../../actions/product'

export const Product = ({ newProduct, onFetchNewProduct }) => {
    useEffect(() => {
        async function fetchProduct() {
            await onFetchNewProduct()
        }
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var productList = newProduct.map((pro, index) => {
        return <ProductItems key={index} item={pro} grid={3} /> // grid này để cho product item chia col md to nhỏ
    })


    return (
        <section className="section-request bg padding-y-sm">
            <div className="container">
                <header className="section-heading heading-line">
                    <h4 className="title-section bg text-uppercase">Sản phẩm mới</h4>
                </header>
                <div className="col-md-12">
                    <div className="filters-content">
                        <div className="row grid">
                            {productList}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const mapStateToProps = (state) => ({
    newProduct: state.newProduct,
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchNewProduct: () => {
            dispatch(actFetchNewLineProductReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
