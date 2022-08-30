//import { randEmail, randFirstName, randLastName, randUuid } from "@ngneat/falso";
import { randEmail, randFirstName, randLastName, randUuid }  from '@ngneat/falso';
import { Context, Hono } from "hono";

import { getCommandInput } from "../commons/inputs";
import { CommandResponse } from "../domain/commands";
import { GeneratedName, OracleResponse, OracleType } from "../domain/misc";


function strHashcode(text: string): number {
    return text.split('').reduce((acc, curr, i) => acc + curr.charCodeAt(0)*(1000+i), 0);
}

function normalizeQuestion(question: string) : string {
  return question.replaceAll(/[-:;_ \(\)\[\],.\t\n]/g, "").toLowerCase();
}

const MAX_NAMES_GENERATED = 1000;


// deno-lint-ignore no-explicit-any
const RANDOM_ACTIONS : Record<string, (...args: any[]) => string | number | Array<any>> = {
  int: (min: number, max: number) => (Math.floor(Math.random() * (max - min + 1)) + min),
  decimal: (min: number, max: number) => (Math.random() * (max - min) + min),
  email: randEmail,
  uuid: randUuid,
  names: (total: number, gender: 'male' | 'female') : GeneratedName[] => {
    const names : GeneratedName[] = [];

    if (total > MAX_NAMES_GENERATED) {
      total = MAX_NAMES_GENERATED;
    } else if (total < 1) {
      total = 1;
    }

    for (let index = 0; index < total; index++) {
      const genderName = gender || (Math.random() > 0.5 ? 'male' : 'female');
      const firstName = randFirstName({ gender });
      const lastName = randLastName({});
      names.push({gender: genderName, firstName, lastName});
    }

    return names;
  },
  oracle: (type: OracleType, question?: string) : OracleResponse => {
    let num: number;
    if (question) {
      const questionHash = strHashcode(normalizeQuestion(question));
      num = ((questionHash % 1000) / 1000.0) * 3;
    } else {
      num = RANDOM_ACTIONS.decimal(0.0, 3.0) as number;
    }

    switch (type) {
      case 'YES_NO':
        return num > 1.5 ? OracleResponse.NO : OracleResponse.YES;
      case 'YES_NO_MAYBE':
        return num >= 2.0 ? OracleResponse.NO : (num < 1.0 ? OracleResponse.YES : OracleResponse.MAYBE);
      default:
        throw new Error(`Operation not supported ${type}`);        
    }
  }
}

export const randomRoutes = new Hono();

randomRoutes.get("/", (c) => {
  return c.text('Random commands');
});

randomRoutes.get("/number/:type", (c: Context) => {
  const input = getCommandInput(c, { validActions: ['int', 'decimal'], paramsName: ['min', 'max'], mandatoryParams: [], actionParamName: 'type' });
  const randFn = RANDOM_ACTIONS[input.action];
  input.params.min ??= 0.0;
  input.params.max ??= +input.params.min + 1.0;
  const result = randFn(+input.params.min, +input.params.max);
  return c.json(<CommandResponse>{ result, input });
});

randomRoutes.get("/oracle", (c: Context) => {
  const input = getCommandInput(c, { paramsName: ['type', 'question'], mandatoryParams: ['type'], action: 'oracle' });
  input.params.type = (<string>input.params.type).toUpperCase();
  const result = RANDOM_ACTIONS[input.action](input.params.type, input.params.question);
  return c.json(<CommandResponse>{ result, input });
});

randomRoutes.get("/names", (c: Context) => {
  const input = getCommandInput(c, { paramsName: ['total', 'gender'], action: 'names' });
  const result = RANDOM_ACTIONS[input.action](input.params.total, input.params.gender);
  return c.json(<CommandResponse>{ result, input });
});

randomRoutes.get("/:action", (c: Context) => {
  const input = getCommandInput(c, { validActions: ['email', 'uuid'], paramsName: [] });
  const result = RANDOM_ACTIONS[input.action]();
  return c.json(<CommandResponse>{ result, input });
});




//RANDOM_NUM_DEC("RANDOM_NUM_DEC"), RANDOM_NUM_INT("RANDOM_NUM_INT"), RANDOM_NAMES("RANDOM_NAMES"), 	 ORACLE_SAYS("ORACLE_SAYS"), ORACLE_RESPONSE("ORACLE_RESPONSE");
