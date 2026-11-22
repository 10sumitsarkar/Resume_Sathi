"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/age-calculator.css";

function calculateAge(dobValue, asOfValue) {
  if (!dobValue) return null;
  const dob = parseDateValue(dobValue);
  const asOf = asOfValue ? parseDateValue(asOfValue) : new Date();
  if (Number.isNaN(dob.getTime()) || Number.isNaN(asOf.getTime()) || dob > asOf) return null;

  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((asOf - dob) / 86400000);
  return { years, months, days, totalDays };
}

function parseDateValue(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function makeDateValue(day, month, year) {
  if (!day || month === "" || !year) return "";
  const date = new Date(Number(year), Number(month), Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) ||
    date.getDate() !== Number(day)
  ) return "";
  return `${year}-${String(Number(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function SearchSelect({ label, value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const selected = options.find((option) => String(option.value) === String(value));
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <div className="age-search-select" ref={rootRef}>
      <button
        className={`age-select-trigger${open ? " open" : ""}`}
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setQuery("");
        }}
      >
        <span>
          <small>{label}</small>
          {selected?.label || placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="age-select-menu">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}`}
            autoFocus
          />
          <div className="age-select-options">
            {filtered.length ? (
              filtered.map((option) => (
                <button
                  key={option.value}
                  className={String(option.value) === String(value) ? "active" : ""}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="age-select-empty">No result found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DateSelector({ label, value, onChange, minYear = 1900, maxYear }) {
  const valueDate = value ? parseDateValue(value) : null;
  const [parts, setParts] = useState({
    day: valueDate ? String(valueDate.getDate()) : "",
    month: valueDate ? String(valueDate.getMonth()) : "",
    year: valueDate ? String(valueDate.getFullYear()) : "",
  });
  const yearEnd = maxYear || new Date().getFullYear();
  const years = Array.from({ length: yearEnd - minYear + 1 }, (_, i) => ({
    value: String(yearEnd - i),
    label: String(yearEnd - i),
  }));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: new Date(2026, i, 1).toLocaleString("en-IN", { month: "long" }),
  }));
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1).padStart(2, "0"),
  }));

  const update = (next) => {
    const updated = { ...parts, ...next };
    setParts(updated);
    const nextValue = makeDateValue(
      updated.day,
      updated.month,
      updated.year,
    );
    if (nextValue) onChange(nextValue);
  };

  useEffect(() => {
    const nextDate = value ? parseDateValue(value) : null;
    setParts({
      day: nextDate ? String(nextDate.getDate()) : "",
      month: nextDate ? String(nextDate.getMonth()) : "",
      year: nextDate ? String(nextDate.getFullYear()) : "",
    });
  }, [value]);

  return (
    <div className="age-date-selector">
      <div className="age-date-label">{label}</div>
      <div className="age-select-grid">
        <SearchSelect label="Day" value={parts.day} placeholder="Day" options={days} onChange={(day) => update({ day })} />
        <SearchSelect label="Month" value={parts.month} placeholder="Month" options={months} onChange={(month) => update({ month })} />
        <SearchSelect label="Year" value={parts.year} placeholder="Year" options={years} onChange={(year) => update({ year })} />
      </div>
    </div>
  );
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(() => new Date().toISOString().slice(0, 10));
  const age = useMemo(() => calculateAge(dob, asOf), [dob, asOf]);
  const dobDate = dob ? parseDateValue(dob) : null;
  const asOfDate = asOf ? parseDateValue(asOf) : null;
  const isBirthday =
    dobDate &&
    asOfDate &&
    dobDate.getDate() === asOfDate.getDate() &&
    dobDate.getMonth() === asOfDate.getMonth() &&
    dobDate <= asOfDate;

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="merge-pdf-tool extra-tool mb-3 mb-md-5">
        <div className="tool-header">
          <h1>Age <span>Calculator</span></h1>
          <p>Find exact age from date of birth. <br /><span>Years, months, days, and total days</span></p>
        </div>
        <div className="age-calculator-panel">
          <div className="age-input-card">
            <DateSelector label="Date of birth" value={dob} onChange={setDob} />
            <DateSelector label="Calculate age on" value={asOf} onChange={setAsOf} />
          </div>
          {isBirthday && (
            <div className="age-birthday-message">
              <span>HB</span>
              Happy Birthday! Wishing you a bright year ahead.
            </div>
          )}
          {age ? (
            <div className="age-result-grid">
              <div className="age-result-main"><i>Y</i><strong>{age.years}</strong><span>Years old</span></div>
              <div><i>M</i><strong>{age.months}</strong><span>Months</span></div>
              <div><i>D</i><strong>{age.days}</strong><span>Days</span></div>
              <div><i>T</i><strong>{age.totalDays}</strong><span>Total Days</span></div>
            </div>
          ) : dob ? (
            <div className="age-empty">Select a valid date of birth to calculate age.</div>
          ) : null}
        </div>
      </section>

      <section className="age-calculator-info">
        <div className="info-block">
          <h2>Find Out Your Exact Age In Years, Months, And Days</h2>
          <p>
            Every sarkari form asks the same question in a slightly different
            way, what's your age as of a certain cutoff date, not just today.
            SSC, banking exams, railway recruitment, state PSC forms, all of
            them mention an age limit calculated on a specific reference date
            mentioned in the notification, not the day you happen to be
            filling the form. Counting that out manually with a calendar is
            where people mess up, off by a month here or a few days there.
            This tool just does that calculation properly, down to the exact
            day.
          </p>
        </div>

        <div className="info-block">
          <h3>Where This Gets Used</h3>
          <p>
            Government job applications lean on this the most, since almost
            every notification has a minimum and maximum age limit tied to a
            particular date, and getting even a few days wrong can mean the
            form rejects your application outright. Beyond that, schools and
            colleges ask for exact age on the admission cutoff date for
            things like class 1 admissions. And plenty of regular situations
            come up too, figuring out someone's exact age for an insurance
            form, a passport application, or honestly just settling an
            argument about who's actually older between two people.
          </p>
        </div>

        <div className="info-block">
          <h3>Setting Your Date Of Birth And The Reference Date</h3>
          <p>
            There are two separate sections here, your date of birth on the
            left, and the date you want your age calculated against on the
            right. For most day to day use, that second one would just be
            today's date, but for sarkari forms, this is exactly where you'd
            enter the cutoff date mentioned in the recruitment notification,
            not today's date. Pick the day, month, and year in both sections
            using the dropdowns, and the result updates right there.
          </p>
        </div>

        <div className="info-block">
          <h3>Reading The Result</h3>
          <p>
            The answer comes in four parts, years, months, and days broken
            out separately, plus a total day count. The years old is what
            most people check first since that's usually the number a form
            or eligibility criteria cares about, but the months and days
            figures matter too, since some age limits are written down to
            the exact month, not just a round year number. The total days
            count is handy for anything that specifically asks for age in
            number of days rather than years.
          </p>
        </div>

        <div className="info-block">
          <h3>Why The Reference Date Field Matters So Much</h3>
          <p>
            This is the part people skip and shouldn't. Leaving the second
            date set to today when a form actually wants your age as of some
            other cutoff date gives you a wrong number, and for eligibility
            purposes wrong is worse than not knowing at all. Always check the
            official notification for the exact date they're calculating age
            against, then set that here before trusting the result for
            anything official.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Double check both dates before relying on this for a form
            submission, a wrong year selected by accident throws the whole
            result off. This runs entirely in your browser, nothing you
            enter here gets sent anywhere or stored, close the tab and it's
            gone.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes, completely free, no login needed, use it as many times
                as you want.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I calculate age as of a specific date, not today?</summary>
              <p>
                Yes, that's exactly what the second date section is for, set
                it to whatever cutoff date you need instead of today's date.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is this accurate enough for government form eligibility?</summary>
              <p>
                It calculates the exact difference between the two dates you
                enter, but always cross check the age limit rules mentioned
                in the official notification since criteria can vary between
                different recruitment boards.
              </p>
            </details>

            <details className="faq-item">
              <summary>What does the total days number mean?</summary>
              <p>
                It's the full number of days between your date of birth and
                the date you're calculating age on, useful for forms that
                ask for age in days rather than years.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does this store my date of birth anywhere?</summary>
              <p>
                No, everything is calculated right in your browser, nothing
                you enter gets saved or sent to a server.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I use this for something other than sarkari forms?</summary>
              <p>
                Yes, it works for anything that needs an exact age
                calculation, admission forms, insurance paperwork, or just
                general curiosity.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if I select the wrong date by mistake?</summary>
              <p>
                Just change it in the dropdown, the result updates
                immediately based on whatever dates are currently selected.
              </p>
            </details>

            <details className="faq-item">
              <summary>Why does my age in months look different from what I expected?</summary>
              <p>
                The months figure shows the leftover months after the full
                years are counted, not total months lived, that's normal and
                matches how most official age calculations work.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I calculate someone else's age using this?</summary>
              <p>
                Yes, just enter their date of birth, it works the same way
                regardless of whose age you're checking.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install anything to use this?</summary>
              <p>
                No, it works directly in the browser on mobile or desktop,
                nothing to download.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
