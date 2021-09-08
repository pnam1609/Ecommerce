import callApi from "../utils/apiCaller";

export const actSignUpReq = (user) => {
    return async () => {
        return await callApi('User', 'Post', user, null).then(res => {
            if(res.data.result === 1){
                return 1
            }else return res
        });
    }
}
