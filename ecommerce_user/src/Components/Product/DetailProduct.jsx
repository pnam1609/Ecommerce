import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { connect } from 'react-redux'
import callApi from './../../utils/apiCaller'
import isEmpty from "validator/lib/isEmpty"
import { actAddToCart } from '../../actions/cart'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'

const DetailProduct = ({ match, onAddtoCart }) => {
    let history = useHistory()
    const MySwal = withReactContent(Swal)

    const [validationMsg, setvalidationMsg] = useState('')
    const [detail, setDetail] = useState(null)
    const [masp, setMasp] = useState("")
    const [soluong, setSoluong] = useState(1)
    const [price, setPrice] = useState('')

    useEffect(() => {
        if (detail == null) {
            (async () => {
                let detailProduct = await callApi(`DisplayLP/${match.params.id}`, 'GET', null, null).then(res => {
                    return res.data
                });

                setDetail(detailProduct)
                setPrice(detailProduct.SanPhams[0].GIA)// lấy ra giá lần đầu để hiển thị 
                setMasp(detailProduct.SanPhams[0].MA_SP)// lấy ra mã sản phẩm đầu tiên để có thể add to cart
            })()
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleChangeCapacity(e, sp) {
        setMasp(e.target.value)
        setPrice(sp.GIA)
    }

    const validateAll = () => {
        const msg = {}
        var sp = detail.SanPhams.find(x => x.MA_SP === masp)
        if (isEmpty(masp)) {
            msg.DUNGTICH = "Vui lòng chọn dung tích của sản phẩm"
        }

        if (isEmpty(soluong.toString())) {
            msg.SOLUONG = "Vui lòng chọn số lượng"
        }
        else if (soluong <= 0) {
            msg.SOLUONG = "Số lượng phải lớn hơn 0"
        } else if (soluong > sp.SOLUONGTON) {
            msg.SOLUONG = `Số lượng còn lại là ${sp.SOLUONGTON} Vui lòng chọn bằng hoặc ít hơn`
        }


        setvalidationMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    };


    function handleAddTocart() {
        var user = localStorage.getItem('user')
        if (user === null) {
            history.push('/signin')
        } else {
            const isValid = validateAll()
            if (isValid) {
                var sp = detail.SanPhams.find(x => x.MA_SP === masp)
                var SanPhams = {
                    ...detail,
                    SanPhams: sp
                }
                onAddtoCart(SanPhams, soluong)

                MySwal.fire({
                    icon: 'success',
                    title: 'Thêm sản phẩm vào giỏ hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

    }
    function displayPrice(detail) {
        if (detail !== null) {
            if (detail.CT_KM !== null) {
                return <>
                    <small><del><NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price} /></del></small>&nbsp;&nbsp;
                    <NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price * (100 - detail.CT_KM.PHANTRAMKM) / 100} />&nbsp;&nbsp;&nbsp;
                    <small className="bg-danger" style={{ color: 'white', paddingInline: 6, fontSize: 14 }}>{detail.CT_KM.PHANTRAMKM}% Giảm</small>
                </>
            } else {
                return <NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price} />
            }
        }
    }

    return (
        <>
            <section className="section-pagetop bg-dark">
                <div className="container clearfix">
                    <h2 className="title-page">Chi tiết của sản phẩm</h2>
                </div>
            </section>
            <section className="section-content bg padding-y border-top">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="row no-gutters">
                                    <aside className="col-sm-5 border-right">
                                        <article className="gallery-wrap">
                                            <div className="img-big-wrap">
                                                <div>

                                                    <a href="images/items/1.jpg" data-fancybox=""><img src={detail === null ? "" : detail.HINHANH} alt="" /></a>
                                                </div>
                                            </div>
                                            {/* <div className="img-small-wrap">
                                                <div className="item-gallery"> <img src="images/items/1.jpg" alt="" /></div>
                                                <div className="item-gallery"> <img src="images/items/2.jpg" alt="" /></div>
                                                <div className="item-gallery"> <img src="images/items/3.jpg" alt="" /></div>
                                                <div className="item-gallery"> <img src="images/items/4.jpg" alt="" /></div>
                                            </div> */}
                                        </article>
                                    </aside>
                                    <aside className="col-sm-7">
                                        <article className="p-5">
                                            <h3 className="title mb-3">{detail === null ? "" : detail.TEN}</h3>

                                            <div className="mb-3">
                                                <var className="price h3 text-warning">

                                                    {/* {
                                                        detail.CT_KM !== null ?
                                                            <small><del><NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price} /></del></small> : ""
                                                    }&nbsp;&nbsp;
                                                    {
                                                        detail.CT_KM !== null ?
                                                            <NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price * (100 - detail.CT_KM.PHANTRAMKM) / 100} /> :
                                                            <NumberFormat displayType={'text'} suffix='đ' thousandSeparator={true} value={price} />
                                                    }&nbsp;&nbsp;&nbsp; */}
                                                    {/* <small className="bg-danger h6" style={{ color: 'white', padding: 5 }}>{detail.CT_KM.PHANTRAMKM}% Giảm</small> */}
                                                    {displayPrice(detail)}
                                                </var>
                                            </div>
                                            {/* <dl>
                                                {detail === null ? "" :
                                                    <>
                                                        <dt>Mô tả</dt>
                                                        <dd>
                                                            <p>{detail.MOTA}</p>
                                                        </dd>
                                                    </>
                                                }

                                            </dl> */}
                                            <dl className="row">
                                                <dt className="col-sm-6">Sản phầm dành cho: </dt>
                                                <dd className="col-sm-6">{detail === null ? "" : detail.GIOTINH === true ? "Nam" : "Nữ"}</dd>

                                                <dt className="col-sm-6">Xuất xứ</dt>
                                                <dd className="col-sm-6">{detail === null ? "" : detail.XUATXU}</dd>

                                                <dt className="col-sm-6">Độ lưu hương</dt>
                                                <dd className="col-sm-6">{detail === null ? "" : detail.DOLUUHUONG}</dd>

                                                <dt className="col-sm-6">Hãng</dt>
                                                <dd className="col-sm-6">{detail === null ? "" : detail.HANG.TENHANG}</dd>
                                            </dl>
                                            <hr />
                                            <div className="row">
                                                <dl className="dlist-inline">
                                                    <dt className="col-sm-6">Quantity: </dt>
                                                    <dd className="col-sm-6">
                                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                            value={soluong}
                                                            onChange={e => setSoluong(e.target.value)}></input>

                                                    </dd>
                                                </dl>
                                                <small className="form-text text-danger">{validationMsg.SOLUONG}</small>
                                            </div>
                                            <dl className="dlist-inline row" style={{ marginTop: 20 }}>
                                                <dt className="col-sm-3">Dung tích: </dt>
                                                <dd className="col-sm-9 d-flex">
                                                    {detail === null ? "" : detail.SanPhams.map((sp, index) => {
                                                        return <label key={index} className="form-check form-check-inline" style={{ marginLeft: 30 }}>
                                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                                                defaultChecked={index === 0 ? true : false}
                                                                value={sp.MA_SP} onChange={e => handleChangeCapacity(e, sp)} />
                                                            <span className="form-check-label">{sp.DUNGTICH}&nbsp;ml</span>
                                                        </label>
                                                    })}
                                                    <small className="form-text text-danger">{validationMsg.DUNGTICH}</small>
                                                </dd>
                                            </dl>
                                            <hr />
                                            <button onClick={() => handleAddTocart()} className="btn  btn-outline-primary"> <i className="fas fa-shopping-cart"></i> Add to cart </button>
                                        </article>
                                    </aside>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-12">
                            <article className="card mt-4">
                                <div className="card-body">
                                    <h4>Mô tả</h4>
                                    <p>Nước Hoa Versace Eros 5ml Nam là chai nước hoa Nam nguồn cảm hứng từ vị thần tình yêu trong thần thoại Hy Lạp. Chai Versace Eros 5ml cho nam là biểu tượng cho thần tình yêu Hy Lạp, đại diện của tình yêu, là trung tâm của các hương thơm, là sự kết hợp và thể hiện của niềm đam mê vô tận và ham muốn mãnh liệt.</p>
                                    <p> Những chai nước hoa của Versace được lấy cảm hứng và kết nối sâu sắc từ thần thoại Hy Lạp. Versace Eros mang một hương vị nam tính đầy mạnh mẽ thể hiện sự cuốn hút và gợi cảm của nam giới.</p>
                                    <p>Hãng Versace đã cho thiết kế chai xanh ngọc trong suốt đầy ấn tượng, Nước hoa Versace Eros 5ml ẩn giấu hương thơm mạnh mẽ, cá tính pha chút nồng ấm của gỗ Phương Đông.</p>
                                    <p>Chuyên gia Aurelien Guichard, ông đã đem hương vị phương Đông kết hợp với cảm hứng thần thoại Hy Lạp để tạo ra sản phẩm chai Versace Eros for men 5ml.</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return ({
        onAddtoCart: (product, quantity) => {
            dispatch(actAddToCart(product, quantity))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
