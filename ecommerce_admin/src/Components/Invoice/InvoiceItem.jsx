import React from 'react'
import NumberFormat from 'react-number-format'
import { formatDate } from '../../utils/formatDate';
import useModal from '../ToggleModal/useModal';
import DetaiInvoice from './DetaiInvoice'

export const InvoiceItem = ({ item }) => {

    const { isShowing, toggle } = useModal();

    return (
        <tr>
            <td>{item.MA_HOADON}</td>
            <td>{formatDate(new Date(item.NGAYTAOHD))}</td>
            <td> <NumberFormat value={item.TONGTIEN} displayType={'text'} thousandSeparator={true} suffix={"đ"} /></td>
            <td>{item.MASOTHUE}</td>
            <td>{item.ID_PHIEUDAT}</td>
            <td>{item.MA_NV}</td>
            <td>{item.MA_NVGH}</td>
            <td>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" onClick={toggle}>
                    <i className="fas fa-info-circle"></i>&nbsp;Info
                </button>
            </td>
            <DetaiInvoice item={item} isShowing={isShowing} hide={toggle} />
        </tr>
    )
}

export default InvoiceItem