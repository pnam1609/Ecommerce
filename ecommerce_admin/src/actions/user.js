import * as Types from '../constants/UserTypes';
import callApi from './../utils/apiCaller';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenEmployee } from './getNV';

const MySwal = withReactContent(Swal)



export const actFetchUsersRequest = () => {
    return async (dispatch) => {
        return await callApi('User', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchUser(res.data));
        });
    }
}

export const actFetchUser = (User) => {
    return {
        type: Types.FETCH_USER,
        User
    }
}

export const actAddUserRequest = (User, history) => {
    return async () => {
        return await callApi('User', 'POST', User, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                // dispatch(actAddLineUser(res.data));
                history.goBack()
            }
            else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        });
    }
}

export const actUpdateUserRequest = (User, history) => {
    return async (dispatch) => {
        return await callApi(`User`, 'PUT', User, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                history.goBack()
                // dispatch(actUpdateLineUser(lineUser));
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        });
    }
}

export const actDeleteUserRequest = (MA_NV) => {
    return async (dispatch) => {
        return await callApi(`User/${MA_NV}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actDeleteUser(MA_NV));
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        });
    }
}
export const actDeleteUser = (MA_NV) => {
    return {
        type: Types.DELETE_USER,
        MA_NV
    }
}

