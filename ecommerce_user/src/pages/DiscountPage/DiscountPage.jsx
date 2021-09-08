import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ProductItems from './../../Components/Product/ProductItems'
import { actFetchDiscountReq } from './../../actions/discount'
import Header from "./../../Components/Header/Header"
import Footer from "./../../Components/Footer/Footer"
import { useRouteMatch } from 'react-router-dom'
import { actFetchProductsByBrandReq } from '../../actions/product'

export const DiscountPage = ({ discount, onFetchDiscount, onFetchProductByBrand, productsByBrand }) => {
    var match = useRouteMatch()
    useEffect(() => {
        if (Object.keys(match.params).length === 0) {
            (async () => {
                await onFetchDiscount()
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        (async () => {
            await onFetchProductByBrand(match.params.id)
        })()// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match.params.id])

    function renderPage() {
        if (Object.keys(match.params).length === 0) {
            return discount.map((pro, index) => {
                return <ProductItems key={index} item={pro} grid={3} /> // grid này để cho product item chia col md to nhỏ
            })
        }
        else {
            if (productsByBrand.length !== 0) {
                return productsByBrand.map((pro, index) => {
                    return <ProductItems key={index} item={pro} grid={3} /> // grid này để cho product item chia col md to nhỏ
                })
            } else {
                return <h3>Hãng này chưa tồn tại sản phẩm</h3>
            }
        }
    }




    return (
        <>
            <Header />
            <section className="section-request bg padding-y-sm">
                <div className="container">
                    <header className="section-heading heading-line">
                        <h4 className="title-section bg text-uppercase">Các sản phẩm khuyến mãi</h4>
                    </header>
                    <div className="col-md-12">
                        <div className="filters-content">
                            <div className="row grid">
                                {renderPage()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

const mapStateToProps = (state) => ({
    discount: state.discounts,
    productsByBrand: state.productsByBrand
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchDiscount: () => {
            dispatch(actFetchDiscountReq())
        },
        onFetchProductByBrand: (MA_HANG) => {
            dispatch(actFetchProductsByBrandReq(MA_HANG))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscountPage)
