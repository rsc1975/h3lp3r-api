import { Context, Hono } from "../deps.ts";

import { getCommandInput } from "../commons/inputs.ts";
import { getCallerIP } from "../commons/utils.ts";
import { CommandResponse } from "../domain/commands.ts";


const INFO_OPERATIONS : Record<string, (c: Context) => string> = {
  useragent: (c: Context) => c.req.headers.get('user-agent') || '<unknown>',
  ip: (c: Context) => getCallerIP(c)
};
const VALID_ACTIONS = Object.keys(INFO_OPERATIONS);

export const infoRoutes = new Hono();

infoRoutes.get("/", (c: Context) => {
  return c.text('Info commands');
});

infoRoutes.get("/:action", (c: Context) => {
  const input = getCommandInput(c, { validActions: VALID_ACTIONS, paramsName: []});

  const result = INFO_OPERATIONS[input.action](c);

  return c.json(<CommandResponse>{result, input});
});

const echoFn = async (c: Context) => {
  const payload = await c.req.json() || {};
  return c.json(<CommandResponse>{...payload});
}
infoRoutes.post("/echo", echoFn);
infoRoutes.put("/echo", echoFn);
infoRoutes.patch("/echo", echoFn);




    