import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'validator/lib/isEmpty';
import SideBar from '../../Components/Bar/SideBar';
import TopBar from '../../Components/Bar/TopBar';
import callApi from '../../utils/apiCaller';
import { actFetchBrandsRequest } from './../../actions/brand'
import { actAddLineProductRequest, actDeleteProductRequest, actUpdateLineProductRequest } from './../../actions/index'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactDatePicker from 'react-datepicker';
import { getTokenEmployee } from './../../actions/getNV'
import { v4 as uuidv4 } from 'uuid'
import NumberFormat from 'react-number-format';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const MySwal = withReactContent(Swal)

export const LineProductActionPage = ({ brand, match, onFetchBrand, onAddLineProduct, history, onUpdateLineProduct, onDeleteProduct }) => {
  //state check kiểm tra là thêm hay sửa
  const [checkAdd, setcheckAdd] = useState(true)

  const [validationMsg, setvalidationMsg] = useState('')
  const [validationMsgCT_DDH, setvalidationMsgCT_DDH] = useState([])
  const [value, setValue] = useState({
    MA_DSP: '',
    TEN: '',
    GIOITINH: "",
    DOLUUHUONG: "",
    XUATXU: "",
    HINHANH: "",
    MA_HANG: "",
    MOTA: "",
    checkForAdd: true,
    SanPhams: [
      {
        id: uuidv4(),
        MA_SP: "",
        SOLUONGTON: "",
        GIA: "",
        DUNGTICH: "",
        THAYDOIGIAs: {
          MA_SP: '',
          GIA: '',
          NGAY: new Date()
        }
      }
    ]
  })

  useEffect(() => {
    (async () => {
      await onFetchBrand()
      if (match === undefined) {
        setcheckAdd(true)
      } else {
        setcheckAdd(false)
        var OrderSupplyDetail = await callApi(`LinePerfume/${match.params.id}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
          return res.data
        });
        console.log(OrderSupplyDetail)
        setValue({
          ...OrderSupplyDetail,
          MA_HANG: OrderSupplyDetail.HANG.MA_HANG
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChangeCT_DDH(e, id) {
    var CT_Update = value.SanPhams.find(CT_DDH => CT_DDH.id === id)

    if (e.target.name === "SOLUONGTON") CT_Update.SOLUONGTON = e.target.value
    else if (e.target.name === "DUNGTICH") CT_Update.DUNGTICH = e.target.value
    // else CT_Update.GIA = e.target.value
    setValue({
      ...value
    })
  }
  function handleChangeThayDoiGia(e, id) {
    var CT_Update = value.SanPhams.find(CT_DDH => CT_DDH.id === id)

    // vì datepicker k có event chỉ nhận vào 1 tham số là ngày pick
    if (e.target === undefined) {
      CT_Update.THAYDOIGIAs.NGAY = new Date(e)
    } else {
      if (e.target.name === "MA_SP") {
        CT_Update.MA_SP = e.target.value
        CT_Update.THAYDOIGIAs.MA_SP = e.target.value
      } else {
        CT_Update.GIA = e.target.value
        CT_Update.THAYDOIGIAs.GIA = e.target.value
      }
    }

    setValue({ ...value })
  }

  function handleAddDetailDDH(e) {
    setValue({
      ...value,
      SanPhams: [
        ...value.SanPhams,
        {
          id: uuidv4(),
          MA_SP: "",
          SOLUONGTON: "",
          GIA: "",
          DUNGTICH: "",
          checkForAdd: true,
          THAYDOIGIAs: {
            MA_SP: '',
            GIA: '',
            NGAY: new Date(),
          }
        }
      ]
    })
  }

  const validateAll = () => {
    const msg = {}
    const msgCTKM = []
    setvalidationMsgCT_DDH([])

    if (isEmpty(value.MA_DSP)) {
      msg.MA_DSP = "Trường này không được để trống"
    } else if (value.MA_DSP.length > 10) {
      msg.MA_DSP = "Mã đơn đặt không được dài hơn 10 kí tự"
    }

    if (isEmpty(value.TEN)) {
      msg.TEN = "Trường này không được để trống"
    }

    if (isEmpty(value.GIOITINH.toString())) {
      msg.GIOITINH = "Trường này không được để trống"
    }

    if (isEmpty(value.DOLUUHUONG)) {
      msg.DOLUUHUONG = "Trường này không được để trống"
    }

    if (isEmpty(value.XUATXU)) {
      msg.XUATXU = "Trường này không được để trống"
    }

    if (isEmpty(value.HINHANH)) {
      msg.HINHANH = "Trường này không được để trống"
    }

    value.SanPhams.forEach((element, index) => {
      const validateDetailPromotion = {}
      validateDetailPromotion.id = element.id
      if (isEmpty(element.MA_SP)) {
        validateDetailPromotion.MA_SP = "Trường này không được để trống"
      } else if (element.MA_SP.length > 10) {
        validateDetailPromotion.MA_SP = "Mã sản phẩm phải ít hơn 10 kí tự"
      }

      if (isEmpty(element.SOLUONGTON.toString())) {
        validateDetailPromotion.SOLUONGTON = "Trường này không được để trống"
      } else if (element.SOLUONGTON < 0) {
        validateDetailPromotion.SOLUONGTON = "Số lượng không thể là số âm"
      }

      if (isEmpty(element.DUNGTICH.toString())) {
        validateDetailPromotion.DUNGTICH = "Trường này không được để trống"
      } else if (element.DUNGTICH <= 0) {
        validateDetailPromotion.DUNGTICH = "Dung tích phải lớn hơn 0"
      }

      if (isEmpty(element.GIA.toString())) {
        validateDetailPromotion.GIA = "Trường này không được để trống"
      } else if (element.GIA <= 0) {
        validateDetailPromotion.GIA = "Giá phải lớn hơn 0"
      }


      if (Object.keys(validateDetailPromotion).length > 1) {
        msgCTKM.push(validateDetailPromotion)
      }
    });

    setvalidationMsg(msg)
    setvalidationMsgCT_DDH(msgCTKM)
    if (Object.keys(msg).length > 0 || msgCTKM.length > 0) return false
    return true
  }

  async function handleDeleteCT_DDH(ct) {
    if (checkAdd || ct.checkForAdd) {// xử lí trường hợp xóa các sản phẩm khi thêm dòng sản phẩm hoặc khi sửa dòng sản phẩm nhưng thêm mới
      let index = value.SanPhams.findIndex(sp => sp.id === ct.id)// đây chỉ là phần xóa ở giao diện
      value.SanPhams.splice(index, 1)
      setValue({ ...value })
    } else {// xử lí trường hợp xóa các sản phẩm khi Sửa dòng sản phẩm
      let res = await onDeleteProduct(ct.MA_SP)
      if (res.result === 1) {
        let index = value.SanPhams.findIndex(sp => sp.id === ct.id)
        value.SanPhams.splice(index, 1)
        MySwal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        })
        setValue({ ...value })
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    }
  }

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const uniqueValues = new Set(value.SanPhams.map(v => v.MA_SP.trim()));
    if (uniqueValues.size < value.SanPhams.length) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Mã sản phẩm không được trùng nhau"
      })
      return
    }
    // console.log(value);
    value.SanPhams.forEach(sp => {
      if (typeof sp.GIA != 'number') {
        let price = parseInt(sp.GIA.replaceAll(/,/g, ""))
        sp.GIA = price
        sp.THAYDOIGIAs.GIA = price
      }
    })
    console.log(value);
    const isValid = validateAll()
    //validate
    // if (isValid) {
    //   if (checkAdd) {
    //     if (value.SanPhams.length === 0) {
    //       MySwal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: "Khi thêm dòng sản phẩm cần ít nhất 1 sản phẩm"
    //       })
    //       return
    //     }
    //     onAddLineProduct(value, history)
    //   }
    //   else {
    //     onUpdateLineProduct(value, history)
    //   }
    // }
  }
  // console.log(value)
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
                {checkAdd ? "Thêm dòng sản phẩm" : "Sửa dòng sản phẩm"}
              </h3>
            </div>


            <form onSubmit={e => handleSubmit(e)} style={{ marginBottom: 200 }}>
              {/* Mã dòng sản phẩm  */}
              <div className="form-group">
                <label className="control-label" htmlFor="MA_DSP">Mã Dòng sản phẩm(<small className="text-danger">*</small>)</label>
                <input id="MA_DSP" onChange={checkAdd ? e => setValue({ ...value, MA_DSP: e.target.value }) : null} readOnly={checkAdd ? '' : 'readOnly'}
                  value={value.MA_DSP} name="MA_DSP" placeholder="Mã Dòng sản phẩm" className="form-control input-md" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.MA_DSP}</small>
              </div>

              {/* Tên */}
              <div className="form-group">
                <label className=" control-label" htmlFor="TEN">Tên(<small className="text-danger">*</small>)</label>
                <input id="TEN" onChange={e => setValue({ ...value, TEN: e.target.value })} value={value.TEN} name="TEN" placeholder="Tên sản phẩm" className="form-control input-md" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.TEN}</small>
              </div>

              {/* Giới tính */}
              <div className="form-group" >
                <label className=" control-label" htmlFor="TEN">Giới tính của sản phẩm(<small className="text-danger">*</small>)</label>
                <div className="" >
                  <div className="htmlForm-check htmlForm-check-inline">
                    <input className="htmlForm-check-input" type="radio"
                      onChange={e => setValue({ ...value, GIOITINH: e.target.value })}
                      checked={value.GIOITINH === '' ? false : (value.GIOITINH.toString() === "true" ? true : false)}
                      name="inlineRadioOptions" id="inlineRadio1" value={true} />
                    <label className="htmlForm-check-label" htmlFor="inlineRadio1">Nam</label>
                  </div>
                  <div className="htmlForm-check htmlForm-check-inline">
                    <input className="htmlForm-check-input" type="radio"
                      onChange={e => setValue({ ...value, GIOITINH: e.target.value })}
                      checked={value.GIOITINH === '' ? false : (value.GIOITINH.toString() === "true" ? false : true)}
                      name="inlineRadioOptions" id="inlineRadio2" value={false} />
                    <label className="htmlForm-check-label" htmlFor="inlineRadio2">Nữ</label>
                  </div>
                  <small className="form-text text-danger">{validationMsg.GIOITINH}</small>
                </div>
              </div>

              {/* hãng */}
              <div className="form-group">
                <label className=" control-label" htmlFor="TEN">Hãng(<small className="text-danger">*</small>)</label>
                <select value={value.MA_HANG} onChange={e => setValue({ ...value, MA_HANG: e.target.value })}
                  className="form-control" aria-label="Default select example" name="MA_HANG">
                  {
                    brand.map((bra, index) => {
                      return <option value={bra.MA_HANG} defaultValue={bra.MA_HANG.trim() === value.MA_HANG ? "defaultValue" : ""} key={index}>{bra.TENHANG}</option>
                    })
                  }
                </select>
                <small className="form-text text-danger">{validationMsg.MA_HANG}</small>
              </div>

              {/* Độ lưu hương */}
              <div className="form-group">
                <label value={value.DOLUUHUONG} className=" control-label" htmlFor="XUATXU">Độ lưu hương(<small className="text-danger">*</small>)</label>
                <input id="DOLUUHUONG" onChange={e => setValue({ ...value, DOLUUHUONG: e.target.value })} value={value.DOLUUHUONG} name="DOLUUHUONG" placeholder="Độ lưu hương" className="form-control" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.DOLUUHUONG}</small>
              </div>

              {/* Xuất xứ */}
              <div className="form-group">
                <label value={value.XUATXU} className=" control-label" htmlFor="XUATXU">Xuất xứ(<small className="text-danger">*</small>)</label>
                <input id="XUATXU" onChange={e => setValue({ ...value, XUATXU: e.target.value })} value={value.XUATXU} name="XUATXU" placeholder="Xuất xứ" className="form-control" required="" type="text" />
                <small className="form-text text-danger">{validationMsg.XUATXU}</small>
              </div>
              {/* Mô tả */}
              <div className="form-group">
                <label value={value.MOTA} className=" control-label" htmlFor="MOTA">Mô Tả</label>
                <textarea onChange={e => setValue({ ...value, MOTA: e.target.value })} value={value.MOTA} className="form-control" id="MOTA" name="MOTA"></textarea>
                {/* <CKEditor
                  editor={ClassicEditor}
                  data={value.MOTA}
                  className="form-control" id="MOTA" name="MOTA"
                  onChange={(e, editor) => setValue({ ...value, MOTA: editor.getData()})}
                /> */}
              </div>
              {/* hình ảnh */}
              <div className="form-group">
                <label className=" control-label" htmlFor="HINHANH">Hình ảnh(<small className="text-danger">*</small>)</label>
                {/* <FileBase type="file" multiple={false} onDone={({base64}) => setHINHANH({HINHANH, selectedFile: base64})}/> */}
                <input id="HINHANH" onChange={async (e) => setValue({ ...value, HINHANH: await toBase64(e.target.files[0]) })}
                  name="HINHANH" className="form-control-file" type="file" />
                <small className="form-text text-danger">{validationMsg.HINHANH}</small>
              </div>


              <hr />
              <h5>Các sản phẩm</h5>
              <button onClick={e => handleAddDetailDDH(e)}
                hidden={checkAdd ? false : true}
                type="button" className="btn btn-info d-flex" >
                <i className="fas fa-plus-square"></i>&nbsp;Thêm
              </button>
              <div className="row" style={{ marginTop: 10 }}>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Mã Sản phẩm(<small className="text-danger">*</small>)</label></div>
                <div className="col"> <label htmlFor="exampleFormControlSelect1">Số lượng(<small className="text-danger">*</small>)</label></div>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Giá(<small className="text-danger">*</small>)</label> </div>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Dung tích(<small className="text-danger">*</small>)</label> </div>
                <div className="col"><label htmlFor="exampleFormControlSelect1">Ngày đổi giá(<small className="text-danger">*</small>)</label> </div>
                <div className="col">
                  <label htmlFor="exampleFormControlSelect1">Action</label>
                </div>
              </div>

              {value.SanPhams.map((ct, i) => {

                let index = validationMsgCT_DDH.findIndex(x => x.id === ct.id)

                return <div key={i} className="row" style={{ marginBottom: 15 }}>
                  <div className="col">
                    <input type="text"
                      value={ct.MA_SP}
                      onChange={e => handleChangeThayDoiGia(e, ct.id)}
                      name="MA_SP"
                      className="form-control" placeholder="Mã sản phẩm"
                      disabled={checkAdd ? false : (ct.checkForAdd === true ? false : true)} />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].MA_SP}
                      {/* {validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].MA_SP} */}
                    </small>
                  </div>
                  <div className="col">
                    <input type="number"
                      value={ct.SOLUONGTON}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="SOLUONGTON"
                      className="form-control" placeholder="Số lượng" />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].SOLUONGTON}
                      {/* {validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].SOLUONGTON} */}
                    </small>
                  </div>
                  <div className="col">
                    {/* <input type="number"
                      value={ct.GIA}
                      onChange={e => handleChangeThayDoiGia(e, ct.id)}
                      name="GIA"
                      className="form-control" placeholder="Giá" /> */}
                    <NumberFormat className="form-control" value={ct.GIA} onChange={e => handleChangeThayDoiGia(e, ct.id)}
                      name="GIA" placeholder="Giá" thousandSeparator={true} />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].GIA}
                      {/* {validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].GIA} */}
                    </small>
                  </div>
                  <div className="col">
                    <input type="number"
                      value={ct.DUNGTICH}
                      onChange={e => handleChangeCT_DDH(e, ct.id)}
                      name="DUNGTICH"
                      className="form-control" placeholder="Số lượng" />
                    <small className="form-text text-danger">
                      {index === -1 ? "" : validationMsgCT_DDH[index].DUNGTICH}
                      {/* {validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].DUNGTICH} */}
                    </small>
                  </div>
                  <div className="col">
                    <ReactDatePicker
                      selected={new Date(ct.THAYDOIGIAs.NGAY)}
                      name="NGAY"
                      className="form-control"
                      onChange={e => handleChangeThayDoiGia(e, ct.id)} //only when value has changed
                    />
                    <small className="form-text text-danger">
                      {/* {index === -1 ? "" : validationMsgCT_DDH[index].DUNGTICH}
                        {validationMsgCT_DDH[ct.id] === undefined ? "" : validationMsgCT_DDH[ct.id].DUNGTICH} */}
                    </small>
                  </div>

                  <div className="col">
                    <button onClick={() => handleDeleteCT_DDH(ct)}
                      // hidden={checkAdd ? false : (ct.checkForAdd === true ? false : true)}
                      type="button" className="btn btn-danger">
                      <i className="fas fa-trash-alt"></i>&nbsp;Xóa
                    </button>
                  </div>
                </div>
              })}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

const mapStateToProps = (state) => ({
  brand: state.brand,
  detail: state.detail
})

const mapDispatchToProps = (dispatch) => {
  return ({
    onFetchBrand: () => {
      dispatch(actFetchBrandsRequest())
    },
    onAddLineProduct: (line_product, history) => {
      dispatch(actAddLineProductRequest(line_product, history))
    },
    onUpdateLineProduct: (line_product, history) => {
      dispatch(actUpdateLineProductRequest(line_product, history))
    },
    onDeleteProduct: (MA_SP) => {
      return dispatch(actDeleteProductRequest(MA_SP))// xoá sản phẩm khi thêm hoặc sửa 1 dòng sản phẩm
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(LineProductActionPage)


