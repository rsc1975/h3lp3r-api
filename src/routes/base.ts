import { Context, Hono } from "hono";

import { getCommandInput } from "../commons/inputs";
import { CommandResponse } from '../domain/commands';

const BASE_OPERATIONS : Record<string, (s: string) => string> = {
  encode: (text: string) => Buffer.from(text).toString("base64"),
  decode: (textBase64: string) => Buffer.from(textBase64, 'base64').toString("utf8"),
};

const VALID_ACTIONS = Object.keys(BASE_OPERATIONS);

export const baseRoutes = new Hono();

baseRoutes.get("/", (c: Context) => {
  return c.text('Base commands');
});

baseRoutes.get("/64/:action", (c: Context) => {

  const input = getCommandInput(c, {validActions: VALID_ACTIONS, paramsName: ['text']});

  const coderAction = BASE_OPERATIONS[input.action];
  const result = coderAction(input.params.text as string);
  return c.json(<CommandResponse>{result, input});
});




    