import { Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";


function rollingSecret(request?: Request): string {
    return "this_secret_does_not_roll"
}

export const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: rollingSecret,
    cookieOptions: {
        sameSite: "strict",
        path: "/",
        secure: true,
    },
})

export function handleGetCsrfToken(request: Request, response: Response): void {
    const csrfToken = generateToken(response, request);
    response.status(200);
    response.json({ "status": 200, "message": "OK", "token": csrfToken });
}
