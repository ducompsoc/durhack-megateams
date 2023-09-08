# `/src/app`
## Where am I?
This is where all the forward-facing content goes!
## What goes here?
- Site metadata (incl. SEO content)
- Pages' content and code (as React components)
- Stylesheets (imported using JSX syntax)
- Components

## What doesn't?
- Images (they go in `/public`)
- API Routes (they go in `/src/server/routes`)

# Routing
The only routable files are the ones called `page` or `route`. All other files are considered to be 'supporting' files 
and are ignored by the `Next.js` router. See the [Next.js Docs](https://nextjs.org/docs/app/building-your-application/routing/colocation) for a more in-depth explanation.
