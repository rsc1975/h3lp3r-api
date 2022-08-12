import { app } from "./app";


const port = parseInt(process.env.PORT) || 3003;
const host = parseInt(process.env.HOST) || '0.0.0.0';

console.log(`Running at http://${host}:${port}`);

export default {
  port,
  host,
  fetch: app.fetch,
};

// const exitApp = async (err: any) => {
//   !!err && console.error(err);
//   process.exit(err ? 1 : 0);
  
// }
// process.on('unhandledRejection', exitApp);
// process.on('SIGINT', exitApp);

