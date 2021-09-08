import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SideBar from '../../Components/Bar/SideBar'
import TopBar from '../../Components/Bar/TopBar'
import callApi from '../../utils/apiCaller'
import { actAddemployeeRequest, actUpdateemployeeRequest } from '../../actions/employee'
import isEmpty from "validator/lib/isEmpty"
import isEmail from "validator/lib/isEmail"
import ReactDatePicker from 'react-datepicker'
import { getTokenEmployee } from './../../actions/getNV'

export const EmployeeActionPage = ({ match, onUpdateEmployee, history, onAddemployee }) => {

    const [checkAdd, setcheckAdd] = useState(true)
    // const [order, setOrder] = useState(null)
    const [employee, setemployee] = useState({
        MA_NV: '',
        HOTEN: '',
        NGAYSINH: new Date(),
        DIACHI: '',
        SODIENTHOAI: '',
        EMAIL: '',
        PASS: ''
    })

    const [validationMsg, setvalidationMsg] = useState('')

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const validateAll = () => {
        const msg = {}
        if (isEmpty(employee.MA_NV)) {
            msg.MA_NV = "Trường này không được để trống"
        } else if (employee.length > 10) {
            msg.MA_NV = "Mã nhân viên không được dài hơn 10 kí tự"
        }

        if (isEmpty(employee.HOTEN)) {
            msg.HOTEN = "Trường này không được để trống"
        }

        if (isEmpty(employee.DIACHI)) {
            msg.DIACHI = "Trường này không được để trống"
        }

        if (getAge(employee.NGAYSINH) < 18) {
            msg.NGAYSINH = "Nhân viên cần trên 18 tuổi"
        }

        if (isEmpty(employee.EMAIL)) {
            msg.EMAIL = "Trường này không được để trống"
        } else if (!isEmail(employee.EMAIL)) {
            msg.EMAIL = "Trường này phải là email"
        }

        if (isEmpty(employee.PASS)) {
            msg.PASS = "Trường này không được để trống"
        } else if (employee.PASS.length < 6) {
            msg.PASS = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(employee.PASS)) {
            msg.PASS = "PassWord không được chứa khoảng trống"
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
                await callApi(`Employee/${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
                    // setemployee(res.data)
                    setemployee({
                        ...res.data,
                        NGAYSINH: new Date(res.data.NGAYSINH)
                    })
                });
                setcheckAdd(false)
            }

        })()

        //eslint-disable-next-line
    }, [])

    // useEffect(() => {
    //     if (employee != null) {
    //         console.log(employee)
    //         setemployee({
    //             ...employee,
    //             NGAYSINH : new Date(employee.NGAYSINH)
    //         })
    //     }// eslint-disable-next-line
    // }, [employee])



    function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate
        console.log(employee)

        if (isValid) {
            // console.log(JSON.stringify(employee))
            if (checkAdd === true) {
                onAddemployee(employee, history)
            } else {
                onUpdateEmployee(employee, history)
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
                                {checkAdd ? "THÊM NHÂN VIÊN" : "SỬA NHÂN VIÊN"}
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Mã Nhân viên (<small className="text-danger">*</small>)</label>
                                <input id="MA_NV" value={employee.MA_NV}
                                    onChange={e => setemployee({ ...employee, MA_NV: e.target.value })}
                                    placeholder="Mã nhân viên" className="form-control input-md" type="text"
                                    readOnly={checkAdd ? false : true} />
                                <small className="form-text text-danger">{validationMsg.MA_NV}</small>
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Họ và tên(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.HOTEN}
                                    onChange={e => setemployee({ ...employee, HOTEN: e.target.value })}
                                    className="form-control input-md" type="text"
                                    placeholder="Họ và tên" />
                                <small className="form-text text-danger">{validationMsg.HOTEN}</small>
                            </div>

                            <div className="form-group">
                                <label className=" control-label" htmlFor="NVGH">Ngày sinh(<small className="text-danger">*</small>)</label>
                                <ReactDatePicker
                                    selected={employee.NGAYSINH}
                                    // onSelect={handleDateSelect} //when day is clicked
                                    className="form-control"
                                    onChange={date => setemployee({ ...employee, NGAYSINH: date })} //only when value has changed
                                />
                                <small className="form-text text-danger">{validationMsg.NGAYSINH}</small>
                            </div>


                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Địa chỉ(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.DIACHI}
                                    className="form-control input-md" type="text"
                                    onChange={e => setemployee({ ...employee, DIACHI: e.target.value })}
                                    placeholder="Địa chỉ"
                                />
                                <small className="form-text text-danger">{validationMsg.DIACHI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Số điện thoại(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.SODIENTHOAI}
                                    className="form-control input-md" type="number"
                                    onChange={e => setemployee({ ...employee, SODIENTHOAI: e.target.value })}
                                    placeholder="Số điện thoại"
                                />
                                <small className="form-text text-danger">{validationMsg.SODIENTHOAI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Email(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.EMAIL}
                                    className="form-control input-md" type="text"
                                    onChange={e => setemployee({ ...employee, EMAIL: e.target.value })}
                                    placeholder="Email"
                                />
                                <small className="form-text text-danger">{validationMsg.EMAIL}</small>
                            </div>

                            {/* {checkAdd ? <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Mật khẩu(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.PASS}
                                    className="form-control input-md" type="password"
                                    onChange={e => setemployee({ ...employee, PASS: e.target.value })}
                                    placeholder="Mật khẩu"
                                />
                                <small className="form-text text-danger">{validationMsg.PASS}</small>
                            </div> : ""} */}
                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Mật khẩu(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={employee.PASS}
                                    className="form-control input-md" type="password"
                                    onChange={e => setemployee({ ...employee, PASS: e.target.value })}
                                    placeholder="Mật khẩu"
                                />
                                <small className="form-text text-danger">{validationMsg.PASS}</small>
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
        onAddemployee: (employee, history) => {
            dispatch(actAddemployeeRequest(employee, history))
        },
        onUpdateEmployee: (employee, history) => {
            dispatch(actUpdateemployeeRequest(employee, history))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeActionPage)
