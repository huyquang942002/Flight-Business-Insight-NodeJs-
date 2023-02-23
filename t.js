// const start = new Date('2021-03-15T10:00:00');
// const end = new Date('2021-03-15T15:00:00');
// const duration = end - start;
// const hours = duration / (1000 * 60 * 60);

// console.log(`Số giờ giữa 10:00 3/15/2021 và 15:00 3/18/2021 là ${hours} giờ`);


const a = [
  "10:00 3/15/2021",
  "11:00 3/15/2021",
  "12:00 3/15/2021"
];

console.log(typeof(a[0]))

const a2 = [
  "9:00 3/15/2021",
  "10:00 3/15/2021",
  "11:00 3/15/2021"
];

const map = new Map()
const map2 = new Map()

for(const c of a2){
  const dateObj = new Date(Date.parse(c));
  const isoTime = dateObj.toISOString();
  const d = new Date(isoTime)
  map2.set(c,d)
}

for(const c of a){
  const dateObj = new Date(Date.parse(c));
  const isoTime = dateObj.toISOString();
  const d = new Date(isoTime)
  map.set(c,d)
}

const b = [...map.values()];

const b2 = [...map2.values()];


const f = b.map((x,i)=>{
  return g = (x-b2[i])/ (1000 * 60 * 60)

})

// console.log(f);

