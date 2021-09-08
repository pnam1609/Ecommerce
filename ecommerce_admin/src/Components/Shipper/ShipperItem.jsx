import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actDeleteShipperRequest } from '../../actions/shipper';
import { formatDate } from '../../utils/formatDate';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export const ShipperItem = ({ item, onDeleteShipper }) => {

    async function deleteShipper(MA_NVGH) {
        let res = await onDeleteShipper(MA_NVGH)
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
            <td>{item.MA_NVGH}</td>
            <td>{item.HOTEN}</td>
            <td>{formatDate(new Date(item.NGAYSINH))}</td>
            <td>{item.SODIENTHOAI}</td>
            <td>{item.EMAIL}</td>
            <td>{item.MA_CTVC}</td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => deleteShipper(item.MA_NVGH)}>Xóa</button>
                <Link to={`/editShipper/${item.MA_NVGH}`}>
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
        onDeleteShipper: (MA_NVGH) => {
            return dispatch(actDeleteShipperRequest(MA_NVGH))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipperItem)
