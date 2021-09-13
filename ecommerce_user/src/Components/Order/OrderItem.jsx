import React from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../../utils/formatDate'
import DetailOrder from './DetailOrder';
import useModal from './../ToggleModal/useModal';

export const OrderItem = ({ item }) => {

    const { isShowing, toggle } = useModal();

    function renderStatus() {
        if (item.TRANGTHAI === 0) return "Chờ Xét Duyệt"
        else if (item.TRANGTHAI === 1) return "Đang giao hàng"
        else if (item.TRANGTHAI === 2) return "Giao hàng thành công"
        else return "Đã bị hủy"
    }

    return (
        <tr>
            <td className="text-center">{item.HOTEN}</td>
            <td className="text-center">{item.SODIENTHOAI}</td>
            <td className="text-center">{item.DIACHI}</td>
            <td className="text-center"> {formatDate(new Date(item.NGAYDAT))}</td>
            <td className="text-center">{formatDate(new Date(item.NGAYGIAO))}</td>
            <td className="text-center">{renderStatus()}</td>
            <td className="text-center">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" onClick={toggle}>
                    <i className="fas fa-info-circle"></i>&nbsp;Info
                </button>
            </td>
            <DetailOrder item={item} isShowing={isShowing} hide={toggle} />
        </tr>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem)
