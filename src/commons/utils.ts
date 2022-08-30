

import { join } from "path/posix";
import { readFile } from "fs/promises";
import { Context } from "hono";

const __basedir = join(import.meta.dir, '..', '..');

let _currentVersion : string;

export const getVersion = async () : Promise<string> => {
    if (!_currentVersion) {
        const td = new TextDecoder();
        const pkgLocatios :string[] = ['./package.json', join(__basedir, 'package.json')];
        for (const pkgLocation of pkgLocatios) {
            try {
                const pkgContent = td.decode(await readFile(pkgLocation));                                 
                _currentVersion = JSON.parse(pkgContent).version;
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
    
    return _currentVersion;
}

export function getCallerIP(c: Context) {
    const remoteIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') ||c.req.header('cf-connecting-ip')
    || c.env.remoteAddr?.hostname || 'unknown';
    return remoteIp.split(',')[0].trim();
}
