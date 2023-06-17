import next from "next";

const next_app = next({ dev: process.env.NODE_ENV !== "production" });

export default next_app;
export const handle_next_app_request = next_app.getRequestHandler();