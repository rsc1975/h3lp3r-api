import { Hono, type Context } from "https://deno.land/x/hono@v2.1.3/mod.ts";
import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { rootRoutes } from "./routes/root.ts";

const port = +(Deno.env.get('PORT') || 3003);
const hostname = Deno.env.get('HOST') || '0.0.0.0';

const app = new Hono({"strict": true});

  
  app.get('', (c: Context) => {        
    return c.json({
        "server": "This a dummy server",
        "version": "0.0.1"
    });
  });
  
  
  app.get("/ping", (c: Context) => {        
    return c.text('PONG');
  });
  


// New server
//Deno.serve(app.fetch, { port, hostname });

// Old server
serve(app.fetch, { port, hostname });
