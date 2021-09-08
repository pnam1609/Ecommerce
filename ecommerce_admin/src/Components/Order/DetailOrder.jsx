import React from 'react';
import ReactDOM from 'react-dom';
import NumberFormat from 'react-number-format';
import { formatDate } from './../../utils/formatDate';


const Modal = ({ isShowing, hide, item }) => isShowing ? ReactDOM.createPortal(
    <React.Fragment>
        <div className="modal fade bd-example-modal-lg"
            // nhớ phải thêm sự kiện onblur để ẩn k nó sẽ k xóa Portal cũ làm hiện lại Modal cũ chứ k hiện modal mới click
            tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" onBlur={hide}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="container mt-5 mb-5">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="text-left logo p-2 px-5"></div>
                                    <div className="invoice p-5">
                                        <h5>Chi tiết đơn đặt hàng</h5> <span className="font-weight-bold d-block mt-4">Chào, {item.HOTEN}</span> <span>Đơn hàng của bạn sẽ được giao vào ngày {formatDate(new Date(item.NGAYGIAO))}</span>
                                        <div className="payment border-top mt-3 mb-3 border-bottom table-responsive">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="py-2"> <span className="d-block text-muted">Ngày đặt</span> <span>{formatDate(new Date(item.NGAYDAT))}</span> </div>
                                                        </td>
                                                        <td>
                                                            <div className="py-2"> <span className="d-block text-muted">Mã đơn đặt hàng</span> <span>{item.ID_PHIEUDAT}</span> </div>
                                                        </td>
                                                        <td>
                                                            <div className="py-2"> <span className="d-block text-muted">Hình thức thành toán</span> <span><img src="https://img.icons8.com/color/48/000000/mastercard.png" width="20" alt="" /></span> </div>
                                                        </td>
                                                        <td>
                                                            <div className="py-2">
                                                                <span className="d-block text-muted">Trạng thái</span>
                                                                <span>
                                                                    {item.TRANGTHAI === 0 ? 'Chờ Xét Duyệt' : (item.TRANGTHAI === 1 ? 'Đang giao hàng' : (item.TRANGTHAI === 2 ? 'Giao hàng thành công' : 'Đã hủy'))}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <p style={{ marginLeft: 10 }}>Địa chỉ :&nbsp;&nbsp; {item.DIACHI}</p>
                                        </div>
                                        <div className="product border-bottom table-responsive">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    {item.CT_PD.map((ct, index) => {
                                                        return <tr key={index}>
                                                            <td width="60%"> <span className="font-weight-bold">{ct.TEN}</span>
                                                                <div className="product-qty"> <span className="d-block">Số lượng:&nbsp;{ct.SOLUONG}</span> <span>Dung tich:&nbsp;{ct.DUNGTICH}ml</span> </div>
                                                            </td>
                                                            <td width="20%">
                                                                <div className="text-right">
                                                                    <span className="font-weight-bold">
                                                                        <NumberFormat displayType={'text'} value={ct.GIA} suffix={'đ'} thousandSeparator={true} />
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row d-flex justify-content-end">
                                            <div className="col-md-5">
                                                <table className="table table-borderless">
                                                    <tbody className="totals">
                                                        <tr className="border-bottom">
                                                            <td>
                                                                <div className="text-left"> <span className="font-weight-bold">Tổng cộng</span> </div>
                                                            </td>
                                                            <td>
                                                                <div className="text-right">
                                                                    <span className="font-weight-bold">
                                                                        <NumberFormat value={item.TONGTIEN} displayType={'text'} suffix={'đ'} thousandSeparator={true} />
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <p>Chúng tôi sẽ gửi đơn đặt hàng của bạn qua Email !</p>
                                        <p className="font-weight-bold mb-0">Cảm ơn khi đã mua sắm ở website của chúng tôi!</p> <span>Perfume Team</span>
                                    </div>
                                    <div className="d-flex justify-content-between footer p-3"> <span>Need Help? visit our <a href="/#"> help center</a></span> <span>{formatDate(new Date(item.NGAYDAT))}</span> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;

export default Modal;