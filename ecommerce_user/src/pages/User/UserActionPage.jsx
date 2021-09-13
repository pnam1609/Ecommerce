import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import callApi from '../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import { actUpdateUser } from '../../actions/user'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenUser } from '../../actions/getUser'

const MySwal = withReactContent(Swal)
export const ChangePasswordPage = ({ match, history, handleUpdateUser }) => {

    const [user, setuser] = useState({
        OldPass: "",
        NewPass: "",
        ReType: ""
    })

    const [validationMsg, setvalidationMsg] = useState('')

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    

    const validateAll = () => {
        const msg = {}

        if (isEmpty(user.OldPass)) {
            msg.OldPass = "Trường này không được để trống"
        } else if (user.OldPass.length < 6) {
            msg.OldPass = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(user.OldPass)) {
            msg.OldPass = "Trường này không được chứa khoảng trống"
        }

        if (isEmpty(user.NewPass)) {
            msg.NewPass = "Trường này không được để trống"
        } else if (user.NewPass.length < 6) {
            msg.NewPass = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(user.NewPass)) {
            msg.NewPass = "Trường này không được chứa khoảng trống"
        }

        if(user.NewPass !== user.ReType){
            msg.ReType = "Nhập lại mật khẩu phải trùng với mật khẩu mới"
        }

        if (isEmpty(user.ReType)) {
            msg.ReType = "Trường này không được để trống"
        } else if (user.ReType.length < 6) {
            msg.ReType = "PassWord phải dài hơn 6 kí tự"
        } else if (hasWhiteSpace(user.ReType)) {
            msg.ReType = "Trường này không được chứa khoảng trống"
        }
        
        
        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    useEffect(() => {
        (async () => {
            await callApi(`User/${match.params.id}`, 'GET', null, `Bearer ${getTokenUser()}`).then(res => {
                // setuser(res.data)
                setuser({
                    ...res.data,
                    NGAYSINH: new Date(res.data.NGAYSINH)
                })
            });
        })()

        //eslint-disable-next-line
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const isValid = validateAll()
        //validate
        console.log(user)

        if (isValid) {
            let res = await handleUpdateUser(user);
                console.log(res);
                if(res.result === 1){
                    MySwal.fire({
                        icon: 'success',
                        title: 'Đổi mật khẩu thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.goBack()
                }else{
                    MySwal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message
                    })
                }
        }
    }

    return (
        <div className="row justify-content-center col-md-8 d-flex" style={{ margin: 'auto' }}>
            <div className="col-xl-10 col-lg-12 col-md-9">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="container" >
                        {/* style ={{marginLeft: 220}} */}
                        <div className="text-center" style={{marginTop: 40,fontSize: 20}}>
                            <Link to='/' className="fas fa-home" style={{textDecoration: 'none'}}></Link>
                        </div>

                        <div className="py-3 mb-20" >
                            <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                                Đổi mật khẩu
                            </h3>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group">
                                <label className="control-label" htmlFor="OldPass">Mật khẩu hiện tại(<small className="text-danger">*</small>)</label>
                                <input id="OldPass" value={user.OldPass}
                                    className="form-control input-md" type="password"
                                    onChange={e => setuser({ ...user, OldPass: e.target.value })}
                                    placeholder="Mật khẩu hiện tại"
                                />
                                <small className="form-text text-danger">{validationMsg.OldPass}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="NewPass">Mật khẩu mới(<small className="text-danger">*</small>)</label>
                                <input id="NewPass" value={user.NewPass}
                                    className="form-control input-md" type="password"
                                    onChange={e => setuser({ ...user, NewPass: e.target.value })}
                                    placeholder="Mật khẩu mới"
                                />
                                <small className="form-text text-danger">{validationMsg.NewPass}</small>
                            </div>

                            <div className="form-group">
                                <label className="control-label" htmlFor="ReType">Nhập lại mật khẩu(<small className="text-danger">*</small>)</label>
                                <input id="ReType" value={user.ReType}
                                    className="form-control input-md" type="password"
                                    onChange={e => setuser({ ...user, ReType: e.target.value })}
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <small className="form-text text-danger">{validationMsg.ReType}</small>
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
        handleUpdateUser : user =>{
            return dispatch(actUpdateUser(user))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage)

