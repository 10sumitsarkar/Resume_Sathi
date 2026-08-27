"use client";
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import ResumeTemplate1 from '../templates/ResumeTemplate1'
import ResumeTemplate2 from '../templates/ResumeTemplate2'
import ResumeTemplate3 from '../templates/ResumeTemplate3'
import ResumeTemplate4 from '../templates/ResumeTemplate4'
import ResumeTemplate5 from '../templates/ResumeTemplate5'
import ResumeTemplate6 from '../templates/ResumeTemplate6'
import ResumeTemplate7 from '../templates/ResumeTemplate7'
import ResumeTemplate8 from '../templates/ResumeTemplate8'
import ResumeTemplate9 from '../templates/ResumeTemplate9'

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux'
import { setResumeConfigration, setResumeName, setPreviewResumeSize } from '../reducer/resume-reducer'
import ReviewResume from '../components/ReviewResume'
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { getResumeCustomizationClasses } from '../utils/fontSize';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AVAILABLE_TEMPLATES = [
    { id: 'ResumeTemplate1', component: ResumeTemplate1 },
    { id: 'ResumeTemplate2', component: ResumeTemplate2 },
    { id: 'ResumeTemplate3', component: ResumeTemplate3 },
    { id: 'ResumeTemplate4', component: ResumeTemplate4 },
    { id: 'ResumeTemplate5', component: ResumeTemplate5 },
    { id: 'ResumeTemplate6', component: ResumeTemplate6 },
    { id: 'ResumeTemplate7', component: ResumeTemplate7 },
    { id: 'ResumeTemplate8', component: ResumeTemplate8 },
    { id: 'ResumeTemplate9', component: ResumeTemplate9 },
];

const normalizeConfiguration = (configuration = {}) => ({
    font_style: configuration.font_style || 'poppins',
    color_palette: configuration.color_palette || 'color-1',
    selected_theme: configuration.selected_theme || 'ResumeTemplate1',
    layout_style: 'all',
});

const isSameConfiguration = (a = {}, b = {}) =>
    a.font_style === b.font_style &&
    a.color_palette === b.color_palette &&
    a.selected_theme === b.selected_theme &&
    (a.layout_style || 'all') === (b.layout_style || 'all');

// 30px at 96 DPI converted to PDF millimeters.
const PDF_PAGE_MARGIN_MM = 7.94;
const ZERO_MARGIN_PDF_TEMPLATES = new Set(['ResumeTemplate4', 'ResumeTemplate5', 'ResumeTemplate7']);

