

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


declare global {
    interface Request<ParamKeyType extends string = string> {
      
      _searchParams?: Record<string, string>;
    }
}

export const customRequest = () => {
    function* _pairsGenerator(url: string, idx: number) : Generator<string> {
        let from = idx;
        while(idx > 0) {
          idx = url.indexOf('&', from +1)
          if (idx === -1) {
            yield url.substring(from+1);
          } else {
            yield url.substring(from+1, idx);
          }
          from = idx;
        }  
      }
      
      const _getSearchParams = (url: string): Record<string, string> => {
        const idx = url.indexOf('?');
        if (idx === -1) {
          return {};
        }
        const params: Record<string, string> = {};
        for (const pair of _pairsGenerator(url, idx)) {
          if (pair) {
            const sep = pair.indexOf('=');
            if (sep === -1) {
              params[decodeURIComponent(pair)] = '';
            } else {
              params[decodeURIComponent(pair.substring(0, sep))] = decodeURIComponent(pair.substring(sep + 1));
            }
          }
        }
      
        return params;
      }

    Request.prototype.query = function (this: Request, key?: string) {
        if (!this._searchParams) {
            this._searchParams = _getSearchParams(this.url);
        }
        if (key) {
          return this._searchParams[key];
        } else {
          return this._searchParams;
        }
      } as InstanceType<typeof Request>['query']
    
}