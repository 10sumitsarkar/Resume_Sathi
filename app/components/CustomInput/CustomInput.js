'use client';

import React, { useEffect, useRef, useState } from 'react';
import './custom-input.css';

export default function CustomInput({
  type = 'select',
  options = [],
  search = false,
  placeholder = type === 'date' ? 'Select date' : 'Select option',
  value = null,
  onChange = () => {},
  name,
  id,
  className = '',
  minDate,
  maxDate,
  // react-hook-form integration: pass register function and registerName/registerOptions
  register,
  registerName,
  registerOptions,
  disabled,
}) {
  const isSelect = type === 'select';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef();
  const [selectedValue, setSelectedValue] = useState(value ?? null);

  // Date state
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [visibleMonth, setVisibleMonth] = useState(selectedDate || new Date());

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (value && type === 'date') setSelectedDate(new Date(value));
    if (value && type === 'select') setSelectedValue(value);
  }, [value, type]);

  const filtered = isSelect && query ? options.filter((o) => (o.label || o.value || '').toString().toLowerCase().includes(query.toLowerCase())) : options;

  // register props for react-hook-form if provided
  let regProps = null;
  try {
    if (register && registerName) regProps = register(registerName, registerOptions || {});
  } catch (e) {
    // ignore
  }

  const handleSelect = (opt) => {
    setOpen(false);
    setQuery('');
    const val = opt.value ?? opt;
    setSelectedValue(val);
    // call react-hook-form onChange if available
    if (regProps && typeof regProps.onChange === 'function') {
      regProps.onChange({ target: { value: val } });
    }
    // Also update hidden select DOM value and dispatch change so libraries/readers see it
    try {
      const hidden = ref.current && ref.current.querySelector && ref.current.querySelector(`select[name="${registerName}"]`);
      if (hidden) {
        hidden.value = val;
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (e) {
      // ignore
    }
    onChange(val);
  };

  // keep hidden registered select and visible state in sync (for uncontrolled react-hook-form values)
  useEffect(() => {
    if (!isSelect || !regProps || !ref.current || !registerName) return;
    const hidden = ref.current.querySelector(`select[name="${registerName}"]`);
    if (!hidden) return;
    const handler = () => setSelectedValue(hidden.value || null);
    // initialize
    handler();
    hidden.addEventListener('change', handler);
    return () => hidden.removeEventListener('change', handler);
  }, [isSelect, regProps, registerName]);

  // Date helpers
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  const goMonth = (offset) => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));

  const pickDate = (day) => {
    const dt = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
    if (minDate && dt < new Date(minDate)) return;
    if (maxDate && dt > new Date(maxDate)) return;
    setSelectedDate(dt);
    onChange(dt.toISOString());
    setOpen(false);
  };

  const formatDate = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}-${m}-${y}`;
  };

  return (
    <div className={`rk-input-root ${className}`} ref={ref}>
      {/* Hidden native inputs for form libraries (react-hook-form) to bind to */}
      {isSelect && regProps && (
        <select {...regProps} name={registerName} style={{ display: 'none' }} value={selectedValue ?? ''}>
          {options.map((o, idx) => (
            <option key={o.value ?? idx} value={o.value ?? o}>{o.label ?? o.value ?? o}</option>
          ))}
        </select>
      )}
      {!isSelect && regProps && (
        <input type="hidden" {...regProps} name={registerName} value={selectedDate ? (selectedDate.toISOString()) : ''} />
      )}
      {isSelect ? (
        <div className={`rk-select ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
          <button type="button" className="rk-select-toggle" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" disabled={disabled}>
            <span className={`rk-select-value ${!selectedValue && !value ? 'placeholder' : ''}`}>{
              (() => {
                const displayVal = selectedValue ?? value;
                if (!displayVal) return placeholder;
                const found = options.find((o) => o.value === displayVal);
                return (found && (found.label ?? found.value)) || displayVal;
              })()
            }</span>
            <svg width="16" height="16" viewBox="0 0 24 24" className="rk-caret"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </button>
          {open && !disabled && (
            <div className="rk-select-panel">
              {search && (
                <div className="rk-select-search">
                  <input value={query} className='search-inp' onChange={(e) => setQuery(e.target.value)} placeholder="Search options..." />
                </div>
              )}
              <ul role="listbox" className="rk-select-list">
                {filtered.length === 0 && <li className="rk-empty">No options</li>}
                {filtered.map((opt, idx) => (
                  <li role="option" key={opt.value ?? idx} className="rk-select-item" onClick={() => handleSelect(opt)}>
                    {opt.label ?? opt.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={`rk-date ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
          <button type="button" className="rk-date-toggle" onClick={() => setOpen((v) => !v)} disabled={disabled}>
            <span className={`rk-date-value ${!selectedDate ? 'placeholder' : ''}`}>{selectedDate ? formatDate(selectedDate) : placeholder}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" className="rk-calendar-icon"><path d="M8 7V3M16 7V3M3 11h18M7 4h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </button>
          {open && (
            <div className="rk-date-panel">
              <div className="rk-date-header">
                <button type="button" onClick={() => goMonth(-1)} className="rk-month-nav">‹</button>
                <div className="rk-month-title">{visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
                <button type="button" onClick={() => goMonth(1)} className="rk-month-nav">›</button>
              </div>
              <div className="rk-days">
                {['S','M','T','W','T','F','S'].map((d) => <div key={d} className="rk-day-name">{d}</div>)}
                {(() => {
                  const start = startOfMonth(visibleMonth).getDay();
                  const total = daysInMonth(visibleMonth);
                  const cells = [];
                  for (let i = 0; i < start; i++) cells.push(<div key={`b-${i}`} className="rk-day blank" />);
                  for (let day = 1; day <= total; day++) {
                    const dt = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
                    const isSelected = selectedDate && dt.toDateString() === selectedDate.toDateString();
                    const disabled = (minDate && dt < new Date(minDate)) || (maxDate && dt > new Date(maxDate));
                    cells.push(
                      <button key={day} type="button" disabled={disabled} onClick={() => pickDate(day)} className={`rk-day ${isSelected ? 'selected' : ''}`}>{day}</button>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
