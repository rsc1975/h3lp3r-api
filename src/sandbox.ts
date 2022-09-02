import { platform } from "https://deno.land/std@0.151.0/node/_process/process.ts";

if (globalThis.Deno) {
    console.log(Deno.version);
}