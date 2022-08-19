import { serve } from "https://deno.land/std@0.152.0/http/server.ts"

import { app } from "./app.ts";


const port = +(Deno.env.get('PORT') || 3003);
const hostname = Deno.env.get('HOST') || '0.0.0.0';

//console.log(`Running at http://${host}:${port}`);

export default {
  port,
  host: hostname,
  fetch: app.fetch,
};

const listeningTxt = () => console.log(`✅♾️  ➡️ Server listening at http://${hostname}:${port}`);

Deno.addSignalListener("SIGINT", () => {  
  console.log("⏹️ ➡️ Server interrupted!");
  console.log(`⏱️ ➡️ Server was running for: ${(performance.now()/1000).toFixed(1)}s`);
  
  Deno.exit();
});

serve(app.fetch, { port, hostname, onListen: listeningTxt });


