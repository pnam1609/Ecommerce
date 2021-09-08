import React, { useEffect, useState } from "react";
import SideBar from "../../Components/Bar/SideBar";
import TopBar from "../../Components/Bar/TopBar";
import { Bar } from 'react-chartjs-2';
import callApi from "../../utils/apiCaller";
import { getTokenEmployee } from "../../actions/getNV";

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
}


export default function App() {
    const [year, setYear] = useState(2021)
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

    const [revenue, setRevenue] = useState('')
    const [data, setData] = useState({})

    useEffect(() => {
        (async () => {
            let statistic = await callApi(`Statistic?Year=${year}`, 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
                return res.data
            });
            setRevenue(statistic)
        })()// eslint-disable-next-line
    }, [year])

    useEffect(() => {
        if (revenue !== '' && revenue.length !== 0) {
            var color = []
            for (let index = 0; index < revenue.length; index++) {
                color.push(`${random_rgba()}`)
            }
            setData({
                labels: months.splice(0, revenue.length),
                datasets: [{
                    label: 'Doanh thu',
                    data: revenue,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                }]
            })
        }// eslint-disable-next-line
    }, [revenue])

    return (
        <div id="wrapper">
            <SideBar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopBar />
                    <div className="py-3 mb-20" >
                        <h3 className="m-0 font-weight-bold text-primary" style={{ textAlign: 'center' }}>
                            Thống kê doanh thu
                        </h3>
                    </div>
                    <div className="d-flex justify-content-end" style={{marginRight: 50}}>
                        <label htmlFor="">Năm:&nbsp;&nbsp;</label>
                        <select name="dataTable_length" aria-controls="dataTable"
                            onChange={e => setYear(parseInt(e.target.value))}
                            value={year}
                            className="custom-select custom-select-sm form-control form-control-sm"
                            style={{ width: 150 }}>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                        </select>
                    </div>
                    {/* <Line data={data} style={{ padding: 50 }} /> */}
                    <Bar data={data} options={options} style={{ padding: 50 }} />
                    <p className="text-center text-danger" style={{fontSize: 22}}>Biểu đồ thống kê doanh thu năm {year}</p>
                </div>
            </div>
        </div>
    );
}
