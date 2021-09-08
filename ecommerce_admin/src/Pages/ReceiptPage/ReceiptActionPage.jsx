import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SideBar from '../../Components/Bar/SideBar'
import TopBar from '../../Components/Bar/TopBar'
import callApi from '../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import { actAddReceiptRequest } from '../../actions/receipt'
import { getNV, getTokenEmployee } from '../../actions/getNV'
import NumberFormat from 'react-number-format'

export const ReceiptActionPage = ({ match, history, onAddReceipt }) => {

    const [order, setOrder] = useState("")
    const [receipt, setReceipt] = useState({
        MA_PHIEUNHAP: '',
        NGAYTAO: "",
        MA_NV: '',
        MA_DDH: "",
        CT_PHIEUNHAP: []
    })

    const [validationMsg, setvalidationMsg] = useState('')

    const validateAll = () => {
        const msg = {}
        if (isEmpty(receipt.MA_PHIEUNHAP)) {
            msg.MA_PHIEUNHAP = "Trường này không được để trống"
        } else if (receipt.length > 10) {
            msg.MA_PHIEUNHAP = "Mã phiếu nhập không được dài hơn 10 kí tự"
        }

        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }



    useEffect(() => {
        (async () => {
            await callApi(`OrderSupply?MA_DDH=${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
                setOrder(res.data)
            });
        })()

        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (order !== "") {
            setReceipt({
                ...receipt,
                MA_DDH: match.params.id,
                NGAYTAO: new Date(),
                MA_NV: getNV(history).actort,
                CT_PHIEUNHAP: order.CT_DDH
            })
        }// eslint-disable-next-line
    }, [order])


    function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate

        if (isValid) {
            // thêm vào từng ctpn các id
            receipt.CT_PHIEUNHAP.forEach((ct, index) => {
                //phải lấy trong state ra để sửa thì mới được không thể lấy giá trị trong foreach đc
                receipt.CT_PHIEUNHAP[index] = {
                    ...ct,
                    MA_PHIEUNHAP: receipt.MA_PHIEUNHAP
                }
            })
            setOrder({
                ...order,
                TRANGTHAI: 1// truyền thằng vô là 1 vì đang chuyển từ chờ hàng sang đặt hàng thành công
            })
            // console.log(receipt)
            onAddReceipt(receipt, history, order)
        }
    }

    return (
        <div id="wrapper">
            <SideBar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopBar history={history} />
                    <div className="container" >
                        {/* style ={{marginLeft: 220}} */}

                        <div className="py-3 mb-20" >
                            <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                                Tạo phiếu nhập
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Mã Phiếu nhập</label>
                                <input id="MA_HOADON" value={receipt.MA_PHIEUNHAP}
                                    onChange={e => setReceipt({ ...receipt, MA_PHIEUNHAP: e.target.value })}
                                    placeholder="Mã Phiếu nhập" className="form-control input-md" type="text" />
                                <small className="form-text text-danger">{validationMsg.MA_PHIEUNHAP}</small>
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="ID_PHIEUDAT">Mã đơn đặt hàng</label>
                                <input id="ID_PHIEUDAT" value={receipt.MA_DDH}
                                    className="form-control input-md"
                                    readOnly type="text" />
                            </div>


                            <hr />
                            <h5>Các chi tiết Phiếu nhập</h5>
                            <div className="row">
                                <div className="col"><label htmlFor="exampleFormControlSelect1">Mã Sản phẩm</label></div>
                                <div className="col"> <label htmlFor="exampleFormControlSelect1">Số lương</label></div>
                                <div className="col"><label htmlFor="exampleFormControlSelect1">Giá</label> </div>
                            </div>
                            {order === "" ? "" : order.CT_DDH.map((ct, index) => {
                                return <div key={index} className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <input type="text"
                                            value={ct.MA_SP}
                                            name="MA_SP"
                                            readOnly disabled
                                            className="form-control" placeholder="Mã sản phẩm" />
                                    </div>
                                    <div className="col">
                                        <input type="number"
                                            value={ct.SOLUONG}
                                            name="SOLUONG" readOnly disabled
                                            className="form-control" placeholder="Số lượng" />
                                    </div>
                                    <div className="col">
                                        <NumberFormat value={ct.GIA} thousandSeparator={true} suffix="đ" className="form-control" disabled/>
                                    </div>
                                </div>
                            })}

                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddReceipt: (receipt, history, order) => {
            dispatch(actAddReceiptRequest(receipt, history, order))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptActionPage)
