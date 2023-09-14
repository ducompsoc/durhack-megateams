"use client";

import { fetchMegateamsApi } from "@/app/lib/api";
import useUser from "@/app/lib/useUser";
import Image from "next/image";
import { FormEvent } from "react";

export default function Login() {
  const { mutateUser, isLoading } = useUser({ redirectIfFound: true });

  async function send_login_request(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    // @ts-ignore (see https://github.com/microsoft/TypeScript/issues/30584)
    const encoded_form_data = new URLSearchParams(form_data);
    const user = await fetchMegateamsApi("/auth/login", {
      method: "POST",
      body: encoded_form_data,
    });
    mutateUser(user);
  }

  return (
    <>
      {!isLoading && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:text-neutral-200">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex flex-row py-4 px-6 items-center justify-center justify-center mb-4 pt-0">
              <Image
                src="/logo.png"
                alt="DurHack Logo"
                width={64}
                height={64}
              />
              <h1 className="text-4xl font-bold ml-4 font-heading">DURHACK</h1>
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-neutral-200">
              Sign in to your account
            </h2>
          </div>

          <form
            className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
            onSubmit={send_login_request}
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="email"
                    required
                    className="dh-input w-full"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="dh-input w-full"
                  />
                </div>
              </div>

              <div>
                <button className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 hover:text-black">
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
