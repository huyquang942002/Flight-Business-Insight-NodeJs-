const a = [2, 3, 4];
const b = [1, 2, 3];

const c = a.map((x, i) => x - b[i]);

console.log(c); // [1, 1, 1]