export default function ShowResume() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);
    const [activeIndexes, setActiveIndexes] = useState([0, 2])
    const [mobCustomizeSlider, setMobCustomizeSlider] = useState()
    const [mobTemplateSlider, setMobTemplateSlider] = useState()
    const configuration = useSelector(state => {
        const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
        return resumes.find(resume => resume.id === id)?.configuration || {
            font_style: 'poppins',
            layout_style: 'all',
            color_palette: 'color-1',
            selected_theme: 'ResumeTemplate1',
        };
    });
    const resumeName = useSelector(state => {
        const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
        return resumes.find(resume => resume.id === id)?.resume_name || 'Bio-Data Name';
    });
    const selectedResume = useSelector(state => {
        const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
        return resumes.find(resume => resume.id === id) || null;
    });

    const [customizeData, setCustomizeData] = useState({
        ...normalizeConfiguration(configuration),
    });
    const customizationClasses = getResumeCustomizationClasses(customizeData);
    const [isEditable, setIsEditable] = useState(false);
    const [zoomValue, setZoomValue] = useState(100);

    useEffect(() => {
        const handleResize = () => {
            setZoomValue(80);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dispatch = useDispatch();

    const editableDivRef = useRef(null);
    useEffect(() => {
        if (isEditable && editableDivRef.current) {
            const el = editableDivRef.current;
            el.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [isEditable]);

    const handleCustomizationChange = (key, value) => {
        setCustomizeData({ ...customizeData, [key]: value });
    }

    useEffect(() => {
        const nextConfiguration = normalizeConfiguration(configuration);
        setCustomizeData((prev) => isSameConfiguration(prev, nextConfiguration) ? prev : nextConfiguration);
    }, [configuration]);

    useEffect(() => {
        const currentConfiguration = normalizeConfiguration(selectedResume?.configuration);
        const nextConfiguration = normalizeConfiguration(customizeData);
        if (!isSameConfiguration(currentConfiguration, nextConfiguration)) {
            dispatch(setResumeConfigration({ id: id, data: nextConfiguration }));
        }
    }, [customizeData, dispatch, id, selectedResume?.configuration]);

    const toggleIndex = (index) => {
        setActiveIndexes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        )
    }

    const sliderCustRef = useRef();
    useEffect(() => {
        const handleCustClickOutside = (event) => {
            if (sliderCustRef.current && !sliderCustRef.current.contains(event.target)) {
                setMobCustomizeSlider();
            }
        };
        document.addEventListener('mousedown', handleCustClickOutside);
        return () => document.removeEventListener('mousedown', handleCustClickOutside);
    }, []);

    const sliderTempRef = useRef();
    useEffect(() => {
        const handleTempClickOutside = (event) => {
            if (sliderTempRef.current && !sliderTempRef.current.contains(event.target)) {
                setMobTemplateSlider();
            }
        };
        document.addEventListener('mousedown', handleTempClickOutside);
        return () => document.removeEventListener('mousedown', handleTempClickOutside);
    }, []);

    const saveResumeName = () => {
        const getResumeName = document.getElementById('resumeName').innerText;
        if (getResumeName.length > 15) {
            toast.error('Max 15 characters allowed.', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: false,
                theme: "light",
            });
            return;
        } else {
            dispatch(setResumeName({ id: id, data: getResumeName }));
            toast.success('Saved successfully.', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: false,
                theme: "light",
            });
            setIsEditable(false);
        }
    }

    useEffect(() => {
        dispatch(setPreviewResumeSize(zoomValue))
    }, [zoomValue])

    const zoomIntervalRef = useRef(null);

    const stopZoom = () => {
        if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current);
            zoomIntervalRef.current = null;
        }
    };

    const startZoomIn = () => {
        if (zoomIntervalRef.current) return;
        setZoomValue(prev => (prev < 100 ? prev + 1 : prev));
        zoomIntervalRef.current = setInterval(() => {
            setZoomValue(prev => {
                if (prev < 100) return prev + 1;
                stopZoom();
                return prev;
            });
        }, 70); // Zoom speed (70ms)
    };

    const startZoomOut = () => {
        if (zoomIntervalRef.current) return;
        setZoomValue(prev => (prev > 40 ? prev - 1 : prev));
        zoomIntervalRef.current = setInterval(() => {
            setZoomValue(prev => {
                if (prev > 40) return prev - 1;
                stopZoom();
                return prev;
            });
        }, 70);
    };

    useEffect(() => {
        return () => stopZoom();
    }, []);

    // Sanitize computed color values on a cloned tree. Some browsers produce
    // CSS4 `color(...)` functions which html2canvas / PDF libs can't parse.
    // Copy resolved styles (rgb/rgba) from the original elements into the clone
    // so the canvas generator receives only supported color strings.
    const convertColorFunctions = (input) => {
        if (!input || typeof input !== 'string' || input.indexOf('color(') === -1) return input;
        try {
            return input.replace(/color\([^)]*\)/gi, (m) => {
                // Extract numeric tokens inside color(...)
                const nums = m.match(/[\d.]+/g) || [];
                if (nums.length >= 3) {
                    let r = parseFloat(nums[0]);
                    let g = parseFloat(nums[1]);
                    let b = parseFloat(nums[2]);
                    let a = nums[3] !== undefined ? parseFloat(nums[3]) : 1;

                    // If components are in [0,1], scale to 0-255
                    if (r <= 1 && g <= 1 && b <= 1) {
                        r = Math.round(r * 255);
                        g = Math.round(g * 255);
                        b = Math.round(b * 255);
                    } else {
                        r = Math.round(r);
                        g = Math.round(g);
                        b = Math.round(b);
                    }

                    if (!a || a === 0) a = 1;
                    return `rgba(${r}, ${g}, ${b}, ${a})`;
                }
                return m;
            });
        } catch (e) {
            return input;
        }
    };

    const sanitizeComputedColors = (origRoot, cloneRoot) => {
        try {
            const origEls = origRoot.querySelectorAll('*');
            const cloneEls = cloneRoot.querySelectorAll('*');
            const len = Math.min(origEls.length, cloneEls.length);
            for (let i = 0; i < len; i++) {
                const o = origEls[i];
                const c = cloneEls[i];
                if (!o || !c) continue;
                const cs = window.getComputedStyle(o);
                const colorProps = [
                    'color',
                    'background-color',
                    'border-top-color',
                    'border-right-color',
                    'border-bottom-color',
                    'border-left-color',
                    'box-shadow',
                    'outline-color',
                    'text-decoration-color',
                    'fill',
                    'stroke',
                    'background-image'
                ];
                colorProps.forEach((prop) => {
                    try {
                        let val = cs.getPropertyValue(prop);
                        if (val) {
                            const converted = convertColorFunctions(val);
                            c.style.setProperty(prop, converted, 'important');
                            if (converted.indexOf('color(') !== -1) {
                                // Log once for debugging if any color(...) remained
                                try {
                                    console.warn('Unconverted color() in sanitize:', { prop, value: val, converted });
                                } catch (e) {}
                            }
                        }
                    } catch (e) {
                        // ignore individual property errors
                    }
                });
            }
        } catch (e) {
            // If sanitization fails, continue — we'll fall back to default capture.
        }
    };

    const getDownloadElement = () => {
        const root = componentRef.current;
        if (!root) return null;
        return root.querySelector('#resume-download-area');
    };

    const trimCanvasWhiteSpace = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const isRowWhite = (row) => {
        const start = row * width * 4;
        let whitePixels = 0;

        for (let x = 0; x < width; x++) {
            const idx = start + x * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a === 255 && r >= 250 && g >= 250 && b >= 250) {
                whitePixels++;
            }
        }

        return whitePixels / width > 0.98;
    };

    // KEEP TOP SPACE
    const top = 0;

    // Trim only bottom
    let bottom = height - 1;
    while (bottom >= 0 && isRowWhite(bottom)) bottom--;

    const newHeight = bottom + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = width;
    trimmedCanvas.height = newHeight;

    trimmedCanvas
        .getContext('2d')
        .putImageData(ctx.getImageData(0, 0, width, newHeight), 0, 0);

    return trimmedCanvas;
};

    const findPageBreakRow = (canvas, approxRow, maxSearch = 120) => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const bottom = Math.min(canvas.height, approxRow);
        const top = Math.max(0, bottom - maxSearch);
        const rows = bottom - top;
        if (rows <= 0) return approxRow;

        const imageData = ctx.getImageData(0, top, width, rows);
        const data = imageData.data;

        const isRowMostlyWhite = (rowIndex) => {
            const rowStart = rowIndex * width * 4;
            let whitePixels = 0;
            for (let x = 0; x < width; x++) {
                const idx = rowStart + x * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                if (a === 255 && r >= 250 && g >= 250 && b >= 250) {
                    whitePixels += 1;
                }
            }
            return whitePixels / width > 0.98;
        };

        for (let row = bottom; row > top; row--) {
            if (isRowMostlyWhite(row - top)) {
                return row;
            }
        }

        return approxRow;
    };

    // ─── Download as PDF ────────────────────────────────────────────────────────
    const downloadPDF = async () => {
        setLoading(true);
        try {
            const element = getDownloadElement();
            if (!element) {
                toast.error('Bio-data preview not ready. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                });
                return;
            }

            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });
            const trimmedCanvas = trimCanvasWhiteSpace(canvas);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = ZERO_MARGIN_PDF_TEMPLATES.has(customizeData?.selected_theme) ? 0 : PDF_PAGE_MARGIN_MM;
            const imgWidth = pageWidth - margin * 2;
            const pxPerMm = trimmedCanvas.width / imgWidth;
            const pageCanvasHeight = Math.floor((pageHeight - margin * 2) * pxPerMm);
            const trailingSliceTolerance = Math.max(12, Math.ceil(pageCanvasHeight * 0.01));
            let sourceY = 0;
            let pageIndex = 0;

            while (sourceY < trimmedCanvas.height) {
                const remaining = trimmedCanvas.height - sourceY;
                if (pageIndex > 0 && remaining <= trailingSliceTolerance) break;
                const sliceHeight = Math.min(pageCanvasHeight, remaining);
                const pageBreakY = remaining > pageCanvasHeight
                    ? findPageBreakRow(trimmedCanvas, sourceY + sliceHeight) - sourceY
                    : sliceHeight;
                const actualSliceHeight = Math.max(1, pageBreakY);
                if (pageIndex > 0 && actualSliceHeight <= trailingSliceTolerance) break;
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = trimmedCanvas.width;
                pageCanvas.height = actualSliceHeight;
                pageCanvas
                    .getContext('2d')
                    .drawImage(trimmedCanvas, 0, sourceY, trimmedCanvas.width, actualSliceHeight, 0, 0, trimmedCanvas.width, actualSliceHeight);

                if (pageIndex > 0) pdf.addPage();
                const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
                const imgHeight = actualSliceHeight / pxPerMm;
                pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
                sourceY += actualSliceHeight;
                if (trimmedCanvas.height - sourceY <= trailingSliceTolerance) break;
                pageIndex += 1;
            }

            const safeName = (resumeName || 'bio-data')
                .replace(/[^a-z0-9]+/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .toLowerCase() || 'bio-data';
            pdf.save(`${safeName}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
            toast.error('PDF download failed. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            });
        } finally {
            setLoading(false);
        }
    };
    // ────────────────────────────────────────────────────────────────────────────

    // Download as TEXT
    const downloadTXT = () => {
        const element = getDownloadElement();
        if (!element) {
            console.error('Resume text section not found!');
            return;
        }

        const content = element.innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bioData.txt';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Download as DOCX
    const downloadDOCX = () => {
        const element = getDownloadElement();
        if (!element) return;

        const lines = element.innerText.split(/\n+/);

        const isHeading = (line, index) => {
            return (
                index === 0 ||
                /^[A-Z\s]+$/.test(line.trim()) ||
                line.trim().length < 20
            );
        };

        const paragraphs = lines.map((line, index) =>
            new Paragraph({
                spacing: { after: 200 },
                children: [
                    new TextRun({
                        text: line.trim(),
                        bold: isHeading(line, index),
                    }),
                ],
            })
        );

        const doc = new Document({
            sections: [{ properties: {}, children: paragraphs }],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'bioData.docx');
        });
    };

    // ─── Print ──────────────────────────────────────────────────────────────────
    const handlePrint = () => {
        const resumeContent = componentRef.current?.querySelector(
            '#resume-download-area'
        );

        if (!resumeContent) {
            window.print();
            return;
        }

        const removeExistingPrintHelpers = () => {
            const existingPrintRoot = document.getElementById('__resume_print_root__');
            const existingStyle = document.getElementById('__resume_print_style__');
            if (existingPrintRoot) existingPrintRoot.remove();
            if (existingStyle) existingStyle.remove();
        };

        removeExistingPrintHelpers();

        const printContainer = document.createElement('div');
        printContainer.id = '__resume_print_root__';
        printContainer.style.cssText = `
            display: none;
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 9999999;
            background: #fff;
        `;

        const innerWrapper = document.createElement('div');
        innerWrapper.className = `print-wrapper ${customizationClasses}`;
        innerWrapper.style.cssText = `
            width: 100%;
            margin: 0;
            padding: 0;
        `;

        const clone = resumeContent.cloneNode(true);
        clone.style.cssText = `
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            box-shadow: none !important;
            overflow: visible !important;
            position: static !important;
        `;

        try {
            sanitizeComputedColors(resumeContent, clone);
        } catch (e) {
            // ignore
        }

        innerWrapper.appendChild(clone);
        printContainer.appendChild(innerWrapper);
        document.body.appendChild(printContainer);

        const styleTag = document.createElement('style');
        styleTag.id = '__resume_print_style__';
        styleTag.innerHTML = `
            @media print {
                body > *:not(#__resume_print_root__) {
                    display: none !important;
                    visibility: hidden !important;
                }
                html, body {
                    height: auto !important;
                    min-height: auto !important;
                    width: 210mm !important;
                    margin: 0 !important;
                    overflow: visible !important;
                    background: #fff !important;
                }
                #__resume_print_root__ {
                    display: block !important;
                    position: relative !important;
                    width: 210mm !important;
                    max-width: 100% !important;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #fff !important;
                    overflow: visible !important;
                }
                #__resume_print_root__ * {
                    visibility: visible !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                @page {
                    size: A4 portrait;
                    margin: 0 !important;
                }
            }
        `;
        document.head.appendChild(styleTag);

        const originalTitle = document.title;
        document.title = resumeName || 'Resume';

        const cleanup = () => {
            document.title = originalTitle;
            const el = document.getElementById('__resume_print_root__');
            const st = document.getElementById('__resume_print_style__');
            if (el) el.remove();
            if (st) st.remove();
            window.removeEventListener('afterprint', cleanup);
        };

        window.addEventListener('afterprint', cleanup);

        setTimeout(() => {
            const printWindow = window.open('', '_blank', 'width=800,height=900');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Resume</title></head><body></body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.document.body.innerHTML = printContainer.innerHTML;
                const printStyle = printWindow.document.createElement('style');
                printStyle.innerHTML = `
                    @page { size: A4 portrait; margin: 0; }
                    html, body { margin: 0; padding: 0; background: #fff; }
                    body { width: 210mm; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
                `;
                printWindow.document.head.appendChild(printStyle);
                printWindow.print();
                printWindow.addEventListener('afterprint', () => {
                    cleanup();
                    printWindow.close();
                });
            } else {
                window.print();
                setTimeout(cleanup, 1000);
            }
        }, 150);
    };
    // ────────────────────────────────────────────────────────────────────────────

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                /* ── LOADER ───────────────────────────────────────────── */
                .loader-div {
                    position: fixed !important;
                    inset: 0 !important;
                    z-index: 999999 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.6) !important;
                }

                /* ── NATIVE PRINT FIX ─────────────────────────────────── */
                @media print {
                    body > *:not(#__resume_print_root__) {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    html, body {
                        height: auto !important;
                        min-height: auto !important;
                        overflow: visible !important;
                    }
                    #__resume_print_root__ {
                        display: block !important;
                        position: relative !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                        overflow: visible !important;
                    }
                    #__resume_print_root__ * {
                        visibility: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin-top: 15mm !important;
                        margin-bottom: 15mm !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    @page :first {
                        margin-top: 0 !important;
                    }
                }
            `}} />

            <section className='show-resume-section pb-5 pb-md-0 mb-5 mb-md-0'>
                <div className='left-customize-and-resumes-div'>
                    <div className='tabs-btn-div nav nav-tabs'>
                        <button type="button" className='active nav-item' data-bs-toggle="tab" data-bs-target="#templates">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 2.5V4C15 5.414 15 6.121 15.44 6.56C15.878 7 16.585 7 18 7H19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 11H16M8 14H16M8 17H12.17M4 16V8C4 5.172 4 3.757 4.879 2.879C5.757 2 7.172 2 10 2H14.172C14.58 2 14.785 2 14.969 2.076C15.152 2.152 15.297 2.296 15.586 2.586L19.414 6.414C19.704 6.704 19.848 6.848 19.924 7.032C20 7.215 20 7.42 20 7.828V16C20 18.828 20 20.243 19.121 21.121C18.243 22 16.828 22 14 22H10C7.172 22 5.757 22 4.879 21.121C4 20.243 4 18.828 4 16Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Templates
                        </button>
                        <button type="button" className='nav-item' role="presentation" data-bs-toggle="tab" data-bs-target="#customization">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5.25 1.5C5.05109 1.5 4.86032 1.57902 4.71967 1.71967C4.57902 1.86032 4.5 2.05109 4.5 2.25V13.875C4.5 14.5712 4.77656 15.2389 5.26884 15.7312C5.76113 16.2234 6.42881 16.5 7.125 16.5H9V19.5C9 20.2956 9.31607 21.0587 9.87868 21.6213C10.4413 22.1839 11.2044 22.5 12 22.5C12.7956 22.5 13.5587 22.1839 14.1213 21.6213C14.6839 21.0587 15 20.2956 15 19.5V16.5H16.875C17.5712 16.5 18.2389 16.2234 18.7312 15.7312C19.2234 15.2389 19.5 14.5712 19.5 13.875V2.25C19.5 2.05109 19.421 1.86032 19.2803 1.71967C19.1397 1.57902 18.9489 1.5 18.75 1.5H5.25ZM13.5 2.25H15.75V7.125C15.75 7.22446 15.7895 7.31984 15.8598 7.39017C15.9302 7.46049 16.0255 7.5 16.125 7.5C16.2245 7.5 16.3198 7.46049 16.3902 7.39017C16.4605 7.31984 16.5 7.22446 16.5 7.125V2.25H18.75V11.25H5.25V2.25H12.75V5.625C12.75 5.72446 12.7895 5.81984 12.8598 5.89016C12.9302 5.96049 13.0255 6 13.125 6C13.2245 6 13.3198 5.96049 13.3902 5.89016C13.4605 5.81984 13.5 5.72446 13.5 5.625V2.25ZM5.25 12H18.75V13.875C18.75 14.3723 18.5525 14.8492 18.2008 15.2008C17.8492 15.5525 17.3723 15.75 16.875 15.75H15C14.8011 15.75 14.6103 15.829 14.4697 15.9697C14.329 16.1103 14.25 16.3011 14.25 16.5V19.5C14.25 20.0967 14.0129 20.669 13.591 21.091C13.169 21.5129 12.5967 21.75 12 21.75C11.4033 21.75 10.831 21.5129 10.409 21.091C9.98705 20.669 9.75 20.0967 9.75 19.5V16.5C9.75 16.3011 9.67098 16.1103 9.53033 15.9697C9.38968 15.829 9.19891 15.75 9 15.75H7.125C6.62772 15.75 6.15081 15.5525 5.79917 15.2008C5.44754 14.8492 5.25 14.3723 5.25 13.875V12Z" stroke="#000" strokeWidth="1" />
                            </svg>
                            Customization
                        </button>
                    </div>

                    <div className="tab-content costomize-tab-content">
                        <div className="tab-pane fade show active" id="templates" role="tabpanel">
                            <div className="row gx-3 gy-0">
                                {AVAILABLE_TEMPLATES.map((template) => {
                                    const TemplateComponent = template.component;
                                    return (
                                        <div key={template.id} className={`col-md-6 mb-2 ${customizeData?.selected_theme === template.id ? 'active' : ''}`}>
                                            <label className='each-resume-label'>
                                                <input type="radio" name="selectResume" checked={customizeData?.selected_theme === template.id}
                                                    onChange={() => handleCustomizationChange('selected_theme', template.id)} hidden />
                                                <img src="/front-assets/images/icons/resume-selected.svg" className='img-fluid resume-selected-icon' alt="Checked" />
                                                <TemplateComponent isStatic={true} additionalClass={customizationClasses} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="customization" role="tabpanel">
                            <div className='customization-div'>
                                <p className='heading fs-mob-20'>Customization</p>
                                <div className={`each-collapse-div ${activeIndexes.includes(0) ? 'active' : ''}`}>
                                    <button type='button' className='collapse-btn' onClick={() => toggleIndex(0)}>
                                        Font Style Options
                                    </button>
                                    <div className='collapse-content'>
                                        <label>
                                            <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'poppins'}
                                                onChange={() => handleCustomizationChange('font_style', 'poppins')} hidden />
                                            <div className='radio-btn'></div>
                                            Poppins
                                        </label>
                                        <label>
                                            <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'roboto'}
                                                onChange={() => handleCustomizationChange('font_style', 'roboto')} hidden />
                                            <div className='radio-btn'></div>
                                            Roboto
                                        </label>
                                        <label>
                                            <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'arial'}
                                                onChange={() => handleCustomizationChange('font_style', 'arial')} hidden />
                                            <div className='radio-btn'></div>
                                            Arial
                                        </label>
                                        <label>
                                            <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'montserrat'}
                                                onChange={() => handleCustomizationChange('font_style', 'montserrat')} hidden />
                                            <div className='radio-btn'></div>
                                            Montserrat
                                        </label>
                                    </div>
                                </div>

                                <div className={`each-collapse-div ${activeIndexes.includes(2) ? 'active' : ''}`}>
                                    <button type='button' className='collapse-btn' onClick={() => toggleIndex(2)}>
                                        Color Palette
                                    </button>
                                    <div className='collapse-content color-palette-div'>
                                        <label className='color1'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-1'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-1')} hidden />
                                        </label>
                                        <label className='color2'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-2'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-2')} hidden />
                                        </label>
                                        <label className='color3'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-3'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-3')} hidden />
                                        </label>
                                        <label className='color4'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-4'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-4')} hidden />
                                        </label>
                                        <label className='color5'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-5'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-5')} hidden />
                                        </label>
                                        <label className='color6'>
                                            <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-6'}
                                                onChange={() => handleCustomizationChange('color_palette', 'color-6')} hidden />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='middle-resume-preview-div'>
                    <div className='header-part-div'>
                        <div className={isEditable === true ? 'resume-name editable-on' : 'resume-name'}>
                            <div ref={editableDivRef} contentEditable={isEditable} suppressContentEditableWarning={true} id='resumeName' className='fs-mob-16'> {resumeName} </div>
                            <button onClick={() => setIsEditable(true)} className={isEditable === true ? 'd-none' : 'd-block'}><img src="/front-assets/images/icons/pen-icon.svg" alt="Edit" /></button>
                            <button onClick={saveResumeName} className={isEditable === true ? 'd-block' : 'd-none'}><img src="/front-assets/images/icons/tick.svg" alt="Done" /></button>
                        </div>
                        <div className='edit-zoom-div'>
                            <Link prefetch={false} href={`/bio-data/personal-info/?id=${id}`} className="edit-btn">
                                Edit Details
                            </Link>
                            <div className='zoom-div'>
                                <button 
                                    onMouseDown={startZoomOut}
                                    onMouseUp={stopZoom}
                                    onMouseLeave={stopZoom}
                                    onTouchStart={startZoomOut}
                                    onTouchEnd={stopZoom}
                                    className={zoomValue < 41 ? 'pe-none disabled' : ''}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none">
                                        <path d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H13C13.2652 0 13.5196 0.105357 13.7071 0.292893C13.8946 0.48043 14 0.734784 14 1C14 1.26522 13.8946 1.51957 13.7071 1.70711C13.5196 1.89464 13.2652 2 13 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1Z" fill="#008AD5" />
                                    </svg>
                                </button>
                                <span>{zoomValue}%</span>
                                <button 
                                    onMouseDown={startZoomIn}
                                    onMouseUp={stopZoom}
                                    onMouseLeave={stopZoom}
                                    onTouchStart={startZoomIn}
                                    onTouchEnd={stopZoom}
                                    className={zoomValue > 99 ? 'pe-none disabled' : ''}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M6 8H1C0.71667 8 0.479337 7.904 0.288004 7.712C0.0966702 7.52 0.000670115 7.28267 3.44827e-06 7C-0.000663218 6.71734 0.0953369 6.48 0.288004 6.288C0.48067 6.096 0.718003 6 1 6H6V1C6 0.71667 6.096 0.479337 6.288 0.288004C6.48 0.0966702 6.71734 0.000670115 7 3.44827e-06C7.28267 -0.000663218 7.52034 0.0953369 7.713 0.288004C7.90567 0.48067 8.00134 0.718003 8 1V6H13C13.2833 6 13.521 6.096 13.713 6.288C13.905 6.48 14.0007 6.71734 14 7C13.9993 7.28267 13.9033 7.52034 13.712 7.713C13.5207 7.90567 13.2833 8.00134 13 8H8V13C8 13.2833 7.904 13.521 7.712 13.713C7.52 13.905 7.28267 14.0007 7 14C6.71734 13.9993 6.48 13.9033 6.288 13.712C6.096 13.5207 6 13.2833 6 13V8Z" fill="#008AD5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='review-resume-area main-review-resume-div' style={{ width: zoomValue + '%' }}>
                        <div ref={componentRef} className={`print-wrapper review-resume-div ${customizationClasses}`}>
                            <ReviewResume isMainPreview={true} />
                        </div>
                    </div>
                </div>

                <div className='right-download-div'>
                    <p className='download-heading'>Downloads</p>
                    <button className='each-btn' onClick={downloadPDF}>
                        <img src="/front-assets/images/icons/download-pdf.svg" alt="PDF" />
                        PDF
                    </button>
                    <button className='each-btn' onClick={downloadDOCX}>
                        <img src="/front-assets/images/icons/download-docx.svg" alt="DOCX" />
                        DOCX
                    </button>
                    <button className='each-btn' onClick={downloadTXT}>
                        <img src="/front-assets/images/icons/download-txt.svg" alt="TXT" />
                        TXT
                    </button>
                    <p className='download-heading'>Printing</p>
                    <button className='each-btn' onClick={downloadPDF}>
                        <img src="/front-assets/images/icons/print.svg" alt="Print" />
                        Print
                    </button>
                </div>

                {/* Customization mobile slider start */}
                <div ref={sliderCustRef} className={`mob-customization-slider d-lg-none ${mobCustomizeSlider === 'open' ? 'open' : ''}`}>
                    <div className='header'>
                        Customization
                        <img src="/front-assets/images/icons/close-cross.svg" onClick={() => setMobCustomizeSlider()} alt="Close" />
                    </div>
                    <div className="scroll-div">
                        <div className={`each-collapse-div ${activeIndexes.includes(0) ? 'active' : ''}`}>
                            <button type='button' className='collapse-btn' onClick={() => toggleIndex(0)}>Font Style Options</button>
                            <div className='collapse-content'>
                                <label><input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'poppins'} onChange={() => handleCustomizationChange('font_style', 'poppins')} hidden /><div className='radio-btn'></div>Poppins</label>
                                <label><input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'roboto'} onChange={() => handleCustomizationChange('font_style', 'roboto')} hidden /><div className='radio-btn'></div>Roboto</label>
                                <label><input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'arial'} onChange={() => handleCustomizationChange('font_style', 'arial')} hidden /><div className='radio-btn'></div>Arial</label>
                                <label><input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'montserrat'} onChange={() => handleCustomizationChange('font_style', 'montserrat')} hidden /><div className='radio-btn'></div>Montserrat</label>
                            </div>
                        </div>

                        <div className={`each-collapse-div ${activeIndexes.includes(2) ? 'active' : ''}`}>
                            <button type='button' className='collapse-btn' onClick={() => toggleIndex(2)}>Color Palette</button>
                            <div className='collapse-content color-palette-div'>
                                <label className='color1'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-1'} onChange={() => handleCustomizationChange('color_palette', 'color-1')} hidden /></label>
                                <label className='color2'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-2'} onChange={() => handleCustomizationChange('color_palette', 'color-2')} hidden /></label>
                                <label className='color3'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-3'} onChange={() => handleCustomizationChange('color_palette', 'color-3')} hidden /></label>
                                <label className='color4'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-4'} onChange={() => handleCustomizationChange('color_palette', 'color-4')} hidden /></label>
                                <label className='color5'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-5'} onChange={() => handleCustomizationChange('color_palette', 'color-5')} hidden /></label>
                                <label className='color6'><input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-6'} onChange={() => handleCustomizationChange('color_palette', 'color-6')} hidden /></label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Customization mobile slider end */}

                {/* Template mobile slider start */}
                <div ref={sliderTempRef} className={`mob-customization-slider d-lg-none ${mobTemplateSlider === 'open' ? 'open' : ''}`}>
                    <div className='header'>
                        Templates
                        <img src="/front-assets/images/icons/close-cross.svg" onClick={() => setMobTemplateSlider()} alt="Close" />
                    </div>
                    <div className="scroll-div">
                        <div className="row resume-slider-row">
                            {AVAILABLE_TEMPLATES.map((template) => {
                                const TemplateComponent = template.component;
                                return (
                                    <div key={template.id} className={`col-6 mb-2 ${customizeData?.selected_theme === template.id ? 'active' : ''}`}>
                                        <label className='each-resume-label'>
                                            <input type="radio" name="selectResumeMob" checked={customizeData?.selected_theme === template.id}
                                                onChange={() => handleCustomizationChange('selected_theme', template.id)} hidden />
                                            <img src="/front-assets/images/icons/resume-selected.svg" className='img-fluid resume-selected-icon' alt="Checked" />
                                            <TemplateComponent isStatic={true} additionalClass={customizationClasses} />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Template mobile slider end */}

                <div className="mob-show-bottom-nav custom-container d-lg-none">
                    <div className='form-button-div'>
                        <div className='all-mob-btn-div'>
                            <button type='button' className='each-btn' onClick={downloadPDF}>
                                <img src="/front-assets/images/icons/download-pdf.svg" width={24} height={24} className='img-fluid' alt="PDF" />
                                Download
                            </button>
                            <button type='button' className='each-btn' onClick={handlePrint}>
                                <img src="/front-assets/images/icons/print.svg" width={24} height={24} className='img-fluid' alt="Print" />
                                Print
                            </button>
                            <Link prefetch={false} href={`/bio-data/personal-info/?id=${id}`} className="edit-btn">
                                <img src="/front-assets/images/icons/edit-details.svg" width={22} height={24} className='img-fluid' alt="Edit" />
                                Edit Details
                            </Link>
                        </div>
                        <div className='template-customization-btn-div mt-2'>
                            <button type='button' onClick={() => setMobTemplateSlider('open')}>Templates</button>
                            <button type='button' onClick={() => setMobCustomizeSlider('open')}>Customization</button>
                        </div>
                    </div>
                </div>
            </section>

            {loading && (
                <div className='loader-div flex-column'>
                    <img src='/front-assets/images/pleasewait.gif' width={250} alt='Please wait' />
                    <p className='text-white m-0'>Generating...</p>
                </div>
            )}

            <ToastContainer />
        </>
    )
}
