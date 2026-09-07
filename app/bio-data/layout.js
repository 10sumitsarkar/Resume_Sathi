// ❌ DO NOT use dynamic() or "use client" here
import ClientLayout from './ClientLayout';
import Footer from '../components/Footer';
import FooterNav from '../components/FooterNav';

export const metadata = {
  title: 'Bio-Data Maker',
  description: 'Create a printable bio-data with ResumeSathi using guided sections, photo-ready templates, and browser-based editing.',
};

export default function RootLayout({ children }) {
  return (
    <>
      <ClientLayout>
        {children}
      </ClientLayout>
<section className="resume-content container-fluid custom-container pb-5 rk-article-text">
  <h2>Free Bio-Data Maker</h2>
  <p>
    ResumeSathi helps you put together a clean, printable bio-data without
    fighting with margins in Word or trying to remember which section goes
    where. It organizes everything into clear parts — personal details,
    education, family or background information, work details, languages,
    hobbies, and any other information you need to include — so the final
    document reads like something meant to be shared, not something typed
    in a hurry the night before it's due.
  </p>
  <p>
    You enter your details step by step, pick a layout that suits the
    purpose, preview the final page exactly as it'll appear, and then
    download or print it once everything looks right. The format stays
    readable and easy to go back and edit later, whether you need the
    bio-data for a personal reason, a job-related one, or something more
    formal like a family or matrimonial context.
  </p>

  <blockquote className="border-3 ps-3 my-4 fst-italic">
    A bio-data isn't meant to say everything about you. It's meant to say
    the right things, in the right order, without making the reader work
    for it.
  </blockquote>

  <p>
    A bio-data that actually does its job is simple, accurate, and easy to
    scan in one go. ResumeSathi keeps the sections clearly separated so the
    finished page doesn't end up looking crowded, cramped, or like too
    much information was squeezed into too little space. There's a real
    difference between a document that looks complete and one that just
    looks busy, and most people don't notice which one they've made until
    someone else points it out.
  </p>
  <p>
    This tool is especially useful when you need a structured personal
    profile for formal sharing — something you can hand over, email, or
    print without editing it fresh every single time. It keeps your
    contact details, education, skills, languages, hobbies, work details,
    and any other relevant information in a consistent order, so whoever's
    reading it isn't jumping around the page trying to find what they're
    looking for.
  </p>

  <div className="table-responsive my-4">
    <table className="table table-bordered align-middle">
      <thead>
        <tr>
          <th>Section</th>
          <th>What to keep it to</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Personal Details</td>
          <td>Full name, date of birth, contact number, email, current address</td>
        </tr>
        <tr>
          <td>Education</td>
          <td>Degree, institution, year of completion, in that order — no need for marks unless specifically asked</td>
        </tr>
        <tr>
          <td>Family / Background</td>
          <td>Only what the specific format or purpose actually requires, nothing extra</td>
        </tr>
        <tr>
          <td>Hobbies</td>
          <td>Two or three genuine ones, not a long generic list</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    Before you download anything, go through it once carefully — check
    spelling, dates, names, phone numbers, and email addresses line by
    line. It's easy to skim past a typo in your own document because your
    eyes fill in what you expect to see. Clean formatting only gets you
    halfway there; accurate details are what actually make a bio-data look
    professional, whether it ends up printed, shared as a PDF, or
    attached along with another form.
  </p>
  <p>
    You can come back and update the same information whenever your
    education, experience, location, or personal details change — you
    don't have to start over from a blank page each time something shifts
    in your life. That's what makes this useful for students preparing
    their first formal document, freshers who don't have much to put
    together yet, working professionals updating an old bio-data that's
    fallen out of date, and honestly anyone who'd rather not manually
    format every section by hand in a word processor.
  </p>
  <p>
    The guided pages cut down on mistakes because each one asks for a
    single type of information at a time, instead of throwing a long form
    at you and hoping you fill it out correctly. That's a lot easier than
    staring at an empty document and trying to remember every section a
    proper bio-data is supposed to have — especially when you need
    something neat and printable in a hurry and don't have time to second
    guess the layout.
  </p>
  <p>
    Keep the language simple and skip unnecessary decoration — bold text
    everywhere, odd fonts, excessive borders, anything that draws
    attention to the formatting instead of the content. Match the final
    bio-data to the purpose it's actually being shared for. A short,
    well-structured page almost always works better than a crowded one
    repeating the same details in three different sections because
    nothing was planned out beforehand.
  </p>
  <p>
    Once the form is complete, preview it on both mobile and desktop
    sizes before you share it anywhere. Spacing that looks fine on a
    laptop screen can shift awkwardly on a phone, a photo can end up
    misaligned, and section order can look different depending on the
    screen. A quick check on both saves you from sending out something
    that looks fine to you but slightly off to whoever opens it next.
  </p>
</section>
      <Footer />
      <FooterNav />
    </>
  );
}
