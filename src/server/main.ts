import next from "next";
import express, { static as express_static } from "express";

const dev = process.env.NODE_ENV !== 'production'
const next_app = next({ dev })
const handle_next_app_request = next_app.getRequestHandler()

async function main() {
    await next_app.prepare()
    const server = express()

    server.get('*', (req, res) => {
        return handle_next_app_request(req, res)
    })

    server.listen(3000, "localhost", () => {
        console.log('> Ready on http://localhost:3000')
    })
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
