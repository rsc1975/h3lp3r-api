import { Context } from 'https://deno.land/x/hono/mod.ts';

import { CommandInput } from "../domain/commands.ts";

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
        ctx.set('response-status', 400);

        throw new Error(`Invalid action: '${action}'`);
    }
    if (!opts.mandatoryParams) {
        opts.mandatoryParams = opts.paramsName;
    }
    const params : any = {}
    for (const param of opts.paramsName) {
        const value = ctx.req.query(param);
        if (value === undefined && opts.mandatoryParams.includes(param)) {
            ctx.set('response-status', 400);      
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
  