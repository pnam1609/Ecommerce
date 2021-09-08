import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import Category from './Category';
import { getKh } from '../../actions/getUser';

export const Header = ({ cart }) => {
    let history = useHistory()
    const [keyword, setKeyword] = useState('')
    const [name, setName] = useState('')

    var user = localStorage.getItem('user');
    function handleLogout() {
        localStorage.removeItem("user")
        localStorage.removeItem("CART")
    }
    function handleSearch() {
        if (keyword !== '') {
            console.log(keyword)
            history.push(`/search/${keyword}`)
        }
    }
    useEffect(() => {
        if (localStorage.getItem('user') != null) {
            let kh = getKh(history)
            if(kh != null){
                setName(kh.unique_name[0])
            }
        }
        //eslint-disable-next-line
    }, [])


    return (
        <header className="section-header">
            <section className="header-main">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-3">
                            <div className="brand-wrap">
                                <img className="logo" src="images/logo-dark.png" alt="" />
                                <Link to="/" style={{ fontSize: 26 }}>
                                    <i className="fas fa-home"></i>
                                    <h2 className="logo-text">PERFUME</h2>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            <form action="#" className="search-wrap">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search"
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)} />
                                    <div className="input-group-append">
                                        <button onClick={() => handleSearch()} className="btn btn-primary" type="submit">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="widgets-wrap d-flex justify-content-end">
                                {user == null ? <Link to="/signin" className="widget-header">
                                    <button type="button" className="btn btn-primary">Đăng nhập</button>
                                </Link> :
                                    <div className="nav-item dropdown no-arrow" style={{ display: 'flex' }}>
                                        <div className="nav-link">
                                            <Link to="/cart" className="widget-header" style={{ textDecoration: "none" }}>
                                                <span className="icontext">
                                                    <div className="icon-wrap icon-xs bg2 round text-secondary"><i className="fa fa-shopping-cart"></i></div>
                                                    <div className="text-wrap">
                                                        <small>Basket</small>
                                                        <span>{cart.length} items</span>
                                                    </div>
                                                </span>
                                            </Link>
                                        </div>
                                        <div className="nav-link d-flex" id="userDropdown" role="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ fontSize: 20 }}>
                                            <span className="img-profile rounded-circle"><i className="fas fa-user"></i></span>
                                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">&nbsp;{name.split(" ")[name.split(" ").length - 1]}</span>
                                        </div>
                                        <div className="dropdown-menu dropdown-menu-right shadow animated--fade-out"
                                            aria-labelledby="userDropdown">
                                            <a className="dropdown-item" href="/#">
                                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Profile
                                            </a>
                                            <a className="dropdown-item" href="/#">
                                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Settings
                                            </a>
                                            <Link to='/order' className="dropdown-item">
                                                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Đơn hàng
                                            </Link>
                                            <div className="dropdown-divider"></div>
                                            <Link to="/signin" onClick={() => { handleLogout() }} className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Logout
                                            </Link>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Category />
        </header>
    )
}

const mapStateToProps = (state) => ({
    cart: state.cart,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
