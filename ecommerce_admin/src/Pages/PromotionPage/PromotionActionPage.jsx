import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'validator/lib/isEmpty';
import SideBar from '../../Components/Bar/SideBar';
import TopBar from '../../Components/Bar/TopBar';
import callApi from '../../utils/apiCaller';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactDatePicker from 'react-datepicker';
import { actFetchEmployeesRequest } from '../../actions/employee';
import { actAddPromotionRequest, actDeleteDetailPromotionReq, actUpdatePromotionRequest } from '../../actions/promotion';
import { getNV, getTokenEmployee } from './../../actions/getNV'
import { v4 as uuidv4 } from 'uuid'

const MySwal = withReactContent(Swal)

// const { v4: uuidv4 } = require('uuid');
// const uuidv4 = require("uuid/v4")



export const PromotionActionPage = ({ match, onFetchEmployee, onAddPromotion, history, onUpdatePromotion, onDelDetailPromotion }) => {
  //state check kiểm tra là thêm hay sửa
  const [checkAdd, setcheckAdd] = useState(true)

  const [validationMsg, setvalidationMsg] = useState('')
  const [validationMsgCT_DDH, setvalidationMsgCT_DDH] = useState([])
  const [value, setValue] = useState({
    MA_KM: '',
    TEN: '',
    NGAYBD: new Date(),
    NGAYKT: new Date(new Date().setDate(new Date().getDate() + 1)),
    MA_NV: getNV(history).actort,
    MOTA: "",
    CT_KM: [
      {
        id: uuidv4(),
        MA_KM: "",
        MA_DSP: "",
        PHANTRAMKM: "",
        checkForAdd: true,
      }
    ]
  })
  // const [Va, setVa] = useState(initialState)

  useEffect(() => {
    (async () => {
      await onFetchEmployee()
      if (match === undefined) {
        setcheckAdd(true)
      } else {
        setcheckAdd(false)
        var OrderSupplyDetail = await callApi(`Promotion/${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
          return res.data
        });
        setValue(OrderSupplyDetail)
        // console.log(OrderSupplyDetail.CT_KM)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleAddDetailDDH(e) {
    setValue({
      ...value,
      CT_KM: [
        ...value.CT_KM,
        {
          id: uuidv4(),
          MA_KM: "",
          MA_DSP: "",
          PHANTRAMKM: "",
          checkForAdd: true
        }
      ]
    })
  }

  const validateAll = () => {
    const msg = {}
    var msgCTKM = []

    setvalidationMsgCT_DDH([])

    if (isEmpty(value.MA_KM)) {
      msg.MA_KM = "Trường này không được để trống"
    } else if (value.MA_KM.length > 10) {
      msg.MA_KM = "Mã đơn đặt không được dài hơn 10 kí tự"
    }

    if (isEmpty(value.TEN)) {
      msg.TEN = "Trường này không được để trống"
    }


    if (value.NGAYBD >= value.NGAYKT) {
      msg.NGAYKT = "Ngày kết thúc phải sau ngày bắt đầu"
    }

    value.CT_KM.forEach(element => {
      const validateDetailPromotion = {}

      if (isEmpty(element.MA_DSP)) {
        validateDetailPromotion.MA_DSP = "Trường này không được để trống"
      } else if (element.MA_DSP.length > 10) {
        validateDetailPromotion.MA_DSP = "Mã sản phẩm phải ít hơn 10 kí tự"
      }

      if (isEmpty(element.PHANTRAMKM.toString())) {
        validateDetailPromotion.PHANTRAMKM = "Trường này không được để trống"
      } else if (element.PHANTRAMKM <= 0) {
        validateDetailPromotion.PHANTRAMKM = "Phần trăm khuyến mãi phải lớn hơn 0"
      }
      validateDetailPromotion.id = element.id

      if (Object.keys(validateDetailPromotion).length > 1) {
        msgCTKM.push(validateDetailPromotion)
      }
    })

    setvalidationMsg(msg)
    setvalidationMsgCT_DDH(msgCTKM)
    if (Object.keys(msg).length > 0 || msgCTKM.length > 0) return false
    return true
  }
  console.log(value);

  async function handleDeleteCT_DDH(ct) {
    // console.log(ct.MA_KM, ct.MA_DSP)
    if (checkAdd === true || ct.checkForAdd) {// xử lí trường hợp xóa các CTKM khi thêm KM hoặc khi sửa KM nhưng thêm mới
      let index = value.CT_KM.findIndex(sp => sp.id === ct.id)// đây chỉ là phần xóa ở giao diện
      value.CT_KM.splice(index, 1)
      setValue({ ...value })
    } else {
      let res = await onDelDetailPromotion(ct.MA_KM.trim(), ct.MA_DSP)
      if (res.result === 1) {
        MySwal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        })
        let index = value.CT_KM.findIndex(sp => sp.id === ct.id)
        value.CT_KM.splice(index, 1)

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

  function handleChangeCTKM(e, id) {

    var CT_Update = value.CT_KM.find(CT_DDH => CT_DDH.id === id)

    if (e.target.name === "MA_DSP") CT_Update.MA_DSP = e.target.value
    else CT_Update.PHANTRAMKM = e.target.value
    setValue({
      ...value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const uniqueValues = new Set(value.CT_KM.map(v => v.MA_DSP.trim()));
    if (uniqueValues.size < value.CT_KM.length) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Trong 1 đợt khuyến mãi không thể có dòng sản phẩm trùng nhau"
      })
      return
    }

    const isValid = validateAll()
    //validate
    if (isValid) {
      if (checkAdd) {
        if (value.CT_KM.length === 0) {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Đợt khuyến mãi cần ít nhất có 1 chi tiết khuyến mãi"
          })
          return
        }
        onAddPromotion(value, history)
      }
      else {
        onUpdatePromotion(value, history)
      }
    }
    // console.log(value);
  }
  return (

    <div id="wrapper" >
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopBar history={history} />
          <div className="container" >
            {/* style ={{marginLeft: 220}} */}

            <div className="py-3 mb-20" >
              <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                {checkAdd ? "Thêm đợt khuyến mãi" : "Sửa đợt khuyến mãi"}
              </h3>
            </div>


            <form onSubmit={e => handleSubmit(e)} style={{ marginBottom: 200 }}>
              {/* Mã dòng sản phẩm  */}
              <div className="form-group">
                <label className="control-label" htmlFor="MA_KM">Mã khuyến mãi(<small className="text-danger">*</small>)</label>
                <input id="MA_KM" onChange={checkAdd ? e => setValue({ ...value, MA_KM: e.target.value }) : null} readOnly={checkAdd ? '' : 'readOnly'}
                  value={value.MA_KM} name="MA_KM" placeholder="Mã Khuyến mãi" className="form-control input-md" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.MA_KM}</small>
              </div>

              {/* Tên */}
              <div className="form-group">
                <label className=" control-label" htmlFor="TEN">Tên khuyến mãi(<small className="text-danger">*</small>)</label>
                <input id="TEN" onChange={e => setValue({ ...value, TEN: e.target.value })} value={value.TEN} name="TEN" placeholder="Tên khuyến mãi" className="form-control input-md" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.TEN}</small>
              </div>

              {/* Độ lưu hương */}
              <div className="form-group">
                <label value={value.NGAYBD} className=" control-label" htmlFor="XUATXU">Ngày bắt đầu(<small className="text-danger">*</small>)</label>
                <ReactDatePicker
                  selected={new Date(value.NGAYBD)}
                  name="NGAYDB"
                  className="form-control"
                  onChange={date => setValue({ ...value, NGAYBD: date })} //only when value has changed
                />
                <small className="form-text text-danger">{validationMsg.NGAYBD}</small>
              </div>

              <div className="form-group">
                <label value={value.NGAYKT} className=" control-label" htmlFor="XUATXU">Ngày kết thúc(<small className="text-danger">*</small>)</label>
                <ReactDatePicker
                  selected={new Date(value.NGAYKT)}
                  name="NGAYKT"
                  className="form-control"
                  onChange={date => setValue({ ...value, NGAYKT: date })} //only when value has changed
                />
                <small className="form-text text-danger">{validationMsg.NGAYKT}</small>
              </div>


              {/* Mô tả */}
              <div className="form-group">
                <label value={value.MOTA} className=" control-label" htmlFor="MOTA">Mô Tả</label>
                <textarea onChange={e => setValue({ ...value, MOTA: e.target.value })} value={value.MOTA} className="form-control" id="MOTA" name="MOTA"></textarea>
              </div>



              <div className="form-group" >
                <label htmlFor="exampleFormControlSelect1">Các Chi tiết khuyến mãi</label>
                <button onClick={e => handleAddDetailDDH(e)}
                  hidden={checkAdd ? false : true}
                  type="button" className="btn btn-info d-flex" >
                  <i className="fas fa-plus-square"></i>&nbsp;Thêm
                </button>
                <div className="row" style={{ marginTop: 10 }}>
                  <div className="col"><label htmlFor="exampleFormControlSelect1">Mã dòng Sản phẩm(<small className="text-danger">*</small>)</label></div>
                  <div className="col"> <label htmlFor="exampleFormControlSelect1">Phần trăm khuyến mãi(<small className="text-danger">*</small>)</label></div>
                  <div className="col">
                    <label htmlFor="exampleFormControlSelect1">Action</label>
                  </div>
                </div>

                {
                  value.CT_KM.map((ct) => {
                    // console.log(validationMsgCT_DDH);
                    let index = validationMsgCT_DDH.findIndex(x => x.id === ct.id)
                    return <div key={ct.id} className="row" style={{ marginBottom: 15 }}>
                      <div className="col">
                        <input type="text"
                          value={ct.MA_DSP}
                          onChange={e => handleChangeCTKM(e, ct.id)}
                          name="MA_DSP"
                          className="form-control" placeholder="Mã dòng sản phẩm"
                          disabled={checkAdd ? false : (ct.checkForAdd === true ? false : true)} />
                        <small className="form-text text-danger">
                          {index === -1 ? "" : validationMsgCT_DDH[index].MA_DSP}
                        </small>

                      </div>
                      <div className="col">
                        <input type="number"
                          value={ct.PHANTRAMKM}
                          onChange={e => handleChangeCTKM(e, ct.id)}
                          name="SOLUONG"
                          className="form-control" placeholder="Phần trăm khuyến mãi" />

                        <small className="form-text text-danger">
                          {/* {validationMsgCT_DDH[index] === undefined ? "" : validationMsgCT_DDH[ct.id].PHANTRAMKM} */}
                          {index === -1 ? "" : validationMsgCT_DDH[index].PHANTRAMKM}
                        </small>
                        {/* <small className="form-text text-danger">{validationMsgCT_DDH[index] === undefined ? "" : validationMsgCT_DDH[ct.id].PHANTRAMKM}</small> */}

                      </div>

                      <div className="col">
                        <button onClick={() => handleDeleteCT_DDH(ct)}
                          // hidden={checkAdd ? false : (ct.checkForAdd === true ? false : true)}
                          type="button" className="btn btn-danger">
                          <i className="fas fa-trash-alt"></i>&nbsp;Xóa
                        </button>
                      </div>
                    </div>
                  })
                }
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}


const mapStateToProps = (state) => ({
  employee: state.employee
})

const mapDispatchToProps = (dispatch) => {
  return ({
    onFetchEmployee: () => {
      dispatch(actFetchEmployeesRequest())
    },
    onAddPromotion: (promotion, history) => {
      dispatch(actAddPromotionRequest(promotion, history))
    },
    onUpdatePromotion: (promotion, history) => {
      dispatch(actUpdatePromotionRequest(promotion, history))
    },
    onDelDetailPromotion: (MA_KM, MA_DSP) => {
      return dispatch(actDeleteDetailPromotionReq(MA_KM, MA_DSP))
    }
  })
}


export default connect(mapStateToProps, mapDispatchToProps)(PromotionActionPage)




