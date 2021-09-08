import React from 'react'

function Footer() {
    return (
        <footer className="section-footer bg-dark white">
            <div className="container">
                <section className="footer-top padding-top">
                    <div className="row">
                        <aside className="col-sm-3 col-md-3 white">
                            <h5 className="title">Customer Services</h5>
                            <ul className="list-unstyled">
                                <li> <a href="/#">Help center</a></li>
                                <li> <a href="/#">Money refund</a></li>
                                <li> <a href="/#">Terms and Policy</a></li>
                                <li> <a href="/#">Open dispute</a></li>
                            </ul>
                        </aside>
                        <aside className="col-sm-3  col-md-3 white">
                            <h5 className="title">My Account</h5>
                            <ul className="list-unstyled">
                                <li> <a href="/#"> User Login </a></li>
                                <li> <a href="/#"> User register </a></li>
                                <li> <a href="/#"> Account Setting </a></li>
                                <li> <a href="/#"> My Orders </a></li>
                                <li> <a href="/#"> My Wishlist </a></li>
                            </ul>
                        </aside>
                        <aside className="col-sm-3  col-md-3 white">
                            <h5 className="title">About</h5>
                            <ul className="list-unstyled">
                                <li> <a href="/#"> Our history </a></li>
                                <li> <a href="/#"> How to buy </a></li>
                                <li> <a href="/#"> Delivery and payment </a></li>
                                <li> <a href="/#"> Advertice </a></li>
                                <li> <a href="/#"> Partnership </a></li>
                            </ul>
                        </aside>
                        <aside className="col-sm-3">
                            <article className="white">
                                <h5 className="title">Contacts</h5>
                                <p>
                                    <strong>Phone: </strong> +123456789
                                    <br />
                                    <strong>Fax:</strong> +123456789
                                </p>

                                <div className="btn-group white">
                                    <a className="btn btn-facebook" title="Facebook" target="_blank" href="/#"><i
                                        className="fab fa-facebook-f  fa-fw"></i></a>
                                    <a className="btn btn-instagram" title="Instagram" target="_blank" href="/#"><i
                                        className="fab fa-instagram  fa-fw"></i></a>
                                    <a className="btn btn-youtube" title="Youtube" target="_blank" href="/#"><i
                                        className="fab fa-youtube  fa-fw"></i></a>
                                    <a className="btn btn-twitter" title="Twitter" target="_blank" href="/#"><i
                                        className="fab fa-twitter  fa-fw"></i></a>
                                </div>
                            </article>
                        </aside>
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer
