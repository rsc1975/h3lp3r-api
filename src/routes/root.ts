import { Context, Hono } from "hono";

import { getCallerIP, getVersion } from "../commons/utils";
import { SERVER_TEXT } from "../domain/misc";

export const rootRoutes = new Hono();

export const rootHandler = async (c: Context) => {
  return c.json({ server: SERVER_TEXT, version: await getVersion(), platform: {bun: process.version} });
}

rootRoutes.get('', rootHandler);

rootRoutes.get("/ip", (c: Context) => {        
    return c.text(getCallerIP(c));
});

rootRoutes.get("/ping", (c: Context) => {        
  return c.text('PONG');
});



    