import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actDeletePromotionRequest } from '../../actions/promotion';

export const PromotionItem = ({ item, onDeletePromotion }) => {

    function deletePromotion(MA_KM) {
        onDeletePromotion(MA_KM)
    }
    return (
        <tr>
            <td>{item.MA_KM}</td>
            <td>{item.TEN}</td>
            <td>{item.NGAYBD.slice(0, 10)}</td>
            <td>{item.NGAYKT.slice(0, 10)}</td>
            <td>{item.MA_NV}</td>
            <td>
                <button type="button" className="btn btn-danger" onClick={() => deletePromotion(item.MA_KM)}>Xóa</button>
                {new Date(item.NGAYKT) < new Date() ? "" : 
                <Link to={`/editPromotion/${item.MA_KM}`} >
                    <button  type="button" className="btn btn-info" >Sửa</button>
                </Link>}
                {/* <Link to={`/editPromotion/${item.MA_KM}`} >
                    <button hidden={ ? true : false} type="button" className="btn btn-info" >Sửa</button>
                </Link> */}
            </td>
        </tr>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onDeletePromotion: (MA_KM) => {
            dispatch(actDeletePromotionRequest(MA_KM))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionItem)
