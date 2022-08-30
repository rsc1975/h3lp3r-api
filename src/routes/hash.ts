import { Context, Hono } from "hono";
import { getCommandInput } from "../commons/inputs";
import { CommandResponse } from "../domain/commands";

import { SHA1, SHA224, SHA256, SHA384, SHA512, MD5 } from "bun";



const HASH_OPERATIONS : Record<string, Function> = {
    sha256: () => new SHA256(),
    sha512: () => new SHA512(),
    sha1: () => new SHA1(),
    sha224: () => new SHA224(),
    sha384: () => new SHA384(),
    md5: () => new MD5(),
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


