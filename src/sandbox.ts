import { Hono, type Context } from "https://deno.land/x/hono@v2.1.4/mod.ts";


const port = +(Deno.env.get('PORT') || 3003);
const hostname = Deno.env.get('HOST') || '0.0.0.0';

const app = new Hono({"strict": true});

const jsonHandler = (c: Context) => {        
  return c.json({
      "server": "This a dummy server",
      "version": "0.0.1"
  });
}

const txtHandler = (c: Context) => c.text('PONG');

app.get('/', jsonHandler);
app.get("/ping", txtHandler);

//const api = new Hono({"strict": true});
//api.get('', jsonHandler);
//api.get("/ping", txtHandler);
//app.route('/api', api);
  
// New server
Deno.serve(app.fetch, { port, hostname });

// Old server
// serve(app.fetch, { port, hostname });
