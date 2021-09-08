import React from 'react'

function Subscribe() {
    return (
        <section className="section-subscribe bg-primary padding-y-lg">
            <div className="container">

                <p className="pb-2 text-center white">Delivering the latest product trends and industry news straight to your inbox
                </p>

                <div className="row justify-content-md-center">
                    <div className="col-lg-4 col-sm-6">
                        <form className="row-sm form-noborder">
                            <div className="col-8">
                                <input className="form-control" placeholder="Your Email" type="email" />
                            </div>
                            {/* <!-- col.// --> */}
                            <div className="col-4">
                                <button type="submit" className="btn btn-block btn-warning"> <i className="fa fa-envelope"></i> Subscribe
                                </button>
                            </div>
                            {/* <!-- col.// --> */}
                        </form>
                        <small className="form-text text-white-50">We’ll never share your email address with a third-party. </small>
                    </div>
                    {/* <!-- col-md-6.// --> */}
                </div>

            </div>
            {/* <!-- container // --> */}
        </section>
    )
}

export default Subscribe
