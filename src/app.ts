import { Context, Hono, Next } from "hono";

import { cors } from "hono/cors";

import { getPathFromURL } from "./commons/inputs";
import { ErrorResponse } from "./domain/commands";
import { baseRoutes } from "./routes/base";
import { convRoutes } from "./routes/convert";
import { hashRoutes } from "./routes/hash";
import { randomRoutes } from "./routes/random";
import { PRETTY_PARAM, RESPONSE_STATUS_KEY, RESPONSE_TIME_HEADER } from "./domain/misc";
import { infoRoutes } from "./routes/info";
import { rootRoutes } from "./routes/root";

export const CONTEXT_PATH = '/api'

export const app = new Hono({"strict": true});

const usemicros = true
const quiet = ''+process.env.QUIET === "true";

app.use('*', async (c: Context, next: Next) => {
    const start = performance.now();
    await next(); 
    
    const elapsed = (performance.now() - start);
    const elapsedTxt = usemicros ? `${(elapsed*1000).toFixed(0)} us` : `${elapsed.toFixed(2)} ms`;
    c.res.headers.set(RESPONSE_TIME_HEADER, elapsedTxt);
    if (!quiet) {        
        console.log(`📥 [${c.req.method}] ➡️ {status: ${c.res.status}, time: ${elapsedTxt}} - ${c.req.url} `);
    }
});

app.use('*', cors())

app.use('*', async (c: Context, next: Next) => {
    const pretty = !!(c.req.query(PRETTY_PARAM) || c.req.query(PRETTY_PARAM) === '');
    c.pretty(pretty, 2);
    await next();     
});


app.onError((err: Error, c: Context) => {
    const status = c.get(RESPONSE_STATUS_KEY) || 500;
    return c.json(<ErrorResponse>{
        error: err.message || err.toString(),
        path: getPathFromURL(c.req.url),
        params: c.req.query()
    }, status);    
})

//app.get('/', (c: Context) => c.text('OK?'));
//app.get('/', rootHandler);
app.route('/', rootRoutes);
app.route(`${CONTEXT_PATH}`, rootRoutes);

app.route(`${CONTEXT_PATH}/random`, randomRoutes);
app.route(`${CONTEXT_PATH}/hash`, hashRoutes);
app.route(`${CONTEXT_PATH}/base`, baseRoutes);
app.route(`${CONTEXT_PATH}/convert`, convRoutes);
app.route(`${CONTEXT_PATH}/info`, infoRoutes);

