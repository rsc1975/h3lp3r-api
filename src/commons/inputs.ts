import { Context } from "hono";
import { CommandInput } from "../domain/commands";


export const getCommandInput = (ctx: Context, validActions: string[], paramsName:string[], mandatoryParams?:string[] ): CommandInput => {
    const action = ctx.req.param('action')?.toUpperCase();
    
    if (!action || !validActions.includes(action)) {
        ctx.set('response-status', 400);      
        throw new Error(`Invalid action: '${action}'`);
    }
    if (!mandatoryParams) {
        mandatoryParams = paramsName;
    }
    const params = {}
    for (const param of paramsName) {
        const value = ctx.req.query(param);
        if (value === undefined && mandatoryParams.includes(param)) {
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
  