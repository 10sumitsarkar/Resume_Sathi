import React from 'react'
import Link from 'next/link';
import NavBar from './components/NavBar';

export default function Error404() {
    return (
        <>
            {/* Navbar start */}
            <NavBar />
            {/* Navbar end */}

            <section className="page-404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="col-sm-10 offset-sm-1  text-center">
                                <div className="four-zero-four-bg">
                                    <h1 className="text-center ">404</h1>
                                </div>

                                <div className="contant-box-404">
                                    <h3 className="h2">
                                        Look like you're lost
                                    </h3>

                                    <p>the page you are looking for not avaible!</p>

                                    <Link href="/" className="link-404">Go to Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
