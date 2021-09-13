import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import jwt_decode from "jwt-decode";
import callApi from '../../utils/apiCaller';
import isEmail from 'validator/lib/isEmail'
import { Link } from 'react-router-dom';

export const SignInPage = ({ history }) => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [validationMsg, setvalidationMsg] = useState("")

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("user"))
        if (data != null) {
            console.log(data.token)
            let decodedToken = jwt_decode(data.token)
            console.log("Decoded Token", decodedToken);
            let currentDate = new Date();

            // JWT exp is in seconds
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                console.log("Token expired.");
            } else {
                try {
                    history.goBack()
                } catch (error) {
                    history.push('/')
                }

            }
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const validateAll = () => {
        var msg = {}
        if (username.trim() === "") {
            msg.username = "Trường này không được để trống"
        } else if (!isEmail(username)) {
            msg.username = "Trường này phải là email"
        } else if (hasWhiteSpace(username)) {
            msg.username = "Trường này không được có khoảng trắng"
        }

        if (password.trim() === "") {
            msg.password = "Trường này không được để trống"
        } else if (password.length < 6) {
            msg.password = "Password cần nhiều hơn 6 kí tự"
        } else if (hasWhiteSpace(password)) {
            msg.password = "Trường này không được có khoảng trắng"
        }
        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const isvalid = validateAll()
        if (isvalid) {
            await callApi(`User?username=${username}&password=${password}`, 'GET', null, null).then(res => {
                if (res.data.result === 1) {
                    console.log(res.data.token)
                    localStorage.setItem("user", JSON.stringify(res.data))
                    try {
                        history.goBack()
                    } catch (error) {
                        history.push('/')
                    }
                } else {
                    setvalidationMsg({
                        error: 'Sai tên đăng nhập hoặc mật khẩu'
                    })
                }
            })
        }
    }

    return (
        <div className="container">
            {/* <!-- Outer Row --> */}
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            {/* <!-- Nested Row within Card Body --> */}
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block">
                                    <img src="https://images.unsplash.com/photo-1535683577427-740aaac4ec25?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZnVtZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" alt=""
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center" style={{ marginTop: 40, fontSize: 20 }}>
                                            <Link to='/' className="fas fa-home" style={{ textDecoration: 'none' }}></Link>
                                        </div>

                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                        </div>
                                        <form className="user" onSubmit={(e) => handleSubmit(e)}>
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user"
                                                    id="exampleInputEmail" aria-describedby="emailHelp"
                                                    placeholder="Enter Email Address..." name="username"
                                                    onChange={e => setusername(e.target.value)} />
                                                <small className="form-text text-danger d-flex justify-content-center">
                                                    {validationMsg.username}
                                                </small>
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-user"
                                                    id="exampleInputPassword" placeholder="Password" name="password"
                                                    onChange={e => setpassword(e.target.value)} />
                                                <small className="form-text text-danger d-flex justify-content-center" >
                                                    {validationMsg.password}
                                                </small>
                                            </div>
                                            <button className="btn btn-primary btn-user btn-block">
                                                Login
                                            </button>
                                            <small className="form-text text-danger d-flex justify-content-center">
                                                {validationMsg.error}
                                            </small>
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <a className="small" href="forgot-password.html">Forgot Password?</a>
                                        </div>
                                        <div className="text-center">
                                            <Link to="/signup" className="small" >Create an Account!</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage)
