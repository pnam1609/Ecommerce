import React from 'react'
import NumberFormat from 'react-number-format'
import { Link } from 'react-router-dom'

function DiscountItem({ item }) {
    return (
        <Link to={`/lineproduct/${item.MA_DSP}`} style={{ textDecoration: 'none' }}>
            <div className="card mt-2 mb-2">
                <figure className="itemside">
                    <div className="aside">
                        <div className="img-wrap img-sm border-right"><img src={item.HINHANH} alt="" /></div>
                    </div>
                    <figcaption className="p-3">
                        <h6 className="title">{item.TEN}</h6>
                        <div className="price-wrap">
                            <span className="price-new b">
                                <NumberFormat thousandSeparator={true} displayType={'text'} suffix={'đ'}
                                    value={item.SanPhams.GIA * (100 - item.CT_KM.PHANTRAMKM) / 100} />
                            </span>&nbsp;&nbsp;
                            <del className="price-old text-muted">
                                <NumberFormat thousandSeparator={true} displayType={'text'} suffix={'đ'}
                                    value={item.SanPhams.GIA} />
                            </del>
                        </div>
                        {/* <!-- price-wrap.// --> */}
                    </figcaption>
                </figure>
            </div>
        </Link>
    )
}

export default DiscountItem
