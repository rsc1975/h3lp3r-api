import { serve } from 'https://deno.land/std/http/server.ts'

import { app } from "./app.ts";


const port = +(Deno.env.get('PORT') || 3003);
const hostname = Deno.env.get('HOST') || '0.0.0.0';

//console.log(`Running at http://${host}:${port}`);

export default {
  port,
  host: hostname,
  fetch: app.fetch,
};

serve(app.fetch, { port, hostname });
// const exitApp = async (err: any) => {
//   !!err && console.error(err);
//   process.exit(err ? 1 : 0);
  
// }
// process.on('unhandledRejection', exitApp);
// process.on('SIGINT', exitApp);

// process.on('SIGINT', () => {
//   process.exit(1);
// });


