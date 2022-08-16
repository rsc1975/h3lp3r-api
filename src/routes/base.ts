

import { Context, Hono } from 'https://deno.land/x/hono/mod.ts';

import { getCommandInput } from "../commons/inputs.ts";
import { CommandResponse } from '../domain/commands.ts';

const BASE_OPERATIONS : Record<string, (s: string) => string> = {
  encode: (text: string) => btoa(text),
  decode: (textBase64: string) => atob(textBase64),
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




    