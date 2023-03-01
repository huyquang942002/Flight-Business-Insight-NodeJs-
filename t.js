const XLSX = require("xlsx");
const excel = XLSX.readFile("./Data/excel.xlsx");
const pdf = require("./pdf.js");
const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);
const firebase = require("./firebase.js");
const createPDF = require("./createPDF.js")



const week1319 = [];
const week20 = [];

dataExcel.forEach((item) => {
  const date1319 = new Date("3/20/2021");
  const date = new Date((item["Date to"] - (25567 + 1)) * 86400 * 1000);
  const dateFormat = date.toLocaleDateString();
  const dateReal = new Date(dateFormat);
  if (dateReal < date1319) {
    week1319.push(item);
  } else {
    week20.push(item);
  }
});

const getMostAir = (items) => {
  const idCounts = {};

  // Lặp qua mảng các đối tượng để đếm số lượng xuất hiện của mỗi ID
  items.forEach((item) => {
    const { ID } = item;
    if (idCounts[ID]) {
      idCounts[ID]++;
    } else {
      idCounts[ID] = 1;
    }
  });

  // Tìm ID xuất hiện nhiều nhất
  let max = "";
  let temp = 0;
  for (const key in idCounts) {
    if (idCounts[key] > temp) {
      max = key;
      temp = idCounts[key];
    }
  }
  return { ID: `${max}` };
};

const getMostFrom = (items) => {
  const count = {};

  items.forEach((item) => {
    const { From } = item;
    if (count[From]) {
      count[From]++;
    } else {
      count[From] = 1;
    }
  });
  let max = "";
  let temp = 0;
  for (const key in count) {
    if (count[key] > temp) {
      max = key;
      temp = count[key];
    }
  }
  return { From: `${max}` };
};

const getMostTo = (items) => {
  const count = {};
  for (const item of items) {
    const { To } = item;
    if (count[To]) {
      count[To]++;
    } else {
      count[To] = 1;
    }
  }
  let max = "";
  let temp = 0;
  for (let key in count) {
    if (count[key] > temp) {
      max = key;
      key = count[key];
    }
  }
  return { To: `${max}` };
};

const getTotal = (array) => {
  let a = 0;
  for (let arr of array) {
    a = a + arr["Total customer"];
  }
  return a;
};

const getTime = (array) => {
  let a = 0;
  for (const item of array) {
    const time = pdf.timeFlight(item);
    time.forEach((x) => {
      a = a + x;
    });
  }
  return a;
};

const run = async () => {
  const promiseID = new Promise((resolve, reject) => {
    resolve(firebase.getFlightID("FlightID", getMostAir(week1319)));
  });
  const flight = await promiseID;
  

  const promiseCityFrom = new Promise((resolve, reject) => {
    resolve(firebase.getCityFrom("City", getMostFrom(week1319)));
  });
  const cityFrom = await promiseCityFrom;

  const promiseCityTo = new Promise((resolve, reject) => {
    resolve(firebase.getCityTo("City", getMostTo(week1319)));
  });
  const cityTo = await promiseCityTo;
  const cityTo1 = cityTo.City + " , " + cityTo.Country

  const totalCustomer = getTotal(week1319);

  const timeFlight = getTime(week1319);
  const avgTime = timeFlight / week1319.length;


  createPDF.weekPDF(flight['Flight name'],totalCustomer,timeFlight,avgTime,cityFrom.Country,cityTo1)
  
};

run();
