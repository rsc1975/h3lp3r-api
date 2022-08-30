import { createRequire } from "https://deno.land/std/node/module.ts";

const require = createRequire(import.meta.url);

const mongoose = require('mongoose');

console.log(mongoose.version);