import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actFetchshipperReq } from '../../actions/shipper'
import NavigationSwitchPage from '../Navigation/NavigationSwitchPage'
import ShipperItem from './ShipperItem'

export const Shipper = ({ onFetchShipper, Shipper }) => {

    const [pages, setpages] = useState(1)
    const [filter, setfilter] = useState("")


    function filterShipper(list, value) {
        if (value === null || value === undefined) return list
        else {
            list = list.filter(params => {
                return params.MA_NVGH.toLowerCase().indexOf(value.toLowerCase()) !== -1
                    || params.HOTEN.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1

            })
            return list
        }
    }

    useEffect(() => {
        // phải dung asyn vì nó sẽ fetch ra lise line Shipper k kịp dẫn tới lấy state cũ 
        //vì state mới chưa kịp thay đổi do dang trong thời gian fetch
        async function fectchShipper() {
            await onFetchShipper()
        }
        fectchShipper()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    Shipper = filterShipper(Shipper, filter)

    var ShipperList = Shipper.map((linepro, index) => {
        if (index >= (pages - 1) * 10 && index < pages * 10) {
            return <ShipperItem item={linepro} key={index} />
        }
        return null
    })

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Nhân viên giao hàng</h1>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Dữ liệu bảng</h6>
                    <div className="row">
                        <div className="col-xl-12 d-flex justify-content-end" >
                            <Link to="/addShipper">
                                <button type="button" className="btn btn-success " style={{ marginRight: 25, marginBottom: 5 }}>Thêm</button>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6" >
                            <div className="dataTables_length" id="dataTable_length">
                                <label className="d-flex flex-row" >
                                    <span className="px-2">Hiện</span>
                                    <span>
                                        <select name="dataTable_length" aria-controls="dataTable" className="custom-select custom-select-sm form-control form-control-sm">
                                            <option value="10">10</option>
                                            {/* <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option> */}
                                        </select>
                                    </span>
                                    <span className="px-2">Nhân viên giao hàng</span>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="container">
                                <div id="dataTable_filter" className="dataTables_filter">
                                    <label className="d-flex flex-row">
                                        <div className="px-2">Search:</div>
                                        <input type="search" className="form-control form-control-sm" aria-controls="dataTable" placeholder="" onChange={(e) => setfilter(e.target.value)} />
                                    </label>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th className="col-md-1">Mã NVGH</th>
                                    <th className="col-md-2">Họ và tên</th>
                                    <th className="col-md-2">Ngày sinh</th>
                                    <th className="col-md-2">Số điện thoại</th>
                                    <th className="col-md-2">Email</th>
                                    <th className="col-md-2">Mã CTVC</th>
                                    <th className="col-md-1">Action</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th className="col-md-1">Mã NVGH</th>
                                    <th className="col-md-2">Họ và tên</th>
                                    <th className="col-md-2">Ngày sinh</th>
                                    <th className="col-md-2">Số điện thoại</th>
                                    <th className="col-md-2">Email</th>
                                    <th className="col-md-2">Mã CTVC</th>
                                    <th className="col-md-1">Action</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                {ShipperList}
                            </tbody>
                        </table>
                        <NavigationSwitchPage entries={Shipper.length} onReceivePage={p => setpages(p)} />
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = (state) => ({
    Shipper: state.shipper
})

const mapDispatchToProps = (dispatch) => {
    return ({
        onFetchShipper: () => {
            dispatch(actFetchshipperReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipper)
