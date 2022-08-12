import { Context, Hono, Next } from "hono";

import pkg from "../package.json";
import { getPathFromURL } from "./commons/inputs";
import { ErrorResponse } from "./domain/commands";
import { baseRoutes } from "./routes/base";
import { hashRoutes } from "./routes/hash";
import { randomRoutes } from "./routes/random";

export const app = new Hono();

app.use('*', async (c: Context, next: Next) => {
    const start = Bun.nanoseconds();
    await next(); 
    const elapsed = Bun.nanoseconds() - start;
    c.res.headers.set('X-Response-Time', `${(elapsed / 1000000).toFixed(2)}ms`);
});


app.get("/", (c) => {
    return c.json({ server: "H3lp3r API", version: pkg.version });
  });

app.get("/ip", (c) => {    
    
    let remoteIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') ||c.req.header('cf-connecting-ip')
    || 'unknown';
    remoteIp = remoteIp.split(',')[0].trim();
    return c.text(remoteIp);
});



app.onError((err: Error, c: Context) => {
    const status = c.get('response-status') || 500;
    return c.json(<ErrorResponse>{
        error: err.message || err.toString(),
        path: getPathFromURL(c.req.url),
        params: c.req.query()
    }, status);    
})

app.route('/random', randomRoutes);
app.route('/hash', hashRoutes);
app.route('/base', baseRoutes);

