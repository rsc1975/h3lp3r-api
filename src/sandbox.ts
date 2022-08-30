
const val = new Bun.MD5().update('Elite');
console.log(typeof val); // Shows "string"
console.log(val.digest('hex')); // TypeError: val.digest is not a function.
