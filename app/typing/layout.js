import "./typing.css";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import TypingSubNav from "./_components/TypingSubNav";
import { typingMetadata, TypingJsonLd } from "./_lib/seo";

export const metadata = typingMetadata({
  title: "Free Typing Practice & Touch Typing Lessons",
  description: "Improve your typing speed and accuracy with free touch-typing lessons, focused practice modes, and private progress tracking.",
  path: "/typing",
});

export default function TypingLayout({ children }) {
  return (
    <>
      <TypingJsonLd name="ResumeSathi Typing Practice" description="A free web-based typing tutor with guided touch-typing lessons, timed tests, and private progress tracking." path="/typing" />
      <Navbar className="typing-navbar" />
      <TypingSubNav />
      <div className="tf-scope" translate="no">{children}</div>
      <Footer />
      <FooterNav />
    </>
  );
}
