import { actDeleteShippingCompanyRequest } from './../../actions/shippingCompany'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const ShippingCompanyItem = ({ item,onDeleteShippingCompanyReq }) => {

    async function deleteShippingCompany(MA_CTVC) {
        var res = await onDeleteShippingCompanyReq(MA_CTVC)
        if (res.result === 1) {
            MySwal.fire({
                icon: 'success',
                title: res.message,
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: res.message
            })
        }
    }

    return (
        <tr>
            <td>{item.MA_CTVC}</td>
            <td>{item.TEN}</td>
            <td>{item.DIACHI}</td>
            <td>{item.SODIENTHOAI}</td>
            <td>{item.EMAIL}</td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => deleteShippingCompany(item.MA_CTVC)}>Xóa</button>
                <Link to={`/editShippingCompany/${item.MA_CTVC}`}>
                    <button type="button" className="btn btn-info" >Sửa</button>
                </Link>
            </td>
        </tr>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onDeleteShippingCompanyReq: (MA_CTVC) => {
            return dispatch(actDeleteShippingCompanyRequest(MA_CTVC))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingCompanyItem)
