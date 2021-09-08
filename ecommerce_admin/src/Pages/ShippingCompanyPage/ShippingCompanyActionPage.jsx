import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SideBar from '../../Components/Bar/SideBar'
import TopBar from '../../Components/Bar/TopBar'
import callApi from '../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import isEmail from "validator/lib/isEmail"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenEmployee } from './../../actions/getNV'
import { actAddShippingCompanyRequest, actUpdateShippingCompanyRequest } from './../../actions/shippingCompany'

const MySwal = withReactContent(Swal)


export const ShippingCompanyActionPage = ({ match, onUpdateShippingCompany, history, onAddShippingCompany }) => {

    const [checkAdd, setcheckAdd] = useState(true)
    // const [order, setOrder] = useState(null)
    const [ShippingCompany, setShippingCompany] = useState({
        MA_CTVC: '',
        TEN: '',
        DIACHI: '',
        SODIENTHOAI: '',
        EMAIL: ''
    })

    const [validationMsg, setvalidationMsg] = useState('')

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const validateAll = () => {
        const msg = {}
        if (isEmpty(ShippingCompany.MA_CTVC)) {
            msg.MA_CTVC = "Trường này không được để trống"
        } else if (ShippingCompany.length > 10) {
            msg.MA_CTVC = "Mã nhân viên không được dài hơn 10 kí tự"
        } else if (hasWhiteSpace(ShippingCompany.MA_CTVC.trim())) {
            msg.MA_CTVC = "Trường này không được có khoảng trống"
        }

        if (isEmpty(ShippingCompany.TEN)) {
            msg.TEN = "Trường này không được để trống"
        }

        if (isEmpty(ShippingCompany.DIACHI)) {
            msg.DIACHI = "Trường này không được để trống"
        }

        console.log(isEmail(ShippingCompany.EMAIL.trim()));
        if (isEmpty(ShippingCompany.EMAIL)) {
            msg.EMAIL = "Trường này không được để trống"
        } else if (!isEmail(ShippingCompany.EMAIL.trim())) {
            msg.EMAIL = "Trường này phải là email"
        }

        if (isEmpty(ShippingCompany.SODIENTHOAI)) {
            msg.SODIENTHOAI = "Trường này không được để trống"
        } else if (ShippingCompany.SODIENTHOAI.length !== 10) {
            msg.SODIENTHOAI = "Số điện thoại cần đúng 10 chữ số"
        }else if (hasWhiteSpace(ShippingCompany.SODIENTHOAI)) {
            msg.SODIENTHOAI = "Trường này không được có khoảng trống"
        }


        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    useEffect(() => {
        (async () => {
            if (match.params.id === undefined) {
                setcheckAdd(true)
            } else {
                let data = await callApi(`ShippingCompany/${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
                    console.log(res.data);
                    return res.data
                });
                setShippingCompany(data)
                setcheckAdd(false)
            }

        })()

        //eslint-disable-next-line
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate

        if (isValid) {
            // console.log(JSON.stringify(ShippingCompany))
            if (checkAdd === true) {
                let res = await onAddShippingCompany(ShippingCompany)
                if (res.result === 1) {
                    //tb
                    MySwal.fire({
                        icon: 'success',
                        title: res.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.goBack()
                }
                else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message
                    })
                }
            } else {
                let res = await onUpdateShippingCompany(ShippingCompany)
                if (res.result === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: res.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.goBack()
                }
                else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message
                    })
                }
            }
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
                                {checkAdd ? "THÊM CÔNG TY VẬN CHUYỂN" : "SỬA CÔNG TY VẬN CHUYỂN"}
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Mã Công ty vận chuyển (<small className="text-danger">*</small>)</label>
                                <input id="MA_CTVC" value={ShippingCompany.MA_CTVC}
                                    onChange={e => setShippingCompany({ ...ShippingCompany, MA_CTVC: e.target.value })}
                                    placeholder="Mã Công ty vận chuyển" className="form-control input-md" type="text"
                                    readOnly={checkAdd ? false : true} />
                                <small className="form-text text-danger">{validationMsg.MA_CTVC}</small>
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="TEN">Tên Công ty vận chuyển(<small className="text-danger">*</small>)</label>
                                <input id="TEN" value={ShippingCompany.TEN}
                                    onChange={e => setShippingCompany({ ...ShippingCompany, TEN: e.target.value })}
                                    className="form-control input-md" type="text"
                                    placeholder="Tên Công ty vận chuyển" />
                                <small className="form-text text-danger">{validationMsg.TEN}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="TEN">Địa chỉ(<small className="text-danger">*</small>)</label>
                                <input id="TEN" value={ShippingCompany.DIACHI}
                                    className="form-control input-md" type="text"
                                    onChange={e => setShippingCompany({ ...ShippingCompany, DIACHI: e.target.value })}
                                    placeholder="Địa chỉ"
                                />
                                <small className="form-text text-danger">{validationMsg.DIACHI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="TEN">Số điện thoại(<small className="text-danger">*</small>)</label>
                                <input id="TEN" value={ShippingCompany.SODIENTHOAI}
                                    className="form-control input-md" type="text"
                                    onChange={e => setShippingCompany({ ...ShippingCompany, SODIENTHOAI: e.target.value })}
                                    placeholder="Số điện thoại"
                                />
                                <small className="form-text text-danger">{validationMsg.SODIENTHOAI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="TEN">Email(<small className="text-danger">*</small>)</label>
                                <input id="TEN" value={ShippingCompany.EMAIL}
                                    className="form-control input-md" type="text"
                                    onChange={e => setShippingCompany({ ...ShippingCompany, EMAIL: e.target.value })}
                                    placeholder="Email"
                                />
                                <small className="form-text text-danger">{validationMsg.EMAIL}</small>
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

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddShippingCompany: (ShippingCompany) => {
            return dispatch(actAddShippingCompanyRequest(ShippingCompany))
        },
        onUpdateShippingCompany: (ShippingCompany) => {
            return dispatch(actUpdateShippingCompanyRequest(ShippingCompany))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingCompanyActionPage)
