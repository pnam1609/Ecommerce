import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import callApi from '../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import isEmail from "validator/lib/isEmail"
import ReactDatePicker from 'react-datepicker'
import { actSignUpReq, actUpdateUser } from '../../actions/user'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenUser } from '../../actions/getUser'

const MySwal = withReactContent(Swal)
export const SignUpPage = ({ match, history, handleSignUp, handleUpdateUser }) => {

    const [checkAdd, setcheckAdd] = useState(true)
    // const [order, setOrder] = useState(null)
    const [user, setuser] = useState({
        MA_KH: '',
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
        if (isEmpty(user.MA_KH)) {
            msg.MA_KH = "Trường này không được để trống"
        } else if (user.length > 10) {
            msg.MA_KH = "Mã nhân viên không được dài hơn 10 kí tự"
        }

        if (isEmpty(user.HOTEN)) {
            msg.HOTEN = "Trường này không được để trống"
        }

        if (isEmpty(user.DIACHI)) {
            msg.DIACHI = "Trường này không được để trống"
        }

        if (getAge(user.NGAYSINH) < 12) {
            msg.NGAYSINH = "Khách hàng cần trên 12 tuổi"
        }

        if (isEmpty(user.EMAIL)) {
            msg.EMAIL = "Trường này không được để trống"
        } else if (!isEmail(user.EMAIL)) {
            msg.EMAIL = "Trường này phải là email"
        }

        if (isEmpty(user.PASS)) {
            msg.PASS = "Trường này không được để trống"
        } else if (user.PASS.length < 6) {
            msg.PASS = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(user.PASS)) {
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
                await callApi(`User/${match.params.id}`, 'GET', null, `Bearer ${getTokenUser()}`).then(res => {
                    // setuser(res.data)
                    setuser({
                        ...res.data,
                        NGAYSINH: new Date(res.data.NGAYSINH)
                    })
                });
                setcheckAdd(false)
            }

        })()

        //eslint-disable-next-line
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate
        console.log(user)

        if (isValid) {
            // console.log(JSON.stringify(user))
            if (checkAdd === true) {
                let res = await handleSignUp(user)
                if (res === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Tạo tài khoản thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push('/signin')
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message
                    })
                }
            } else {
                let res = await handleUpdateUser(user);
                console.log(res);
                if (res.result === 1) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Sửa thông tin thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.goBack()
                } else {
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
        <div className="row justify-content-center col-md-8 d-flex" style={{ margin: 'auto' }}>
            <div className="col-xl-10 col-lg-12 col-md-9">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="container" >
                        {/* style ={{marginLeft: 220}} */}
                        <div className="text-center" style={{ marginTop: 40, fontSize: 20 }}>
                            <Link to='/' className="fas fa-home" style={{ textDecoration: 'none' }}></Link>
                        </div>

                        <div className="py-3 mb-20" >
                            <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                                {checkAdd ? "Tạo tài khoản" : "Sửa thông tin cá nhân"}
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="MA_DSP">Chứng minh thư (<small className="text-danger">*</small>)</label>
                                <input id="MA_KH" value={user.MA_KH}
                                    onChange={e => setuser({ ...user, MA_KH: e.target.value })}
                                    placeholder="Mã nhân viên" className="form-control input-md" type="text"
                                    readOnly={checkAdd ? false : true} />
                                <small className="form-text text-danger">{validationMsg.MA_KH}</small>
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Họ và tên(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={user.HOTEN}
                                    onChange={e => setuser({ ...user, HOTEN: e.target.value })}
                                    className="form-control input-md" type="text"
                                    placeholder="Họ và tên" />
                                <small className="form-text text-danger">{validationMsg.HOTEN}</small>
                            </div>

                            <div className="form-group">
                                <label className=" control-label" htmlFor="NVGH">Ngày sinh(<small className="text-danger">*</small>)</label>
                                <ReactDatePicker
                                    className="form-control"
                                    selected={user.NGAYSINH}
                                    // onSelect={handleDateSelect} //when day is clicked
                                    onChange={date => setuser({ ...user, NGAYSINH: date })} //only when value has changed
                                />
                                <small className="form-text text-danger">{validationMsg.NGAYSINH}</small>
                            </div>


                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Địa chỉ(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={user.DIACHI}
                                    className="form-control input-md" type="text"
                                    onChange={e => setuser({ ...user, DIACHI: e.target.value })}
                                    placeholder="Địa chỉ"
                                />
                                <small className="form-text text-danger">{validationMsg.DIACHI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Số điện thoại(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={user.SODIENTHOAI}
                                    className="form-control input-md" type="number"
                                    onChange={e => setuser({ ...user, SODIENTHOAI: e.target.value })}
                                    placeholder="Số điện thoại"
                                />
                                <small className="form-text text-danger">{validationMsg.SODIENTHOAI}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Email(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={user.EMAIL}
                                    className="form-control input-md" type="text"
                                    onChange={e => setuser({ ...user, EMAIL: e.target.value })}
                                    placeholder="Email"
                                />
                                <small className="form-text text-danger">{validationMsg.EMAIL}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="HOTEN">Mật khẩu(<small className="text-danger">*</small>)</label>
                                <input id="HOTEN" value={user.PASS}
                                    className="form-control input-md" type="password"
                                    onChange={e => setuser({ ...user, PASS: e.target.value })}
                                    placeholder="Mật khẩu"
                                />
                                <small className="form-text text-danger">{validationMsg.PASS}</small>
                            </div>

                            <button style={{ marginBottom: 40, width: '100%' }} type="submit" className="btn btn-primary">Submit</button>
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
        handleSignUp: user => {
            return dispatch(actSignUpReq(user))
        },
        handleUpdateUser: user => {
            return dispatch(actUpdateUser(user))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)

