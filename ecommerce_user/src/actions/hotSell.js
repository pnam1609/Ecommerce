import * as Types from '../constants/HotSellTypes';
import callApi from "../utils/apiCaller";

export const actFetchHotSellReq = () => {
    return (dispatch) => {
        return callApi('HotSell', 'GET', null, null).then(res => {
            dispatch(actFetchHotSell(res.data));
        });
    }
}

export const actFetchHotSell = (hotSell) => {
    return {
        type: Types.FETCH_HOT_SELL,
        hotSell
    }
}