import React from 'react'
import { connect } from 'react-redux'
import NumberFormat from 'react-number-format';
import ReactDOM from "react-dom"
import { MONEY_RATE } from '../../constants/Config';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useState } from 'react';
import { actAddOrderReq, actCheckQuantity } from '../../actions/order';
import { useHistory } from 'react-router-dom';
import callApiPaypal from './../../utils/apiCallerPaypal'
import callApiForPaypal from './../../utils/apiCallerPaypal';

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function Total({ cart, onSendFunc, value, onAddOrder,onCheckQuantity }) {
    var hisotry = useHistory()
    const [paypalActions, setPaypalActions] = useState(null) //biến này lưu lại để bật tắt action khi validate
    const [validationMsg, setvalidationMsg] = useState("")

    const MySwal = withReactContent(Swal)
    var totalMoneyInitial = cart.reduce((accumulator, currentValue) => accumulator + currentValue.product.SanPhams.GIA * currentValue.quantity, 0);
    var discountTotal = cart.reduce((accumulator, currentValue) => {
        if (currentValue.product.CT_KM !== null) {
            return accumulator + currentValue.product.SanPhams.GIA * (currentValue.product.CT_KM.PHANTRAMKM / 100) * currentValue.quantity
        }
        else {
            return accumulator
        }
    }, 0);

    const createOrder = (data, actions) => {
        const isValidQuantity = validateAll()
        if (isValidQuantity) {
            const isValid = onSendFunc()
            console.log(isValid)

            if (isValid) {
                paypalActions.enable()
                // createOrder(null,paypalActions)
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: parseFloat((totalMoneyInitial - discountTotal) / MONEY_RATE).toFixed(2)
                            },
                        },
                    ],
                });
            } else {
                paypalActions.disable()
            }
        } else {
            paypalActions.disable()
        }


    };

    function listCTPD(cart) {
        var list = []
        for (let index = 0; index < cart.length; index++) {
            if (cart[index].product.CT_KM !== null) {
                let itemCart = {
                    MA_SP: cart[index].product.SanPhams.MA_SP,
                    SOLUONG: cart[index].quantity,
                    GIA: Math.round(cart[index].product.SanPhams.GIA * (100 - cart[index].product.CT_KM.PHANTRAMKM) / 100)
                }
                list.push(itemCart)
            } else {
                let itemCart = {
                    MA_SP: cart[index].product.SanPhams.MA_SP,
                    SOLUONG: cart[index].quantity,
                    GIA: Math.round(cart[index].product.SanPhams.GIA)
                }
                list.push(itemCart)
            }
        }
        return list
    }

    const onApprove = (data, actions) => {
        actions.order.capture()
            .then(async () => {
                console.log(data)
                let res = await callApiForPaypal("/v1/oauth2/token", "POST")
                if (res !== undefined) {
                    console.log(res);
                    let dataPaypal = await callApiPaypal(`v2/checkout/orders/${data.orderID}`, "GET", null, `Bearer ${res.data.access_token}`)
                    var transactionID = dataPaypal.data.purchase_units[0].payments.captures[0].id
                    console.log(transactionID)
                    setTimeout(() => {
                        onAddOrder(cart, value, hisotry, transactionID)
                    }, 2000);
                }
            })
    };

    const onError = err => {
        MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err
        })
    }

    // function getTransactionID() {
    //     var PAYPAL_OAUTH_API = 'https://api-m.sandbox.paypal.com/v1/oauth2/token/';
    //     var PAYPAL_ORDER_API = 'https://api-m.sandbox.paypal.com/v2/checkout/orders/';

    //     var basicAuth = base64_encode(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_SECRET}`);

    //     callApiPaypal()
    // }

    async function validateAll() {
        var msg = {}

        // sau này cần sửa thêm fetch api ra số lượng tồn để đặt chính xác k gặp trường hợp đặt dư số lượng tồn
        let orderUser = {
            CT_PHIEUDAT: listCTPD(cart)
        }

        let res = await onCheckQuantity(orderUser)
        if(res.result !== 1){
            msg.SOLUONG = res.message
        }

        // cart.forEach(element => {
        //     if (element.quantity > element.product.SanPhams.SOLUONGTON) {
        //         msg.SOLUONG = `Số lượng tồn ${element.TEN} còn ${element.product.SanPhams.SOLUONGTON} Vui lòng đặt ít hơn`
        //         return
        //     }
        // });

        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }


    const onClick = async () => {
        const isValidQuantity = validateAll()
        if (isValidQuantity) {
            const isValid = onSendFunc()
            console.log(isValid)

            if (isValid) {
                paypalActions.enable()
            }
        }
    }
    //hàm khởi tạo
    const onInit = async (data, actions) => {
        actions.disable()//đầu tiên thì disable action payment
        setPaypalActions(actions)//lưu lại biến vì onclick k thể nhận tham số action
    }

    return (
        <aside className="col-sm-3">
            <p className="alert alert-success">Thanh toán đơn hàng trên 100.000đ để được miễn phí giao hàng.</p>
            <dl className="dlist-align">
                <dt>Giá gốc: </dt>
                <dd className="text-right">
                    <NumberFormat value={totalMoneyInitial} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                </dd>
            </dl>
            <dl className="dlist-align">
                <dt>Giảm giá:</dt>
                <dd className="text-right">
                    <NumberFormat value={discountTotal} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                </dd>
            </dl>
            <dl className="dlist-align h4">
                <dt>Tổng: </dt>
                <dd className="text-right"><strong><NumberFormat value={totalMoneyInitial - discountTotal} displayType={'text'} thousandSeparator={true} suffix={'đ'} /></strong></dd>
            </dl>
            <hr />
            <figure className="itemside mb-3">
                <aside className="aside"><img src="images/icons/pay-visa.png" alt="" /></aside>
                <div className="text-wrap small text-muted">
                    Pay 84.78 AED ( Save 14.97 AED ) By using ADCB Cards
                </div>
            </figure>
            <figure className="itemside mb-3">
                <aside className="aside"> <img src="images/icons/pay-mastercard.png" alt="" /> </aside>
                <div className="text-wrap small text-muted">
                    Pay by MasterCard and Save 40%.
                    <br /> Lorem ipsum dolor
                </div>
            </figure>
            <PayPalButton
                onInit={(cart, actions) => onInit(cart, actions)}
                onClick={() => onClick()}
                createOrder={(cart, actions) => createOrder(cart, actions)}
                onApprove={(cart, actions) => onApprove(cart, actions)}
                onError={err => onError(err)}
            />
            <div className="row"><small className="form-text text-danger">{validationMsg.SOLUONG}</small></div>
        </aside>
    )
}



const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddOrder: (cart, value, hisotry, transactionID) => {
            dispatch(actAddOrderReq(cart, value, hisotry, transactionID))
        },
        onCheckQuantity: order => {
            return dispatch(actCheckQuantity(order))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Total)


