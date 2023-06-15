import next from "next";
import express from "express";

import { api_router } from "./routes";

const dev = process.env.NODE_ENV !== 'production';
const next_app = next({ dev });
const handle_next_app_request = next_app.getRequestHandler();

async function main() {
    await next_app.prepare();
    const server = express();

    server.use("/api", api_router);

    server.use("/", (request, response) => {
        return handle_next_app_request(request, response);
    })

    server.listen(3000, "localhost", () => {
        console.log(`> Server listening on http://localhost:3000 as ${dev ? 'development' : process.env.NODE_ENV}`);
    })
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
