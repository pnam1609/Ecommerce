import * as Types from '../constants/EmployeeTypes';
import callApi from './../utils/apiCaller';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getTokenEmployee } from './getNV';

const MySwal = withReactContent(Swal)



export const actFetchEmployeesRequest = () => {
    return async (dispatch) => {
        return await callApi('Employee', 'GET', null, `Bearer ${getTokenEmployee()}`).then(res => {
            dispatch(actFetchEmployee(res.data));
        });
    }
}

export const actFetchEmployee = (employee) => {
    return {
        type: Types.FETCH_EMPLOYEE,
        employee
    }
}

export const actAddemployeeRequest = (employee, history) => {
    return async () => {
        return await callApi('Employee', 'POST', employee, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                // dispatch(actAddLineemployee(res.data));
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

export const actUpdateemployeeRequest = (employee, history) => {
    return async (dispatch) => {
        return await callApi(`Employee`, 'PUT', employee, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                history.goBack()
                // dispatch(actUpdateLineemployee(lineemployee));
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

export const actDeleteemployeeRequest = (MA_NV) => {
    return async (dispatch) => {
        return await callApi(`Employee/${MA_NV}`, 'DELETE', null, `Bearer ${getTokenEmployee()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(actDeleteemployee(MA_NV));
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
export const actDeleteemployee = (MA_NV) => {
    return {
        type: Types.DELETE_EMPLOYEE,
        MA_NV
    }
}

