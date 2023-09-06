import Image from "next/image";

export default function Login() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:text-neutral-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-row py-4 px-6 items-center justify-center justify-center mb-4 pt-0">
          <Image src="/logo.png" alt="DurHack Logo" width={64} height={64} />
          <h1 className="text-4xl font-bold ml-4 font-heading">DURHACK</h1>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-neutral-200">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-200"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
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
      </div>
    </div>
  );
}
