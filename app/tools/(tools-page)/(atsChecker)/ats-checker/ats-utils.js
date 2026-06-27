import mammoth from "mammoth";
import Tesseract from "tesseract.js";

/* ---------------- PDF TEXT EXTRACTION ---------------- */

export async function extractPdfText(file) {

    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        text += content.items
            .map(item => item.str)
            .join(" ") + "\n";
    }

    return text;
}

/* ---------------- OCR FOR IMAGE PDF ---------------- */

export async function extractPdfOCR(file) {

    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer,
    }).promise;

    let extractedText = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {

        const page = await pdf.getPage(pageNo);

        const viewport = page.getViewport({
            scale: 2,
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: ctx,
            viewport,
        }).promise;

        const imageData = canvas.toDataURL("image/png");

        const result = await Tesseract.recognize(
            imageData,
            "eng",
            {
                logger: (m) => {
                    console.log(m);
                },
            }
        );

        extractedText += result.data.text + "\n";
    }

    return extractedText;
}

/* ---------------- DOCX ---------------- */

export async function extractDocxText(file) {

    const buffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
        arrayBuffer: buffer,
    });

    return result.value || "";
}

/* ---------------- ATS SCORE ---------------- */

export function calculateATSScore(text = "") {

    const checks = {

        email:
            /\S+@\S+\.\S+/.test(text),

        phone:
            /\+?\d[\d\s\-()]{8,}/.test(text),

        linkedin:
            /linkedin\.com/i.test(text),

        education:
            /(education|b\.tech|bca|mca|degree|bachelor|master)/i.test(text),

        experience:
            /(experience|employment|developer|engineer|internship|manager)/i.test(text),

        skills:
            /(skills|javascript|react|next|node|php|laravel|mysql|html|css|python|java|sql)/i.test(text),

        summary:
            /(summary|objective|profile)/i.test(text),
    };

    let score = 0;

    if (checks.email) score += 15;
    if (checks.phone) score += 15;
    if (checks.linkedin) score += 10;
    if (checks.education) score += 15;
    if (checks.experience) score += 20;
    if (checks.skills) score += 15;
    if (checks.summary) score += 10;

    const suggestions = [];

    if (!checks.email)
        suggestions.push("Add a professional email address.");

    if (!checks.phone)
        suggestions.push("Add a valid phone number.");

    if (!checks.linkedin)
        suggestions.push("Add your LinkedIn profile URL.");

    if (!checks.education)
        suggestions.push("Include an education section.");

    if (!checks.experience)
        suggestions.push("Add work experience or internship details.");

    if (!checks.skills)
        suggestions.push("Add a dedicated skills section.");

    if (!checks.summary)
        suggestions.push("Add a professional summary section.");

    if (text.length < 1000)
        suggestions.push("Resume content appears short. Add more details.");

    return {
        score: Math.min(score, 100),
        checks,
        suggestions,
    };
}

/* ---------------- JD MATCH ---------------- */

export function calculateKeywordMatch(
    resumeText = "",
    jobDescription = ""
) {

    if (!jobDescription.trim()) {
        return {
            keywordScore: 0,
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    const stopWords = new Set([
        "the",
        "and",
        "for",
        "with",
        "from",
        "that",
        "this",
        "have",
        "your",
        "will",
        "you",
        "our",
        "are",
        "job",
        "role",
        "required",
        "requirements",
        "candidate",
        "experience",
        "skills",
        "years",
        "work",
    ]);

    const words = jobDescription
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 3);

    const jdKeywords = [
        ...new Set(
            words.filter(
                word => !stopWords.has(word)
            )
        ),
    ];

    const resumeLower = resumeText.toLowerCase();

    const matchedKeywords = [];
    const missingKeywords = [];

    jdKeywords.forEach((keyword) => {

        if (resumeLower.includes(keyword)) {
            matchedKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }

    });

    const keywordScore =
        jdKeywords.length > 0
            ? Math.round(
                (matchedKeywords.length /
                    jdKeywords.length) * 100
            )
            : 0;

    return {
        keywordScore,
        matchedKeywords: matchedKeywords.slice(0, 25),
        missingKeywords: missingKeywords.slice(0, 25),
    };
}