
class HelloWorld {
  constructor(hi, numero, lista) {
    this.hello = hi;
    this.numero = numero;
    this.lista = lista;
  }  
}


const print = console.log;

print('Init jsonEncode');
const total = 1000000;

print(JSON.stringify(new HelloWorld('World!', 123132.45, ['red', 'green', 'blue', 'yellow'])));
let t0 = performance.now();
for (let i = 0; i < total; i++) {
  JSON.stringify(new HelloWorld('World!', i, ['red', 'green', 'blue', 'yellow']));
}
let elapsed = (performance.now() - t0) * 1000.0;
print(` - Duration: ${elapsed} micro for $total iterations`);
print(` - Avg: ${elapsed / total}microsec/iter`);

print('Init base64 encode');
t0 = performance.now();
if (!globalThis.Deno) {
  for (let i = 0; i < total; i++) {  
    Buffer.from('Hello, World!').toString('base64');
  }
} else {
  for (let i = 0; i < total; i++) {  
    btoa('Hello, World!');
  }
}

elapsed = (performance.now() - t0) * 1000.0;
print(` - Duration: ${elapsed} microsecs for $total iterations`);
print(` - Avg: ${elapsed / total}microsec/iter`);
  
