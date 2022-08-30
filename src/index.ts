import { serve } from "bun";

import { app } from "./app";


const port = +(process.env.PORT || 3003);
const hostname = process.env.HOST || '0.0.0.0';

//console.log(`Running at http://${host}:${port}`);

export default {
  port,
  host: hostname,
  fetch: app.fetch,

};

const listeningTxt = () => console.log(`✅♾️ ➡️ Server listening at http://${hostname}:${port}`);

listeningTxt();

// Deno.addSignalListener("SIGINT", () => {  
//   console.log("❌ ➡️ Server interrupted!");
//   console.log(`⏱️ ➡️ Server was running for: ${(performance.now()/1000).toFixed(1)}s`);
  
//   Deno.exit();
// });

// serve(app.fetch, { port, hostname, onListen: listeningTxt });

