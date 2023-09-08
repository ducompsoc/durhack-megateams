import createServer from "next";

const next_app = createServer({ dev: process.env.NODE_ENV !== "production" });

export default next_app;
export const handle_next_app_request = next_app.getRequestHandler();