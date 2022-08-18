import { join, dirname, fromFileUrl } from "https://deno.land/std@0.152.0/path/mod.ts";
import { Context } from "https://deno.land/x/hono@v2.0.8/mod.ts";

const __currentdir = dirname(fromFileUrl(import.meta.url));

let _currentVersion : string;

export const getVersion = async () : Promise<string> => {
    if (!_currentVersion) {
        if (Deno.env.get('H3LP3R_VERSION')) {
            _currentVersion = Deno.env.get('H3LP3R_VERSION')!;
        } else {

            const pkgLocatios :string[] = ['../package.json', './package.json', join(Deno.cwd(), 'package.json'), join(__currentdir, '..','..', 'package.json')];
            for (const pkgLocation of pkgLocatios) {
                try {
                    const content = await Deno.readFile(pkgLocation);
                    const pkg = JSON.parse(new TextDecoder().decode(content));
                    _currentVersion = pkg.version;
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