import { Context, Hono } from "../deps.ts";
import { getCommandInput } from "../commons/inputs.ts";
import { CommandResponse } from "../domain/commands.ts";
import { Hash } from "../deps.ts";



const HASH_OPERATIONS : Record<string, () => Hash> = {
    sha256: () => new Hash('sha256'),
    sha512: () => new Hash('sha512'),
    sha1: () => new Hash('sha1'),
    sha224: () => new Hash('sha224'),
    sha384: () => new Hash('sha384'),
    md5: () => new Hash('md5'),
    ripemd160: () => new Hash('ripemd160'),
    rmd160: () => new Hash('rmd160'),
};


const VALID_ACTIONS = Object.keys(HASH_OPERATIONS);


export const hashRoutes = new Hono();

hashRoutes.get("/", (c: Context) => {
  return c.text('Hash commands');
});

hashRoutes.get("/:action", (c: Context) => {
  const input = getCommandInput(c, { validActions: VALID_ACTIONS, paramsName: ['text']});

  const hasher = HASH_OPERATIONS[input.action]();
  const result = hasher.update(input.params.text as string).digest('hex');
  return c.json(<CommandResponse>{result, input});
});


