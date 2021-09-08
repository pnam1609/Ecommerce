import React from 'react'
import CartItem from './CartItem'
import { connect } from 'react-redux'
import CheckOut from './CheckOut'

function Cart({ cart }) {
    var listCart = cart.map((item, index) => {
        return <CartItem item={item} key={index} />
    })

    return (
        <>
            <section className="section-content bg padding-y border-top">
                <div className="container">
                    <div className="row">
                        <main className="col-sm-12">
                            <div className="card">
                                <table className="table table-hover shopping-cart-wrap">
                                    <thead className="text-muted">
                                        <tr>
                                            <th scope="col-md-6">Sản phẩm</th>
                                            <th scope="col-md-2" width="120">Số lượng</th>
                                            <th scope="col-md-2" width="120">Giá</th>
                                            <th scope="col-md-2" className="text-right" width="200">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.length !== 0 ? listCart : <tr><td>Không có sản phẩm nào trong giỏ hàng</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </main>
                       
                    </div>

                </div>
            </section>
            <CheckOut cart = {cart}/>
        </>
    )
}
const mapStateToProps = (state) => ({
    cart: state.cart
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
