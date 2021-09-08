import React from 'react'
import { connect } from 'react-redux'

export const DetailOrder = ({item}) => {
    return (

        <div className="row" style={{marginBottom: 15}}>
            <div className="col">
                <input type="text"
                    value = {item.MA_SP}
                className="form-control" placeholder="Mã sản phẩm" />
            </div>
            <div className="col">
                <input type="number" className="form-control" placeholder="Số lượng" />
            </div>
            <div className="col">
                <input type="text" className="form-control" placeholder="Giá" />
            </div>
            <div className="col">
                <div className="">
                    <button type="button" className="btn btn-danger"><i className="fas fa-trash-alt"></i>&nbsp;Xóa</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(DetailOrder)
