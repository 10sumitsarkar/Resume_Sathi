// ❌ DO NOT use dynamic() or "use client" here
import ClientLayout from "./ClientLayout";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";

export const metadata = {
  title: "Resume Builder",
  description:
    "Create a professional resume with ResumeSathi using guided sections, ATS-friendly templates, and browser-based editing.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
      <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
        <h2>Free Resume Builder</h2>
        <p>
          ResumeSathi is a free resume builder made for people who just want a
          clean, professional resume without spending hours fighting with Word
          formatting or paying for a template someone else designed for a
          completely different job market. The builder walks you through each
          section one at a time — personal details, profile summary, education,
          work experience, internships, skills, languages, certificates, and
          social links — so you're never staring at a blank page wondering where
          to start or what goes where.
        </p>
        <p>
          You pick a resume flow that matches where you are in your career, fill
          in your details step by step, preview how it looks against the
          template you've chosen, and download it once you're happy with it.
          Nothing about the process is complicated on purpose. The whole point
          is to take the stress out of writing a resume while still keeping the
          layout something a recruiter — or the software scanning it before a
          recruiter even opens it — can actually read without getting confused.
        </p>
        <p>
          Freshers use it because they don't have five old resumes lying around
          to copy from. Students use it for their first internship application,
          when they're not even sure what counts as "experience" yet. People
          with eight or ten years behind them use it to finally get rid of a
          format they've been dragging along since their very first job, back
          when they didn't know any better. And if you already have a resume
          sitting on your laptop from two years ago, you can upload it, edit
          whatever's outdated, and move forward instead of rebuilding the whole
          thing from zero.
        </p>

        <blockquote className="border-3 ps-3 my-4 fst-italic">
          A resume doesn't need to impress anyone. It just needs to be
          understood in the first ten seconds someone looks at it.
        </blockquote>

        <p>
          A resume that actually works doesn't try to sound impressive — it
          tries to be clear. Recruiters go through hundreds of these in a single
          week, and the ones that stand out are usually the ones that get
          straight to the point. ResumeSathi pushes you toward that: short,
          specific summaries instead of vague lines like "hardworking team
          player" or "passionate about growth," work experience points that
          mention what you actually did and what came out of it, skills you can
          genuinely back up in an interview instead of a list copied from a job
          posting, and education details laid out plainly without unnecessary
          decoration.
        </p>

        <div className="table-responsive my-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Weak line</th>
                <th>Better line</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hardworking team player with good communication skills</td>
                <td>
                  Led a 4-member team to deliver a client project two weeks
                  ahead of schedule
                </td>
              </tr>
              <tr>
                <td>Responsible for handling social media</td>
                <td>
                  Grew Instagram engagement by 32% over three months through
                  weekly content planning
                </td>
              </tr>
              <tr>
                <td>Knowledge of Excel and reporting</td>
                <td>
                  Built a weekly sales report in Excel that cut reporting time
                  from 2 hours to 20 minutes
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Stick to what a recruiter could check if they wanted to — your job
          titles, the companies you worked at, the dates, the projects you built
          or contributed to, the tools you used day to day, what you achieved in
          numbers where possible, and your education record. Leave out personal
          details that don't add anything to the application unless a specific
          job posting or application form asks for them. Nobody's shortlisting
          you because of your hobbies section unless it's genuinely relevant to
          the role you're going after, so don't waste space on it just to fill
          the page.
        </p>
        <p>
          The whole process is broken into smaller pages instead of one long,
          intimidating form, so you're not trying to remember twelve things at
          once while your attention drifts halfway through. You can go back, fix
          a line that didn't read right the first time, switch to a different
          template if the one you picked doesn't feel like you anymore, and come
          back later — weeks or even months later — when you've picked up a new
          skill, finished a certification, or changed what kind of role you're
          aiming for next. A resume isn't a document you write once and forget;
          it should change as you do, section by section, over time.
        </p>
        <p>
          Put your strongest details near the top and label each section
          plainly, without clever headings that sound nice but slow the reader
          down. Recruiters aren't reading your resume top to bottom like a story
          — they're scanning it, often in under a minute, sometimes less. Within
          a few seconds, someone glancing at your resume should be able to tell
          what role you're suited for, how much experience you carry, what you
          studied, and where your real strengths sit. If they have to dig for
          that information, chances are they've already moved on to the next
          resume in the pile, and you never even get a fair look.
        </p>
        <p>
          If you're applying to more than one type of role, don't send out the
          same resume to all of them and hope for the best. Build a separate,
          focused version for each one — adjust your summary, reorder your
          skills so the relevant ones sit up top, and pick the projects and work
          examples that actually match what that particular job description is
          asking for. It takes a little more effort on your side, but a resume
          that speaks directly to the role almost always performs better than
          one written to cover everything at once and ends up saying very little
          about anything.
        </p>
        <p>
          Keep every line truthful while you're at it. A resume that oversells
          you might get you through the first screening, but it usually falls
          apart in the first five minutes of an actual interview, and that's a
          far worse position to be in than simply being honest from the start.
          ResumeSathi isn't trying to make you sound like someone else — it's
          trying to help you present who you already are, and what you've
          already done, in a way that's easy for someone else to understand
          quickly and take seriously.
        </p>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
