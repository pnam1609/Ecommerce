import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { actFetchshipperReq } from '../../actions/shipper'
import SideBar from '../../Components/Bar/SideBar'
import TopBar from '../../Components/Bar/TopBar'
import callApi from '../../utils/apiCaller'
import { actAddInvoiceRequest } from '../../actions/invoice'
import isEmpty from "validator/lib/isEmpty"
import { getNV, getTokenEmployee } from '../../actions/getNV'

export const InvoiceActionPage = ({ match, onFetchShipper, shipper, history, onAddInvoice }) => {

    const [order, setOrder] = useState(null)
    const [invoice, setInvoice] = useState({
        MA_HOADON: '',
        ID_PHIEUDAT: '',
        NGAYTAOHD: '',
        MASOTHUE: '',
        MA_NV: '',
        MA_NVGH: '',
        TONGTIEN: ''
    })

    const [validationMsg, setvalidationMsg] = useState('')

    const validateAll = () => {
        const msg = {}
        if (isEmpty(invoice.MA_HOADON)) {
            msg.MA_HOADON = "Trường này không được để trống"
        } else if (invoice.length > 10) {
            msg.MA_HOADON = "Mã hóa đơn không được dài hơn 10 kí tự"
        }

        if (isEmpty(invoice.MASOTHUE)) {
            msg.MASOTHUE = "Trường này không được để trống"
        }
        if (isEmpty(invoice.MA_NVGH)) {
            msg.MASOTHUE = "Trường này không được để trống"
        }

        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }


    useEffect(() => {
        (async () => {
            await callApi(`OrderUser/${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
                setOrder(res.data)
            });
            await onFetchShipper()
        })()

        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (order != null) {
            setInvoice({
                ...invoice,
                ID_PHIEUDAT: parseInt(match.params.id),
                TONGTIEN: order.CT_PHIEUDAT.reduce((total, CTPD) => total + CTPD.SOLUONG * CTPD.GIA, 0),
                NGAYTAOHD: new Date(),
                MA_NV: getNV(history).actort
            })
        }// eslint-disable-next-line
    }, [order])

    //tách 2 useeffect do k await đợi kết quả đc code hơi ngu chưa fix đc
    useEffect(() => {
        if (shipper.length !== 0) {
            setInvoice({
                ...invoice,
                MA_NVGH: shipper[0].MA_NVGH
            })
        }// eslint-disable-next-line
    }, [shipper])


    function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate
        console.log(invoice)
        
        if (isValid){
            // console.log(JSON.stringify(invoice))
            onAddInvoice(invoice,history)
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
                                TẠO HÓA ĐƠN
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Mã hóa đơn(<small className="text-danger">*</small>)</label>
                                <input id="MA_HOADON" value={invoice.MA_HOADON} onChange={e => setInvoice({ ...invoice, MA_HOADON: e.target.value })} placeholder="Mã hóa đơn" className="form-control input-md" type="text" />
                                <small className="form-text text-danger">{validationMsg.MA_HOADON}</small>
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="ID_PHIEUDAT">ID Phiếu Đặt(<small className="text-danger">*</small>)</label>
                                <input id="ID_PHIEUDAT" value={invoice.ID_PHIEUDAT} className="form-control input-md" readOnly type="text" />
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Mã số thuế(<small className="text-danger">*</small>)</label>
                                <input id="MA_HOADON" value={invoice.MASOTHUE} onChange={e => setInvoice({ ...invoice, MASOTHUE: e.target.value })} placeholder="Mã hóa đơn" className="form-control input-md" type="number" />
                                <small className="form-text text-danger">{validationMsg.MASOTHUE}</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Nhân viên giao hàng(<small className="text-danger">*</small>)</label>
                                <select className="form-control" id="exampleFormControlSelect1" onChange={e => setInvoice({ ...invoice, MA_NVGH: e.target.value })}
                                    value={invoice.MA_NVGH}>
                                    {shipper.map((sp, index) => {
                                        return <option key={index} value={sp.MA_NVGH}>{sp.HOTEN} - {sp.MA_NVGH}</option>
                                    })}
                                </select>
                                <small className="form-text text-danger">{validationMsg.MA_NVGH}</small>
                            </div>

                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    shipper: state.shipper
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchShipper: () => {
            dispatch(actFetchshipperReq())
        },
        onAddInvoice: (invoice,history) => {
            dispatch(actAddInvoiceRequest(invoice,history))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceActionPage)
