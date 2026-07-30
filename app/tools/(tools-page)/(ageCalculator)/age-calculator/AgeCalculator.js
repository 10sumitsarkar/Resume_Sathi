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
      <section className="merge-pdf-tool extra-tool">
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
    </div>
  );
}
