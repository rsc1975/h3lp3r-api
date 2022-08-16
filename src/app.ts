import { Context, Hono, Next } from 'https://deno.land/x/hono/mod.ts';

import { cors } from 'https://deno.land/x/hono/middleware.ts';


import { getPathFromURL } from "./commons/inputs.ts";
import { getVersion } from "./commons/utils.ts";
import { ErrorResponse } from "./domain/commands.ts";
import { baseRoutes } from "./routes/base.ts";
import { convRoutes } from "./routes/convert.ts";
import { hashRoutes } from "./routes/hash.ts";
import { randomRoutes } from "./routes/random.ts";
import { ConnInfo } from 'https://deno.land/std/http/server.ts';

export const app = new Hono();

app.use('*', async (c: Context, next: Next) => {
    const start = performance.now();
    await next(); 
    const elapsed = performance.now() - start;
    c.res.headers.set('X-Response-Time', `${(elapsed / 1000).toFixed(2)}ms`);
});

app.use('*', cors())

app.use('*', async (c: Context, next: Next) => {
    const pretty = !!(c.req.query('_pretty') || c.req.query('_pretty') === '');
    c.pretty(pretty, 2);
    await next();     
});

app.get("/", async (c: Context) => {
    return c.json({ server: "H3lp3r API", version: await getVersion() });
  });

app.get("/ip", (c: Context) => {    
    //console.log(arguments);
    let remoteIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') ||c.req.header('cf-connecting-ip')
    || c.env.remoteAddr.hostname || 'unknown';
    console.log(c);
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
app.route('/convert', convRoutes);

