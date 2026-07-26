"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function TypingError({ error, reset }) {
  useEffect(() => {
    console.error("Typing module navigation error:", error);
  }, [error]);

  return (
    <main className="tf-page">
      <div className="container-fluid custom-container">
        <section className="tf-card p-4 p-sm-5 text-center">
          <p className="tf-text-muted mb-3">The typing page could not finish loading.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button type="button" onClick={reset} className="tf-btn-brand btn px-4">Try again</button>
            <Link href="/typing" prefetch={false} className="tf-keycap btn px-4">Typing home</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
