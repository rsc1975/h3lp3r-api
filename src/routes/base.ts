import CryptoJS from "crypto-js";
import { Hono } from "hono";
import { getCommandInput } from "../commons/inputs";

CryptoJS

const BASE_OPERATIONS = {
  ENCODE: (text: string) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  },
  DECODE: (textBase64: string) => {
    return CryptoJS.enc.Base64.parse(textBase64).toString(CryptoJS.enc.Utf8);
  },
};

const VALID_ACTIONS = Object.keys(BASE_OPERATIONS);


export const baseRoutes = new Hono();

baseRoutes.get("/", (c) => {
  return c.text('Base commands');
});

baseRoutes.get("/64/:action", (c) => {

  const input = getCommandInput(c, VALID_ACTIONS, ['text']);

  const coderAction = BASE_OPERATIONS[input.action];

  return c.text(coderAction(input.params.text));
});




    