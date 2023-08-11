"use client";

import { attachCsrfTokenToRequest } from "@/app/lib/csrf";
import { makeMegateamsApiRequest } from "@/app/lib/api";
import { FormEvent } from "react";

async function send_login_request(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form_data = new FormData(event.currentTarget);
  // @ts-ignore (see https://github.com/microsoft/TypeScript/issues/30584)
  const encoded_form_data = new URLSearchParams(form_data);
  const request = makeMegateamsApiRequest("/auth/login", { method: "POST", body: encoded_form_data });
  await attachCsrfTokenToRequest(request);
  await fetch(request);
}

async function send_set_password_request(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form_data = new FormData(event.currentTarget);
  // @ts-ignore (same as above)
  const encoded_form_data = new URLSearchParams(form_data);
  const request = makeMegateamsApiRequest("/auth/setpassword", { method: "POST", body: encoded_form_data });
  await attachCsrfTokenToRequest(request);
  await fetch(request);
}

export default function CsrfTestPage() {
  return <main>
    <form id={"login-form"} onSubmit={send_login_request}>
      <h1>Login Form</h1>
      <label htmlFor={"login-email"}>Email</label>
      <input id={"login-email"} type={"text"} name={"username"}/>
      <label htmlFor={"login-password"}>Password</label>
      <input id={"login-password"} type={"text"} name={"password"}/>
      <input type={"submit"}/>
    </form>

    <form id={"password-form"} onSubmit={send_set_password_request}>
      <h1>Set Password Form</h1>
      <label htmlFor={"password-email"}>Email</label>
      <input id={"password-email"} type={"text"} name={"email"}/>
      <label htmlFor={"password-password"}>Password</label>
      <input id={"password-password"} type={"text"} name={"password"}/>
      <input type={"text"} name={"verify_code"} value={"123456"} readOnly hidden/>
      <input type={"submit"}/>
    </form>
  </main>;
}
