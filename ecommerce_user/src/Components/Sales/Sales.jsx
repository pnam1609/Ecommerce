import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actFetchDiscountReq } from '../../actions/discount'
import DiscountItem from './DiscountItem'

export const Sales = ({ discounts, onFetchDiscount }) => {

    useEffect(() => {
        async function fetchProduct() {
            await onFetchDiscount()
        }
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var discountList = discounts.map((discount, index) => {
        if (index < 3) {
            return <DiscountItem key={index} item={discount} />
        } else {
            return null
        }
    })
    // return <div className="item-slide"><img src={discount.HINHANH} alt=""/></div>{discount.HINHANH}d-block w-100 
    var listImgBanner = discounts.map((discount, index) => {
        if (index === 0) {
            return <div key={index} style={{ width: 800, height: 350 }} className="carousel-item  active">
                <img className="img-responsive" src={discount.HINHANH} style={{ marginLeft: 140 }} alt="First slide" />
            </div>
        } else if (index < 3) {
            return <div key={index} style={{ width: 800, height: 350 }} className="carousel-item">
                <img className="img-responsive" src={discount.HINHANH} style={{ marginLeft: 140 }} alt="First slide" />
            </div>
        }
        return null
    })


    return (
        <section className="section-main bg padding-top-sm">
            <div className="container">
                <div className="row">
                    {/* <div className="col-md-9">
                        <div className="owl-init slider-main owl-carousel" data-items="1" data-dots="false" data-nav="true">
                            {listImgBanner}
                        </div>
                    </div> */}
                    <div id="carouselExampleIndicators" className="carousel slide col-md-9" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active bg-dark"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1" className="bg-dark"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2" className="bg-dark"></li>
                        </ol>
                        <div className="carousel-inner">
                            {listImgBanner}
                        </div>
                        <a className="carousel-control-prev link-dark" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon bg-dark" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next " href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span className="carousel-control-next-icon bg-dark" aria-hidden="true"></span>
                            <span className="sr-only text-dark">Next</span>
                        </a>
                    </div>
                    <div className="col-md-3">
                        <h4 className="d-flex justify-content-center">Khuyến mãi</h4>
                        {discountList}
                        {discounts.length === 0 ? "" : <Link to="/discount" type="button" className="btn btn-info" style={{ width: '100%' }}>Xem tất cả</Link>}
                    </div>
                </div>
            </div>
        </section>
    )
}

const mapStateToProps = (state) => ({
    discounts: state.discounts
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchDiscount: () => {
            dispatch(actFetchDiscountReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales)

