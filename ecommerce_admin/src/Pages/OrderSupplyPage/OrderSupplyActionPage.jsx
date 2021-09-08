import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SideBar from '../../Components/Bar/SideBar'
import TopBar from '../../Components/Bar/TopBar'
import callApi from '../../utils/apiCaller'
import "./../../assets/css/sb-admin-2.min.css";
import { actFetchBrandsRequest } from '../../actions/brand'
import isEmpty from "validator/lib/isEmpty"
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "react-datepicker/dist/react-datepicker.css";
import { actAddOrderSupplyRequest, actDeleteDetailOrderSupplyRequest, actUpdateOrderSupplyRequest } from '../../actions/orderSupply'
import { getNV, getTokenEmployee } from '../../actions/getNV'
import { v4 as uuidv4 } from 'uuid'
import NumberFormat from 'react-number-format'

const MySwal = withReactContent(Swal)


export const ProductActionPage = ({ match, brand, onAddOrderSupply, onUpdateOrderSupply, history, onFetchBrand, onDeteleDetail }) => {
  const [checkAdd, setcheckAdd] = useState(true)

  const [detail, setDetail] = useState(null)
  const [validationMsg, setvalidationMsg] = useState('')
  const [validationMsgCT_DDH, setvalidationMsgCT_DDH] = useState([])
  const [value, setValue] = useState({
    MA_DDH: '',
    NGAYDAT: new Date(),
    NGAYNHANHANG: new Date(),
    TRANGTHAI: "",
    MA_HANG: "",
    MA_NV: "",
    CT_DDH: [
      {
        id: uuidv4(),
        MA_SP: "",
        SOLUONG: "",
        GIA: "",
        checkForAdd: true
      }
    ]
  })
  const validateAll = () => {
    const msg = {}
    const msgCT_DDH = []
    if (isEmpty(value.MA_DDH)) {
      msg.MA_DDH = "Trường này không được để trống"
    } else if (value.MA_DDH.length > 10) {
      msg.MA_DDH = "Mã đơn đặt không được dài hơn 10 kí tự"
    }

    if (value.NGAYNHANHANG - value.NGAYDAT < 0) {
      msg.NGAYNHANHANG = "Ngày nhận hàng phải trước hoặc bằng ngày hiện tại"
    }

    value.CT_DDH.forEach((element) => {
      const validateDetailPromotion = {}
      validateDetailPromotion.id = element.id

      if (isEmpty(element.MA_SP)) {
        validateDetailPromotion.MA_SP = "Trường này không được để trống"
      } else if (element.MA_SP.length > 10) {
        validateDetailPromotion.MA_SP = "Mã sản phẩm phải ít hơn 10 kí tự"
      }

      if (isEmpty(element.SOLUONG.toString())) {
        validateDetailPromotion.SOLUONG = "Trường này không được để trống"
      } else if (element.SOLUONG <= 0) {
        validateDetailPromotion.SOLUONG = "Số lượng phải lớn hơn 0"
      }

      if (isEmpty(element.GIA.toString())) {
        validateDetailPromotion.GIA = "Trường này không được để trống"
      } else if (element.GIA <= 0) {
        validateDetailPromotion.GIA = "Giá phải lớn hơn 0"
      }
      if (Object.keys(validateDetailPromotion).length > 1) {
        msgCT_DDH.push(validateDetailPromotion)
      }
    });

    setvalidationMsg(msg)
    setvalidationMsgCT_DDH(msgCT_DDH)
    if (Object.keys(msg).length > 0 || msgCT_DDH.length > 0) return false
    return true
  }

  useEffect(() => {
    async function fetchAPI() {
      await onFetchBrand()
      if (match === undefined) {
        setcheckAdd(true)
        setValue({
          ...value,
          TRANGTHAI: 0,
          MA_NV: getNV(history).actort
        })
      } else {
        setcheckAdd(false)
        var OrderSupplyDetail = await callApi(`/OrderSupply?MA_DDH=${match.params.id.trim()}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
          return res.data
        });
        setDetail(OrderSupplyDetail)
        // console.log(OrderSupplyDetail)
        // setValue(OrderSupplyDetail)
        // console.log(value)
      }
    }
    fetchAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (detail != null) {
      setValue({
        ...detail,
        NGAYNHANHANG: new Date(detail.NGAYNHANHANG)
      })
      // CT_DDH có thêm field id để validate và đc thêm sẵn trong api
    }// eslint-disable-next-line
  }, [detail])

  useEffect(() => {
    if (brand.length !== 0) {
      setValue({
        ...value,
        MA_HANG: brand[0].MA_HANG
      })
    }// eslint-disable-next-line
  }, [brand])
  function handleChangeCT_DDH(e, id) {
    var CT_Update = value.CT_DDH.find(CT_DDH => CT_DDH.id === id)

    if (e.target.name === "MA_SP") CT_Update.MA_SP = e.target.value
    else if (e.target.name === "SOLUONG") CT_Update.SOLUONG = e.target.value
    else CT_Update.GIA = e.target.value
    setValue({
      ...value
    })
  }

  async function handleDeleteCT_DDH(ct) {
    // console.log(ct);
    if (checkAdd === true || ct.checkForAdd) {// xử lí trường hợp xóa các CTKM khi thêm KM hoặc khi sửa KM nhưng thêm mới
      let index = value.CT_DDH.findIndex(ctdh => ctdh.id === ct.id)
      value.CT_DDH.splice(index, 1)
      setValue({ ...value })
    } else {
      let res = await onDeteleDetail(ct.MA_DDH.trim(), ct.MA_SP)
      if (res.result === 1) {
        MySwal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        })
        let index = value.CT_DDH.findIndex(ctdh => ctdh.id === ct.id)
        value.CT_DDH.splice(index, 1)
        setValue({ ...value })
      }
      else {// xử lí trường hợp xóa các CTKM khi Sửa KM
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const uniqueValues = new Set(value.CT_DDH.map(v => v.MA_SP.trim()));
    if (uniqueValues.size < value.CT_DDH.length) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Mã sản phẩm không được trùng nhau"
      })
      return
    }
    value.CT_DDH.forEach(sp => {
      if (typeof sp.GIA != 'number') {
        let price = parseInt(sp.GIA.replaceAll(/,/g, ""))
        sp.GIA = price
      }
    })
    console.log(value);

    const isValid = validateAll()
    //validate
    console.log();
    if (isValid) {
      if (checkAdd) {
        if (value.CT_DDH.length === 0) {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Đơn đặt hàng cần ít nhất 1 chi tiết ĐĐH"
          })
          return
        }
        onAddOrderSupply(value, history)
      }
      else {
        let res = await onUpdateOrderSupply(value, history, false)
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
  function handleAddDetailDDH(e) {
    setValue({
      ...value,
      CT_DDH: [
        ...value.CT_DDH,
        {
          id: uuidv4(),
          MA_SP: "",
          SOLUONG: "",
          GIA: "",
          checkForAdd: true
        }
      ]
    })
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
                {checkAdd ? "Thêm đơn đặt hàng từ hãng" : "Sửa đơn đặt hàng từ hãng"}
              </h3>
            </div>

            <form onSubmit={e => handleSubmit(e)}>
              <div className="form-group">
                <label className="control-label" htmlFor="MA_DSP">Mã Đơn đặt hàng(<small className="text-danger">*</small>)</label>
                <input id="MA_DDH" onChange={checkAdd ? e => setValue({ ...value, MA_DDH: e.target.value }) : null} readOnly={checkAdd ? '' : 'readOnly'}
                  value={value.MA_DDH} name="MA_SP" placeholder="Mã Đơn đặt hàng" className="form-control input-md" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.MA_DDH}</small>
              </div>



              <div className="form-group">
                <label className=" control-label" htmlFor="NVGH">Ngày nhận hàng(<small className="text-danger">*</small>)</label>
                <DatePicker
                  selected={value.NGAYNHANHANG}
                  dateFormat={"dd-MM-yyyy"}
                  className="form-control"
                  // onSelect={handleDateSelect} //when day is clicked
                  onChange={date => setValue({ ...value, NGAYNHANHANG: date })} //only when value has changed
                />
                <small className="form-text text-danger">{validationMsg.NGAYNHANHANG}</small>
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Hãng(<small className="text-danger">*</small>)</label>
                <select className="form-control" id="exampleFormControlSelect1"
                  disabled={checkAdd ? false : true}
                  onChange={e => setValue({ ...value, MA_HANG: e.target.value })}
                  value={value.MA_HANG}>
                  {brand.map((bra, index) => {
                    return <option key={index} value={bra.MA_HANG}>{bra.TENHANG} - {bra.MA_HANG}</option>
                  })}
                </select>
                <small className="form-text text-danger">{validationMsg.MA_NVGH}</small>
              </div>



              <hr />
              <h5>Các chi tiết đơn đặt hàng</h5>
              <button onClick={e => handleAddDetailDDH(e)} type="button" className="btn btn-info d-flex" style={{ marginBottom: 10 }}>
                <i className="fas fa-plus-square"></i>&nbsp;Thêm
              </button>
              <div className="row">
                <div className="col"><label htmlFor="exampleFormControlSelect1">Mã Sản phẩm(<small className="text-danger">*</small>)</label></div>
                <div className="col"> <label htmlFor="exampleFormControlSelect1">Số lương(<small className="text-danger">*</small>)</label></div>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Giá(<small className="text-danger">*</small>)</label> </div>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Action</label> </div>
              </div>

              {value.CT_DDH.map((ct) => {
                let index = validationMsgCT_DDH.findIndex(x => x.id === ct.id)

                return <div key={ct.id} className="row" style={{ marginBottom: 15 }}>
                  <div className="col">
                    <input type="text"
                      value={ct.MA_SP}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="MA_SP"
                      disabled={checkAdd ? false : (ct.checkForAdd === true ? false : true)}
                      className="form-control" placeholder="Mã sản phẩm" />
                    {/* <small className="form-text text-danger">{validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].MA_SP}</small> */}
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].MA_SP}
                    </small>
                  </div>
                  <div className="col">
                    <input type="number"
                      value={ct.SOLUONG}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="SOLUONG"
                      className="form-control" placeholder="Số lượng" />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].SOLUONG}
                    </small>
                    {/* <small className="form-text text-danger">{validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].SOLUONG}</small> */}
                  </div>
                  <div className="col">
                    {/* <input type="number"
                      value={ct.GIA}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="GIA"
                      className="form-control" placeholder="Giá" /> */}
                    <NumberFormat value={ct.GIA}
                      thousandSeparator={true}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="GIA"
                      className="form-control" placeholder="Giá" />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].GIA}
                    </small>
                    {/* <small className="form-text text-danger">{validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].GIA}</small> */}
                  </div>
                  <div className="col">
                    <div className="">
                      <button onClick={() => handleDeleteCT_DDH(ct)} type="button" className="btn btn-danger"><i className="fas fa-trash-alt"></i>&nbsp;Xóa</button>
                    </div>
                  </div>
                </div>
              })}
              {/* </div> */}



              <button type="submit" className="btn btn-primary">Submit</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.brand
})

const mapDispatchToProps = dispatch => {
  return ({
    onAddOrderSupply: (order, history) => {
      dispatch(actAddOrderSupplyRequest(order, history))
    },
    onUpdateOrderSupply: (order, history, updateStatus) => {
      return dispatch(actUpdateOrderSupplyRequest(order, history, updateStatus))
    },
    onFetchBrand: () => {
      dispatch(actFetchBrandsRequest())
    },
    onDeteleDetail: (MA_DDH, MA_SP) => {
      return dispatch(actDeleteDetailOrderSupplyRequest(MA_DDH, MA_SP))
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductActionPage)
