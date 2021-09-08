import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actDeleteBrandRequest } from '../../actions/brand'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const BrandItem = ({ item,onDeleteBrandReq }) => {

    async function deleteBrand(MA_HANG) {
        var res = await onDeleteBrandReq(MA_HANG)
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
            <td>{item.MA_HANG}</td>
            <td>{item.TENHANG}</td>
            <td>{item.DIACHI}</td>
            <td>{item.SODIENTHOAI}</td>
            <td>{item.EMAIL}</td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => deleteBrand(item.MA_HANG)}>Xóa</button>
                <Link to={`/editBrand/${item.MA_HANG}`}>
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
        onDeleteBrandReq: (MA_HANG) => {
            return dispatch(actDeleteBrandRequest(MA_HANG))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandItem)
