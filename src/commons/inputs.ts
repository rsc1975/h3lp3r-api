import { Context } from "https://deno.land/x/hono@v2.0.8/mod.ts";

import { CommandInput } from "../domain/commands.ts";
import { RESPONSE_STATUS_KEY } from "../domain/misc.ts";

export interface RequestInputOptions {
    validActions?: string[];
    paramsName:string[];
    mandatoryParams?:string[];
    actionParamName?:string;
    action?:string;
}

export const getCommandInput = (ctx: Context, opts: RequestInputOptions ): CommandInput => {
    const action = opts.action || ctx.req.param(opts.actionParamName || 'action')?.toLowerCase();
    
    if (!opts.action && !opts.validActions?.includes(action)) {
        ctx.set(RESPONSE_STATUS_KEY, 400);
        throw new Error(`Invalid action: '${action}'`);
    }
    if (!opts.mandatoryParams) {
        opts.mandatoryParams = opts.paramsName;
    }
    const searchParams = opts.paramsName?.length > 0 ? ctx.req.query() : {};
    const params : Record<string, unknown> = {}
    for (const param of opts.paramsName) {
        const value = searchParams[param];
        if (value === undefined && opts.mandatoryParams.includes(param)) {
            ctx.set(RESPONSE_STATUS_KEY, 400);      
            throw new Error(`Missing parameter: '${param}'`);
        } else {
            params[param] = value;
        }
        
    }
    return {action, params} as CommandInput;
}

export const getPathFromURL = (url: string): string => {
    const fromIndex = url.indexOf('/', 'https://'.length);
    const initParamsIndex = url.indexOf('?');
    const toIndex = initParamsIndex > -1 ? initParamsIndex : url.length;
    return url.substring(fromIndex, toIndex);  
  }
  