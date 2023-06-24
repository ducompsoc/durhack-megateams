import Image from "next/image";

export default function Register() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-row py-4 px-6 items-center justify-center justify-center mb-4 pt-0">
        <Image src="/logo.png" alt="DurHack Logo" width={64} height={64} />
        <h1 className="text-4xl font-bold ml-4">DurHack</h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Repeat Password
            </label>
            <div className="mt-2">
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="full-name"
                name="full-name"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="preferred-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Preferred Name
            </label>
            <div className="mt-2">
              <input
                id="preferred-name"
                name="preferred-name"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Age
            </label>
            <div className="mt-2">
              <input
                id="age"
                name="age"
                type="number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phone-number"
                name="phone-number"
                type="tel"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="discord-id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Discord ID
            </label>
            <div className="mt-2">
              <input
                id="discord-id"
                name="discord-id"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="discord-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Discord Name
            </label>
            <div className="mt-2">
              <input
                id="discord-name"
                name="discord-name"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="university"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              University
            </label>
            <div className="mt-2">
              <input
                id="university"
                name="university"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="graduation-year"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Graduation Year
            </label>
            <div className="mt-2">
              <select
                id="graduation-year"
                name="graduation-year"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="ethnicity"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Ethnicity
            </label>
            <div className="mt-2">
              <input
                id="ethnicity"
                name="ethnicity"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Gender
            </label>
            <div className="mt-2">
              <input
                id="gender"
                name="gender"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="mt-2 flex items-center">
              <input
                id="hackathons"
                name="hackathons"
                type="checkbox"
                required
                className="text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
              />
            <label
              htmlFor="hackathons"
              className="block text-sm font-medium leading-6 text-gray-900 ml-4"
            >
              Hackathons UK Consent
            </label>
            </div>
            <p className="text-sm mt-2">Allow DurHack to share anonymised details with Hackathons UK.</p>
          </div>

          <div>
            <div className="mt-2 flex items-center">
              <input
                id="hackathons-marketing"
                name="hackathons-marketing"
                type="checkbox"
                required
                className="text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
              />
            <label
              htmlFor="hackathons-marketing"
              className="block text-sm font-medium leading-6 text-gray-900 ml-4"
            >
              Hackathons UK Marketing Consent
            </label>
            </div>
            <p className="text-sm mt-2">Allow Hackathons UK to contact you for marketing purposes.</p>
          </div>

          <div>
            <button className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 hover:text-black">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
