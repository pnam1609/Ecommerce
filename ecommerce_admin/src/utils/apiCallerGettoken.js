import axios from "axios";

export default function callApiForPaypalGetToken(endpoint, method = 'POST') {
    return axios({
        method,
        url: `https://api-m.sandbox.paypal.com/${endpoint}`,
        data: {
            grant_type: "client_credentials"
        },
        headers: {
            Accept: "application/json",
            Authorization: btoa(process.env.REACT_APP_CLIENT_ID + ":" + process.env.REACT_APP_SECRET)
        },
        // auth: {
        //     username: process.env.REACT_APP_CLIENT_ID,
        //     password: process.env.REACT_APP_SECRET
        // }
    }).catch(err => {
        console.log(err);
    });
}