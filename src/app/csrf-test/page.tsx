'use client';

import { attachCsrfTokenToRequest } from "@/app/lib/csrf";
import { makeMegateamsApiRequest } from "@/app/lib/api";

async function send_login_request() {
    const request = makeMegateamsApiRequest("/auth/login", { method: "POST" })
    await attachCsrfTokenToRequest(request);
    await fetch(request);
}

async function send_bad_login_request() {
    const request = makeMegateamsApiRequest("/auth/login", { method: "POST" })
    await fetch(request);
}

export default function CsrfTestPage() {
    return <main>
        <button onClick={send_login_request}>Send Login Request</button>
        <button onClick={send_bad_login_request}>Send Forbidden Login Request</button>
    </main>
}