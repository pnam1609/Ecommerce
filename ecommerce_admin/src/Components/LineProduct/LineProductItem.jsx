import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { actDeleteLineProductRequest } from "./../../actions/index";
import useModal from './../ToggleModal/useModal';
import ModalDetailLP from './ModalDetailLP'

export const LineProductItem = ({ item, onDeleteLineProduct }) => {
    const { isShowing, toggle } = useModal();

    function deleteLineProduct(MA_DSP) {
        onDeleteLineProduct(MA_DSP)
    }

    return (
        <tr >
            <td>{item.MA_DSP}</td>
            <td>{item.TEN}</td>
            <td>{item.GIOITINH ? "Nam" : "Nữ"}</td>
            <td>{item.XUATXU}</td>
            <td>{item.DOLUUHUONG}</td>
            <td>{item.HANG.TENHANG}</td>
            <td>
                <Link to={`/editlineproduct/${item.MA_DSP}`}>
                    <button type="button" className="btn btn-info">
                        <i className="fas fa-edit"></i>&nbsp;Sửa
                    </button>
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => deleteLineProduct(item.MA_DSP)}>
                    <i className="fas fa-trash-alt"></i>&nbsp;Xóa
                </button>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" onClick={toggle}>
                    <i className="fas fa-info-circle"></i>&nbsp;Info
                </button>
            </td>
            <ModalDetailLP item={item} isShowing={isShowing} hide={toggle} />
        </tr>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteLineProduct: (MA_DSP) => {
            dispatch(actDeleteLineProductRequest(MA_DSP))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineProductItem)
