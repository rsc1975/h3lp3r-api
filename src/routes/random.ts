import { randEmail } from "@ngneat/falso";
import { Hono } from "hono";

const RANDOM_ACTIONS = {
  EMAIL: () => randEmail(),
  INTEGER: (c) => Math.floor(Math.random() * 100),
  FLOAT: (c) => Math.random() * 100,
}

export const randomRoutes = new Hono();

randomRoutes.get("/", (c) => {
  return c.text('Random commands');
});

randomRoutes.get("/:action", (c) => {
  return c.text(randEmail());
});



//RANDOM_NUM_DEC("RANDOM_NUM_DEC"), RANDOM_NUM_INT("RANDOM_NUM_INT"), RANDOM_NAMES("RANDOM_NAMES"), 	 ORACLE_SAYS("ORACLE_SAYS"), ORACLE_RESPONSE("ORACLE_RESPONSE");
