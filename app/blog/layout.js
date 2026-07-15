"use client";
import NavBar from '../components/NavBar';
import Footer from "../components/Footer";
import FooterNav from '../components/FooterNav';

export default function BlogLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer/>
      <FooterNav />
    </>
  );
}
