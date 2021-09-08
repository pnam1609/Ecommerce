import React, { useState } from 'react'

function NavigationSwitchPage(props) {
    var { entries } = props
    const [current, setcurrent] = useState(0)
    var pages = Math.floor((entries / 10) + 1)

    function renderSwitchpage() {
        var listSwitchPage = [];
        for (let index = 0; index < pages; index++) {
            if (index === current) {
                listSwitchPage[index] =
                    <li className="paginate_button page-item active" onClick={() => onsetPage(index)} key={index}>
                        <span aria-controls="dataTable" data-dt-idx={index + 1} tabIndex="0" className="page-link">
                            {index + 1}
                        </span>
                    </li>
            } else {
                listSwitchPage[index] =
                    <li className="paginate_button page-item" onClick={() => onsetPage(index)} key={index}>
                        <span aria-controls="dataTable" data-dt-idx={index + 1} tabIndex="0" className="page-link">
                            {index + 1}
                        </span>
                    </li>
            }
        }
        return listSwitchPage
    }

    function onsetPage(p) {
        setcurrent(p)
        props.onReceivePage(p + 1);
    }
    function renderNotiEntries(){
        if(entries.length === 0 ) return "Không có đơn đặt hàng nào"
        else if (entries < 10) return `Hiện 1 đến ${entries} của ${entries} đơn đặt hàng`
        else return `Hiện 1 đến 10 của ${props.entries} đơn đặt hàng`
    }
    

    return (
        <div className="row">
            <div className="col-sm-12 col-md-5">
                <div className="dataTables_info" id="dataTable_info" role="status" aria-live="polite">
                    {renderNotiEntries()}
                </div>
            </div>
            <div className="col-sm-12 col-md-7 d-flex justify-content-end">
                <div className="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">
                    <ul className="pagination">
                        <li className="paginate_button page-item previous disabled" id="dataTable_previous"><a href="/#" aria-controls="dataTable" data-dt-idx="0" tabIndex="0" className="page-link">Previous</a></li>
                        {/* <li className="paginate_button page-item active" onClick = {()=> onsetPage(1)}><span aria-controls="dataTable" data-dt-idx="1" tabIndex="0" className="page-link">1</span></li> */}

                        {/* render ra listpage để chuyển trang trừ ra trang đầu tiên đã active */}
                        {renderSwitchpage()}


                        <li className="paginate_button page-item next" id="dataTable_next"><a href="/#" aria-controls="dataTable" data-dt-idx={pages + 1} tabIndex="0" className="page-link">Next</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavigationSwitchPage
