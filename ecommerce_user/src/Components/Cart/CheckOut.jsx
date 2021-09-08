import React, { useEffect, useState } from 'react'
import Total from './Total';
import { getKh } from './../../actions/getUser'
import isEmpty from "validator/lib/isEmpty"
import { useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function CheckOut({ cart }) {
    let history = useHistory()

    const [value, setValue] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        ngaygiao: new Date().setDate(new Date().getDate() + 1)
    })
    const [validationMsg, setvalidationMsg] = useState('')

    useEffect(() => {
        (async () => {
            var user  = getKh(history)
            setValue({
                ...value,
                name: user.unique_name[0],
                address: user.unique_name[1],
                phoneNumber: user.unique_name[2],
            })
        })()// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const validateAll = () => {
        var msg = {}
        if (value.ngaygiao < new Date()) {
            msg.ngaygiao = "Ngày giao hàng cần cách ngày đặt ít nhất 1 ngày"
        }

        if (isEmpty(value.address)) {
            msg.address = "Trường này không được để trống"
        }

        if (isEmpty(value.phoneNumber)) {
            msg.phoneNumber = "Trường này không được để trống"
        }

        if (isEmpty(value.name)) {
            msg.name = "Trường này không được để trống"
        }

        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    return (
        <>
            {
                cart.length === 0 ? "" : <section className="section-content bg padding-y" >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="card">
                                    <header className="card-header">
                                        <h4 className="card-title mt-2">Thông tin</h4>
                                    </header>
                                    <article className="card-body">
                                        <form>
                                            {/* ref={c => { this.form = c }} */}
                                            <div className="form-group">
                                                <label>Họ và tên</label>
                                                <input type="text" value={value.name} name="name"
                                                    onChange={e => setValue({ ...value, name: e.target.value })}
                                                    className="form-control" placeholder="" />
                                                <small className="form-text text-danger">{validationMsg.name}</small>

                                            </div>
                                            <div className="form-group">
                                                <label>Địa chỉ</label>
                                                <input type="text" className="form-control" name="address"
                                                    placeholder="" value={value.address}
                                                    onChange={e => setValue({ ...value, address: e.target.value })} />
                                                <small className="form-text text-danger">{validationMsg.address}</small>
                                            </div>
                                            <div className="form-group">
                                                <label>Số điện thoại</label>
                                                <input type="number" className="form-control" name="phoneNumber"
                                                    placeholder="" value={value.phoneNumber}
                                                    onChange={e => setValue({ ...value, phoneNumber: e.target.value })} />
                                                <small className="form-text text-danger">{validationMsg.phoneNumber}</small>
                                            </div>
                                            <div className="form-group">
                                                <label>Ngày giao</label>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={value.ngaygiao}
                                                    // onSelect={handleDateSelect} //when day is clicked
                                                    onChange={date => setValue({ ...value, ngaygiao: date })} //only when value has changed
                                                />
                                                <small className="form-text text-danger">{validationMsg.ngaygiao}</small>
                                            </div>
                                        </form>
                                    </article>
                                </div>
                            </div>
                            {/* <a href="/#" classNameName="btn btn-success btn-lg btn-block">Thanh toán</a> */}
                            {cart.length === 0 ? "" : <Total cart={cart} onSendFunc={validateAll} value={value} />}

                        </div>
                    </div>
                </section>
            }
        </>

    )
}

export default CheckOut


