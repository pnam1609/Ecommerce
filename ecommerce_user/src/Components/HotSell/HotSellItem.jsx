import React from 'react'
import NumberFormat from 'react-number-format'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actAddToCart } from '../../actions/cart'
const MySwal = withReactContent(Swal)

export const HotSellItem = ({ item,onAddToCart }) => {
    let history = useHistory()
    
    function handleAddToCart(item) {
        var user = localStorage.getItem('user')
        if (user != null) {
            if (item.SOLUONGTON <= 0) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Sản phẩm đã hết hàng không thể thêm vào giỏ hàng"
                })
            }
            else {
                onAddToCart(item, 1)
                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm sản phẩm vào giỏ hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } else {
            history.push('/signin')
        }
    }

    return (
        <div className="col-md-4">
            <figure className="card card-product">
                <Link to={`lineproduct/${item.MA_DSP}`} style={{ color: 'black', textDecoration: 'none' }} className="img-wrap"><img src={item.HINHANH} alt="" /></Link>
                <Link to={`lineproduct/${item.MA_DSP}`} style={{ color: 'black', textDecoration: 'none' }} className="info-wrap">
                    <h4 className="title">{item.TEN}</h4>
                    <p className="desc">Xuất xứ:  {item.XUATXU}</p>
                    <p className="desc">Dung tích:  {item.SanPhams.DUNGTICH}ml</p>
                    <p className="desc">Số đã được mua:  {item.SLBAN}</p>
                </Link>
                <div className="bottom-wrap">
                    <button onClick={() => { handleAddToCart(item)}} className="btn btn-sm btn-primary float-right">Thêm vào giỏ hàng</button>
                    <div className="price-wrap h5">
                        <NumberFormat displayType="text" thousandSeparator={true} value={item.CT_KM !== null ? item.SanPhams.GIA * (100 - item.CT_KM.PHANTRAMKM) / 100 : item.SanPhams.GIA} suffix={"đ"} />
                        &nbsp;&nbsp;&nbsp;
                        <del className="price-old"><NumberFormat displayType="text" thousandSeparator={true} value={item.CT_KM !== null ? item.SanPhams.GIA : ""} suffix={"đ"} /></del>

                    </div>
                </div>
            </figure>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddToCart: (product, quantity) => {
            dispatch(actAddToCart(product, quantity))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(HotSellItem)
