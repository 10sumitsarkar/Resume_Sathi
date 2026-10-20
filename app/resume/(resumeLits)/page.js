import ResumeLists from "./ResumeLists";
import Footer from "../../components/Footer";
import FooterNav from "../../components/FooterNav";
import {
  Banner468x60,
  Banner300x250,
  Banner160x300,
  Banner160x600,
  Banner320x50,
  Banner728x90,
} from "../../components/ads";
import '../(resumeLits)/resume-list.css'

export const metadata = {
  title: 'Free Resume Builder | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi free resume builder using ATS-friendly templates and smart editing tools.',
  keywords: ['resume builder', 'free resume maker', 'ATS resume templates', 'professional resume'],
  alternates: { canonical: '/resume/' },
  openGraph: {
    title: 'Free Resume Builder | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    url: '/resume/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'ResumeSathi resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

function ResumeAdPlacement({ name, children }) {
  return (
    <div
      className="d-flex flex-column align-items-center gap-2 my-4"
      role="region"
      aria-label={`${name} ad placement`}
      style={{ display: "none" }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default function ResumeTypeClientWrapper() {
  return (
    <>
      <ResumeLists />
<section className="resume-content container-fluid custom-container pb-5 rk-article-text">

  <h2>Free Resume Builder for Freshers, Students and Working Professionals</h2>

  <p>
    Most people open a blank Word file, type their name at the top and
    then lose half an hour moving a text box that refuses to stay where
    it is. The resume itself is not hard to write. The formatting around
    it is what eats the time. ResumeSathi is a free resume builder made
    to remove that part, so you can spend your effort on what the resume
    says instead of how it is lined up.
  </p>

  <p>
    You choose a resume flow that fits your stage in your career and
    fill in one section at a time. Once the details are in, you see a
    preview in the template you picked, make changes if something looks
    off, and download the file when you are happy with it. The layout is
    kept simple on purpose, so that a recruiter, or the software that
    scans resumes before a recruiter does, can read it without
    trouble.
  </p>

  <ResumeAdPlacement name="Banner 468x60">
    <Banner468x60 />
  </ResumeAdPlacement>

  <p>
    A fresher usually has no old resume to copy from, and that blank
    page can feel heavy. A student applying for a first internship often
    does not know what counts as experience yet. Someone with eight or
    ten years of work has the opposite problem, an old format that has
    followed them from job to job and now looks tired. All three can
    start here. And if you already have a resume saved on your laptop
    from a couple of years back, you can upload it, update what is out
    of date and carry on, instead of typing everything again.
  </p>

  <blockquote className="ps-3 my-4 fst-italic">
    A resume does not have to impress anyone. It has to make sense to a
    stranger within the first ten seconds.
  </blockquote>

  <ResumeAdPlacement name="Banner 300x250">
    <Banner300x250 />
  </ResumeAdPlacement>

  <h3>What the Builder Asks You to Fill In</h3>

  <p>
    The form is split into sections, and you go through them in order.
    Nothing is hidden, so you always know what comes next. These are the
    sections you will meet and what each one is for.
  </p>

  <ul>
    <li><strong>Personal details:</strong> your name, phone number, email and city. Keep the email address simple and professional.</li>
    <li><strong>Profile summary:</strong> two or three lines at the top that say who you are and what kind of role you want.</li>
    <li><strong>Education:</strong> your degrees, schools or colleges and the years. Put the latest one first.</li>
    <li><strong>Work experience:</strong> the companies, job titles, dates and what you actually did in each role.</li>
    <li><strong>Internships:</strong> a separate place for short stints, which matters a lot if you are early in your career.</li>
    <li><strong>Skills:</strong> the tools and abilities you use and could talk about in an interview.</li>
    <li><strong>Languages:</strong> the languages you can speak or write, which can help in some customer facing and regional roles.</li>
    <li><strong>Certificates:</strong> courses and certifications that support the job you are applying for.</li>
    <li><strong>Social links:</strong> your LinkedIn profile, and a portfolio or GitHub page if it adds something real.</li>
  </ul>

  <p>
    You do not have to stuff every section just because it exists. If
    you have no internships, leave that one empty. A shorter resume that
    is honest and tidy is better than a long one padded with filler.
  </p>

  <h3>Write Lines That Say Something</h3>

  <p>
    Recruiters read a huge number of resumes in a week, and the ones
    that stand out are usually the plainest. Phrases like "hardworking
    team player" or "passionate about growth" tell the reader nothing,
    because every second resume uses them. What helps is a specific
    line about something you did and what came out of it. The builder
    nudges you in that direction by giving you short, separate spaces
    for each point instead of one giant text box.
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
          <td>Led a 4-member team to deliver a client project two weeks ahead of schedule</td>
        </tr>
        <tr>
          <td>Responsible for handling social media</td>
          <td>Grew Instagram engagement by 32% over three months through weekly content planning</td>
        </tr>
        <tr>
          <td>Knowledge of Excel and reporting</td>
          <td>Built a weekly sales report in Excel that cut reporting time from 2 hours to 20 minutes</td>
        </tr>
        <tr>
          <td>Worked on college projects</td>
          <td>Built a student attendance app with two classmates and presented it to the department</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    Notice the pattern in the better lines. Each one has an action, a
    number or a clear result, and something a recruiter could ask you
    about. If you cannot think of a number, describe the outcome in
    plain words instead. "Cut the number of customer complaints" is still
    stronger than "handled customer complaints."
  </p>

  <ResumeAdPlacement name="Banner 728x90">
    <Banner728x90 />
  </ResumeAdPlacement>

  <h3>What to Include and What to Leave Out</h3>

  <p>
    A good rule is to include only what a recruiter could check if they
    wanted to. That means your job titles, the companies you worked for,
    your dates, the projects you built or helped with, the tools you use
    every day, results with numbers where you have them, and your
    education record.
  </p>

  <p>
    Leave out personal details that add nothing to the application,
    unless a specific job posting or form asks for them. Nobody gets
    shortlisted because of a hobbies section, unless the hobby is
    actually relevant to the role. If you are applying for a content
    writing job, a blog you run is worth a line. A list of "reading,
    music, travelling" just fills space. The same goes for a long
    objective statement. A short, clear profile summary does the job
    better.
  </p>

  <ResumeAdPlacement name="Banner 320x50">
    <Banner320x50 />
  </ResumeAdPlacement>

  <h3>Work Through It in Small Steps</h3>

  <p>
    The process is broken into smaller pages instead of one long form,
    so you are not trying to remember twelve things at once. That helps
    more than it sounds. When a form is short, you give each answer a bit
    more thought, and the writing improves.
  </p>

  <p>
    You can go back at any point and fix a line that did not read right
    the first time. If the template you picked no longer feels like
    you, switch to another one and check the preview again. You can also
    stop halfway and return later. A lot of people come back weeks or
    months after their first visit, once they have finished a course,
    learned a new tool or decided to aim at a different kind of job. A
    resume is not something you write once and forget. It should change
    as you do.
  </p>

  <ResumeAdPlacement name="Banner 160x300">
    <Banner160x300 />
  </ResumeAdPlacement>

  <h3>Make the Top of the Page Do the Heavy Lifting</h3>

  <p>
    Put your strongest details near the top and label every section in
    plain words. Headings like "Experience" and "Education" may look
    boring, but they are exactly what a reader and a scanning program
    both expect. A clever heading that sounds nice only slows people
    down.
  </p>

  <p>
    Remember that nobody reads a resume from top to bottom like a story.
    It gets scanned, usually in under a minute and sometimes in
    a few seconds. In that short window, the reader should be able to
    tell what role you suit, roughly how much experience you have, what
    you studied and where your real strengths are. If they have to dig
    for any of it, there is a fair chance they move on to the next
    resume, and you never get a proper look.
  </p>

  <blockquote className="ps-3 my-4 fst-italic">
    If someone has to hunt for your best skill, they will probably not
    hunt for long.
  </blockquote>

  <h3>One Resume Does Not Fit Every Job</h3>

  <p>
    If you are applying for more than one type of role, do not send the
    same file to all of them and hope it works. Build a separate,
    focused version for each. Change the summary, move the skills that
    matter for that job to the top and pick the projects and work
    examples that match what the job description asks for.
  </p>

  <p>
    It takes some extra effort, but a resume written for one role almost
    always does better than one written to cover everything. The general
    version tends to say very little about anything. Say you are
    applying for both a customer support job and a data entry job. The
    support version should lead with communication, handling queries
    and tools like ticketing software. The data entry version should
    lead with typing speed, accuracy and spreadsheet work. Same person,
    two different first impressions.
  </p>

  <h3>Already Have a Resume? Start From That</h3>

  <p>
    Plenty of visitors do not begin from scratch. They have a resume
    from an earlier job search, and it is just outdated. You can upload
    it, correct the old dates, add the new role or certificate, remove
    what no longer applies and then pick a template you like. It is much
    faster than rebuilding, and you are less likely to forget something
    you wrote well the first time.
  </p>

  <p>
    Old resumes also tend to carry bad habits. A paragraph of five lines
    under each job, a skills list copied from a job posting, a phone
    number that has changed. Going through each section again, one at a
    time, is a good chance to clean those up.
  </p>

  <h3>Keep Every Line Truthful</h3>

  <p>
    A resume that oversells you might get through the first screening,
    but it usually falls apart in the first five minutes of an
    interview. That is a much worse place to be than simply being honest
    from the start. If you list a skill, expect to be asked about it. If
    you claim a result, expect someone to ask how you got there.
  </p>

  <p>
    ResumeSathi is not trying to turn you into someone else. The idea is
    to help you present who you already are and what you have already
    done, in a way that is easy for another person to understand quickly
    and take seriously.
  </p>

  <h3>A Quick Check Before You Download</h3>

  <ol>
    <li>Read the whole resume out loud once. Awkward sentences are easy to hear.</li>
    <li>Check your phone number and email for typing mistakes. This is the most common error.</li>
    <li>Make sure the dates in education and work experience do not overlap in a confusing way.</li>
    <li>Look at the preview and confirm nothing is cut off or pushed onto a second page for no reason.</li>
    <li>Ask yourself if every skill on the list is something you could discuss for two minutes.</li>
    <li>Name the file properly, with your name in it, before sending it anywhere.</li>
  </ol>

  <p>
    A resume built this way will not win any design awards, and it does
    not need to. It needs to be clear, honest and easy to read, so the
    person on the other side can quickly see why you are worth a call.
  </p>

  <ResumeAdPlacement name="Banner 160x600">
    <Banner160x600 />
  </ResumeAdPlacement>

</section>
      <Footer />
      <FooterNav />
    </>
  );
}
