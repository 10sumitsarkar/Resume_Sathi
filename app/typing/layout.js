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
   <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
  <h2>Free Typing Practice and Lessons</h2>
  <p>
    ResumeSathi's typing practice is built for anyone who wants to
    actually get faster and cleaner at typing instead of just hunting for
    keys and hoping muscle memory shows up on its own someday. It works
    through short lessons, focused drills, and timed practice modes that
    build touch typing speed, accuracy, and general keyboard confidence
    one stage at a time. You're not thrown into a full paragraph on day
    one — the lessons start with basic key groups and slowly move into
    capitals, punctuation, numbers, common words, and mixed typing
    practice as your hands get used to where everything is.
  </p>
  <p>
    Use the lesson pages when you want structured, guided practice that
    tells you exactly what to type and in what order. Use the practice
    page when you'd rather pick your own exercises and work at your own
    pace. And use the stats page when you want to look back and actually
    see whether you're improving, instead of just assuming you are
    because you've been typing for a few weeks. The tool works well for
    students preparing for exams, office employees who type all day, data
    entry practice, job preparation, and honestly anyone who's tired of
    looking down at the keyboard every few seconds.
  </p>

  <blockquote className="border-3 ps-3 my-4 fst-italic">
    Speed comes on its own once your fingers stop thinking about where
    the keys are. Chasing speed before that just teaches you to type
    fast and wrong.
  </blockquote>

  <p>
    Start slow and pay attention to correct finger placement before you
    even think about increasing speed. It's tempting to rush, especially
    once you see a WPM number on the screen, but a steady routine with
    short daily sessions — even ten or fifteen minutes — does more for
    your typing than one long, exhausting session once a week. Short and
    consistent beats long and occasional almost every time, here and with
    most habits like this.
  </p>

  <div className="table-responsive my-4">
    <table className="table table-bordered align-middle">
      <thead>
        <tr>
          <th>Stage</th>
          <th>What to focus on</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Basic key groups</td>
          <td>Correct finger placement, not speed — get comfortable with the home row first</td>
        </tr>
        <tr>
          <td>Capitals & punctuation</td>
          <td>Shift key control without looking down, smooth transitions between keys</td>
        </tr>
        <tr>
          <td>Numbers & symbols</td>
          <td>Slower pace is normal here — this row takes longer for most people</td>
        </tr>
        <tr>
          <td>Timed practice</td>
          <td>Real typing rhythm under light pressure, without obsessing over the score</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    The lessons are ordered the way they are for a reason — each one
    introduces new keys gradually instead of overwhelming you with the
    entire keyboard at once. Once a lesson starts feeling easy, that's
    your cue to move into timed practice and see how your typing actually
    holds up under a bit of pressure. After that, go back and look at
    your results honestly. Sometimes the number that needs work is speed,
    sometimes it's accuracy, and they don't always improve at the same
    time, so it helps to know which one you're actually behind on before
    you keep practicing blindly.
  </p>
  <p>
    Try to keep your eyes on the screen while you type and let your
    fingers figure out the keyboard through repetition, not by checking
    every few seconds. It feels slower at first, almost frustratingly so,
    but it's the only way the muscle memory actually builds. If you
    notice your accuracy dropping — more red letters, more backspacing
    than usual — that's usually a sign to slow down for a round or two
    and rebuild control before trying to push your WPM number back up
    again. Chasing speed while accuracy is falling apart just locks in
    bad habits that take longer to unlearn later.
  </p>
  <p>
    This kind of practice ends up being especially useful right before
    exams, when filling out long online forms, during office work that
    involves a lot of writing, for coding tasks where typos slow you
    down more than people realize, and for data entry tests where speed
    and accuracy are both being measured at once. Somebody who's
    comfortable with a keyboard writes an email in half the time,
    fills out a form without constantly stopping to fix mistakes, and
    doesn't lose focus mid-sentence trying to find a key.
  </p>
  <p>
    Consistent practice, even in small doses, ends up making everyday
    writing tasks — resumes, job applications, notes, reports — noticeably
    faster with far fewer corrections along the way. You stop thinking
    about the mechanics of typing and start focusing entirely on what
    you're actually trying to write, which is really the whole point of
    learning to type properly in the first place.
  </p>
  <p>
    None of this needs to happen overnight. A few focused sessions a week,
    tracked honestly through the stats page, will show more real progress
    than one intense weekend of practice followed by weeks of nothing.
    Typing is one of those skills where slow, steady repetition wins over
    forced effort almost every single time.
  </p>
</section>
      <Footer />
      <FooterNav />
    </>
  );
}
