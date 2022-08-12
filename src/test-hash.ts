const { SHA256, nanoseconds } = Bun;

console.log(Object.keys(Bun));
console.log('nanoseconds', Date.now(), nanoseconds());
