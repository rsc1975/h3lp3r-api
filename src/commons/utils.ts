import { join, dirname, fromFileUrl } from "https://deno.land/std@0.152.0/path/mod.ts";
import { Context } from "https://deno.land/x/hono@v2.0.8/mod.ts";

const __currentdir = dirname(fromFileUrl(import.meta.url));

let _currentVersion : string;

export const getVersion = async () : Promise<string> => {
    if (!_currentVersion) {
        if (Deno.env.get('H3LP3R_VERSION')) {
            _currentVersion = Deno.env.get('H3LP3R_VERSION')!;
        } else {
            const td = new TextDecoder();
            const pkgLocatios :string[] = ['../version.txt', './version.txt', join(Deno.cwd(), 'version.txt'), join(__currentdir, '..','..', 'version.txt')];
            for (const pkgLocation of pkgLocatios) {
                try {
                    _currentVersion = td.decode(await Deno.readFile(pkgLocation)).trim();
                    break;
                } catch (_) {
                    // Empty
                }
            }
            
            if (_currentVersion) {
                return _currentVersion;
            } else {
                return 'Unknown';
            }
        }
    }
    
    return _currentVersion;
}

export function getCallerIP(c: Context) {
    const remoteIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') ||c.req.header('cf-connecting-ip')
    || c.env.remoteAddr?.hostname || 'unknown';
    return remoteIp.split(',')[0].trim();
}
