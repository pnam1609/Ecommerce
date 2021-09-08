import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actDeleteemployeeRequest } from '../../actions/employee';
import { formatDate } from '../../utils/formatDate';

export const EmployeeItem = ({ onDeleteEmployee, item }) => {

    function deleteProduct(MA_NV) {
        onDeleteEmployee(MA_NV)
    }

    return (
        <tr>
            <td>{item.MA_NV}</td>
            <td>{item.HOTEN}</td>
            <td>{formatDate(new Date(item.NGAYSINH))}</td>
            <td>{item.DIACHI}</td>
            <td>{item.SODIENTHOAI}</td>
            <td>{item.EMAIL}</td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => deleteProduct(item.MA_NV)}>Xóa</button>
                <Link to={`/editEmployee/${item.MA_NV}`}>
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
        onDeleteEmployee: (MA_NV) => {
            dispatch(actDeleteemployeeRequest(MA_NV))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeItem)
