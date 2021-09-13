import React from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { actUpdateStatusReq } from '../../actions/order'
import { formatDate } from '../../utils/formatDate'
import DetailOrder from './DetailOrder';
import useModal from './../ToggleModal/useModal'

export const OrderItem = ({ item, onUpdateOrder }) => {
    var history = useHistory()

    const { isShowing, toggle } = useModal();
    function renderStatus() {
        if (item.TRANGTHAI === 0) return "Chờ Xét Duyệt"
        else if (item.TRANGTHAI === 1) return "Đang giao hàng"
        else if (item.TRANGTHAI === 2) return "Giao hàng thành công"
        else return "Đã bị hủy "
    }

    function handleUpdateOrder(item, status) {
        var itemUpdate = item
        itemUpdate.TRANGTHAI = status// status: 1 là confirm order // 2 là success // 3 là bị hủy
        itemUpdate = {
            ...itemUpdate,
            CT_PHIEUDAT : itemUpdate.CT_PD
        }
        onUpdateOrder(itemUpdate, status, history, item.TRANSACTIONID == null ? item.TRANSACTIONID : item.TRANSACTIONID.trim())
        // console.log(itemUpdate);
    }

    function renderActionChangeStatus() {
        if (item.TRANGTHAI === 0) {
            return <span className="dropdown">
                &nbsp;&nbsp;
                <i className="fas fa-angle-down" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <span className="dropdown-item" onClick={() => handleUpdateOrder(item, 3)}>Hủy đơn đặt hàng</span>
                    <Link to={`addinvoice/${item.ID_PHIEUDAT}`} className="dropdown-item" >Xác nhận đơn đặt hàng</Link>
                </div>
            </span>
        } else if (item.TRANGTHAI === 1) {
            return <span className="dropdown">
                &nbsp;&nbsp;
                <i className="fas fa-angle-down" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <span className="dropdown-item" onClick={() => handleUpdateOrder(item, 2)}>Hoàn thành đơn hàng</span>
                </div>
            </span>
        }
        else return ""
    }

    return (
        <tr>
            <td className="text-center">{item.ID_PHIEUDAT}</td>
            <td className="text-center">{item.HOTEN}</td>
            <td className="text-center">{item.SODIENTHOAI}</td>
            <td className="text-center">{item.DIACHI}</td>
            <td className="text-center"> {formatDate(new Date(item.NGAYDAT))}</td>
            <td className="text-center">{formatDate(new Date(item.NGAYGIAO))}</td>
            <td className="text-center">{renderStatus()}
                {renderActionChangeStatus()}
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" onClick={toggle}>
                    <i className="fas fa-info-circle"></i>&nbsp;Info
                </button>
                {
                    item.TRANGTHAI === 0 ? <Link to={`/editOrder/${item.ID_PHIEUDAT}`}>
                        <button type="button" className="btn btn-info" ><i className="fas fa-edit"></i>&nbsp;Sửa</button>
                    </Link> : ""
                }
            </td>
            <DetailOrder item={item} isShowing={isShowing} hide={toggle} />
        </tr>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onUpdateOrder: (itemUpdate, status, history, transactionID) => {//cần chuyền status vô để sửa trong state trong store
            dispatch(actUpdateStatusReq(itemUpdate, status, history, transactionID))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem)
