import React, { useEffect } from 'react'
import HotSellItem from './HotSellItem'
import { connect } from 'react-redux'
import { actFetchHotSellReq } from '../../actions/hotSell'

function HotSell({ onFetchHotSell, hotSell }) {

    useEffect(() => {
        (async () => {
            await onFetchHotSell()
        })()//eslint-disable-next-line
    }, [])


    return (
        <section className="section-content padding-y-sm bg">
            <div className="container">

                <header className="section-heading heading-line">
                    <h4 className="title-section bg">Bán chạy nhất trong tháng</h4>
                </header>
                <div className="row">
                    {hotSell.map((hs, index) => {
                        return <HotSellItem item={hs} key={index} />
                    })}
                </div>
            </div>
        </section>
    )
}

const mapStateToProps = (state) => ({
    hotSell: state.hotSell
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchHotSell: () => {
            dispatch(actFetchHotSellReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(HotSell)

