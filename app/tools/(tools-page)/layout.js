"use client"; // ✅ mark as client component

import NavBar from '../../components/NavBar';
import FooterNav from '../../components/FooterNav'
import ToolsSidebar from '../components/ToolsSidebar'

export default function ClientLayout({ children }) {
  return (
   
   <>
            <NavBar />
            <ToolsSidebar />
            { children }
            <FooterNav />
        </>
   
  );
}
