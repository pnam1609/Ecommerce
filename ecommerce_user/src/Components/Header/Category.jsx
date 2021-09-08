import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actFetchBrandReq } from '../../actions/brand'

function Category({ brands, onFetchBrand }) {

    useEffect(() => {
        async function fetchapi() {
            await onFetchBrand()
        }
        fetchapi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    var listBrand = brands.map((brand, index) => {
        if (index < 7) {
            return <li key={index} className="nav-item"><Link className="nav-link" to={`/brand/${brand.MA_HANG}`}>
                {brand.TENHANG}</Link>
            </li>
        }
        return null
    })
    var listBrandMore = brands.map((brand, index) => {
        if (index >= 7) {
            return <Link to={`/brand/${brand.MA_HANG}`} className="dropdown-item" key={index}>{brand.TENHANG}</Link>
        }
        return null
    })

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
            <div className="container">

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main_nav"
                    aria-controls="main_nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="main_nav">
                    <ul className="navbar-nav">
                        {listBrand}
                        {brands.length >= 7 ? <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown07" data-toggle="dropdown"
                                aria-expanded="false" > More
                            </a>
                            <div className="dropdown-menu" aria-labelledby="dropdown07">
                                {listBrandMore}
                            </div>
                        </li> : ''}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => ({
    brands: state.brands
})

const mapDispatchToProps = dispatch => {
    return ({
        onFetchBrand: () => {
            dispatch(actFetchBrandReq())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)


