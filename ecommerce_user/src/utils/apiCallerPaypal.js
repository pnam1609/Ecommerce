import axios from "axios";
import qs from 'qs'


export default function callApiForPaypal(endpoint, method = 'GET', body, token = null) {
    // return axios({
    //     method,
    //     url: `https://api-m.sandbox.paypal.com/${endpoint}`,
    //     data: body,
    //     headers: {
    //         Authorization: token,
    //         Accept: "application/json"
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });

    return axios.request({
        url: endpoint,
        method: method,
        baseURL: "https://api-m.sandbox.paypal.com/",
        auth: {
            username: process.env.REACT_APP_CLIENT_ID,
            password: process.env.REACT_APP_SECRET
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: qs.stringify({
            "grant_type": "client_credentials"
        })
    }).catch(err => console.log(err));
}

// export default function callApiForPaypal(endpoint, method = 'GET', body, token = null) {
//     return axios({
//         method,
//         url: `https://api-m.sandbox.paypal.com/${endpoint}`,
//         data: body,
//         headers: {
//             Authorization: token,
//             Accept: "application/json"
//         }
//     }).catch(err => {
//         console.log(err);
//     });
// }