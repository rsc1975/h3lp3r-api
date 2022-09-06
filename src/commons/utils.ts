
import { Context, dirname, fromFileUrl } from "../deps.ts";

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
       const searchParams = _getSearchParams(this.url);
        
        if (key) {
          return searchParams[key];
        } else {
          return searchParams;
        }
      } as InstanceType<typeof Request>['query']
    
}