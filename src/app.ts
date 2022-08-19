import { Context, Hono, Next } from "https://deno.land/x/hono@v2.0.8/mod.ts";

import { cors } from "https://deno.land/x/hono@v2.0.8/middleware.ts";

import { getPathFromURL } from "./commons/inputs.ts";
import { getCallerIP, getVersion } from "./commons/utils.ts";
import { ErrorResponse } from "./domain/commands.ts";
import { baseRoutes } from "./routes/base.ts";
import { convRoutes } from "./routes/convert.ts";
import { hashRoutes } from "./routes/hash.ts";
import { randomRoutes } from "./routes/random.ts";
import { PRETTY_PARAM, RESPONSE_STATUS_KEY, RESPONSE_TIME_HEADER, SERVER_TEXT } from "./domain/misc.ts";
import { infoRoutes } from "./routes/info.ts";


export const app = new Hono();

app.use('*', async (c: Context, next: Next) => {
    const start = performance.now();
    await next(); 
    
    const elapsed = (performance.now() - start) * 1000;
    
    c.res.headers.set(RESPONSE_TIME_HEADER, `${elapsed.toFixed(1)} ns`);
});

app.use('*', cors())

app.use('*', async (c: Context, next: Next) => {
    const pretty = !!(c.req.query(PRETTY_PARAM) || c.req.query(PRETTY_PARAM) === '');
    c.pretty(pretty, 2);
    await next();     
});

app.get("/", async (c: Context) => {
    return c.json({ server: SERVER_TEXT, version: await getVersion() });
  });

app.get("/ip", (c: Context) => {        
    return c.text(getCallerIP(c));
});

app.onError((err: Error, c: Context) => {
    const status = c.get(RESPONSE_STATUS_KEY) || 500;
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
app.route('/info', infoRoutes);


