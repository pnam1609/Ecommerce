import jwt_decode from "jwt-decode";


export const getKh = (history)=>{
    let data = JSON.parse(localStorage.getItem("user"))
    if (data != null) {
        let decodedToken = jwt_decode(data.token)
        let currentDate = new Date();

        // JWT exp is in seconds
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            console.log("Token expired.");
            history.push("/signin")
            localStorage.removeItem("CART")
            localStorage.removeItem('user')
        } else {
            return decodedToken
        }
    }
    return null
}

export const getTokenUser = ()=>{
    return JSON.parse(localStorage.getItem("user")).token
}
