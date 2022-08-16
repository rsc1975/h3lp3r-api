import { Context, Hono } from 'https://deno.land/x/hono/mod.ts';

import { getCommandInput } from "../commons/inputs.ts";
import { CommandResponse } from "../domain/commands.ts";

const CONVERT_OPERATIONS : Record<string, any> = {
  epoch: (value: number | string, unit: 'ms' | 'sec') => {
    value = +value * (unit === 'sec' ? 1000 : 1);
    return new Date(value).toISOString();
  },
};

export const convRoutes = new Hono();

convRoutes.get("/", (c: Context) => {
  return c.text('Base commands');
});

convRoutes.get("/epoch", (c: Context) => {

  const input = getCommandInput(c, {action: 'epoch', paramsName: ['value', 'unit'], mandatoryParams: ['value']});
  if (['ms', 'sec'].includes(<string>input.params.unit || '')) {
    input.params.unit = 'ms';
  }
  
  const result = CONVERT_OPERATIONS[input.action](input.params.value, input.params.unit);

  return c.json(<CommandResponse>{result, input});
});




    