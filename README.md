# durhack-megateams

[![Continuous Integration](https://github.com/ducompsoc/durhack-megateams/actions/workflows/ci.yml/badge.svg)](https://github.com/ducompsoc/durhack-megateams/actions/workflows/ci.yml)

Building the megateams project for DurHack 2023.

## Stack
- Frontend framework: React.js
- CSS framework: Bootstrap (React-Bootstrap)
- Server Runtime: Node.js
- Package manager: NPM
- Database: MySQL


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Nginx Configuration
```
server {
    server_name megateams.durhack.com www.megateams.durhack.com;
    
    location /api {
        proxy_pass http://127.0.0.1:3101$request_uri;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme; 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://127.0.0.1:3100$request_uri;
	proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme; 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen [::]:80;
    listen 80;
}
```

## mysql server

Make sure you are running a [mysql server](https://dev.mysql.com/doc/refman/8.1/en/installing.html) 
on your machine before trying to run the project otherwise you will get connection refused errors etc.
as the javascript can't find a server to connect to on your localhost 🥲.

If your computer's `hosts` file contains `::1 localhost` (IPv6 local loopback) then you will need to use 
`127.0.0.1` as the database host, as the IPv6 spec clashes with the port spec (`::1:3306` is recognised as an IPv6 address,
not an address followed by a port).

This server should also have an appropriate user with permissions to manage the database, e.g.
```sql
CREATE USER 'durhack'@'localhost' IDENTIFIED BY 'durhack';
GRANT ALL PRIVILEGES ON durhack2023megateams.* TO 'durhack'@'localhost'
```
_This follows the naming used in the `.env.local` file given above_


## environment options
- `MEGATEAMS_SKIP_EMAIL_VERIFICATION`: set to `true` to allow users to set their password without verifying email
- `MEGATEAMS_NO_MITIGATE_CSRF`: set to `true` to allow `POST/PATCH/DELETE` (etc.) requests 
_without_ a CSRF hash cookie and token header.
