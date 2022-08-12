import { Context, Hono } from "hono";
const { MD4, MD5, SHA1, SHA224, SHA256, SHA384, SHA512, SHA512_256 } = Bun;
import { getCommandInput } from "../commons/inputs";
import { CommandResponse } from "../domain/commands";


const HASH_OPERATIONS = {
    SHA256: SHA256,
    SHA512: SHA512,
    SHA1: SHA1,
    SHA224: SHA224,
    SHA512_256: SHA512_256,
    SHA384: SHA384,
    MD4: MD4,
    MD5: MD5
};

const VALID_ACTIONS = Object.keys(HASH_OPERATIONS);


export const hashRoutes = new Hono();

hashRoutes.get("/", (c: Context) => {
  return c.text('Hash commands');
});

hashRoutes.get("/:action", (c: Context) => {
  const input = getCommandInput(c, VALID_ACTIONS, ['text']);

  const Hasher = HASH_OPERATIONS[input.action];
  const result = new Hasher().update(input.params.text).digest('hex');
  return c.json(<CommandResponse>{result, input});
});
