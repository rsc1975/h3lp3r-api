import { Context, Hono } from "https://deno.land/x/hono@v2.0.8/mod.ts";

import { getCallerIP, getVersion } from "../commons/utils.ts";
import { SERVER_TEXT } from "../domain/misc.ts";

export const rootRoutes = new Hono();

export const rootHandler = async (c: Context) => {
  return c.json({ server: SERVER_TEXT, version: await getVersion() });
}

rootRoutes.get('', rootHandler);

rootRoutes.get("/ip", (c: Context) => {        
    return c.text(getCallerIP(c));
});




    