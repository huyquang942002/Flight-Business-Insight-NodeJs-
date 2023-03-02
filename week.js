const XLSX = require("xlsx");
const excel = XLSX.readFile("./Data/excel.xlsx");
const moment = require("moment");
const pdf = require("./pdf.js");
const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);
const firebase = require("./firebase.js");
const createPDF = require("./createPDF.js")

const week1319 = [];
const week20 = [];

const sortWeek = (data)=>{

data.forEach((item) => {
  if (item['Date to'] < 44275) {
    week1319.push(item);
  } else {
    week20.push(item);
  }
});
}

sortWeek(dataExcel)


const dataChart = (items)=>{

  const arr = {}

  for(const item of items){
    const date = item['Date to']
    if(!arr[date]){
      arr[date] = {
        Revenue : 0,
        Cost : 0
      }
    }
    arr[date].Revenue += item.Revenue
    arr[date].Cost += item.Cost
  }

  const result = []

  for(const key in arr){

    const date = moment("1900-01-01")
    .add(key - 2, "days")
    .format("MM/DD/YYYY");

    const value = arr[key]
    let revenue = value.Revenue
    let cost = value.Cost
    result.push({Revenue : revenue , Cost : cost , 'Date to' : date})
  }
  console.log(result);
}

dataChart(week1319)


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

const runWeek1319 = async () => {
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
  const avgTime = Math.round(timeFlight / week1319.length);
  
  const title = "Mar 13,2021 - Mar 19,2021"


  createPDF.weekPDF(flight['Flight name'],totalCustomer,timeFlight,avgTime,cityFrom.Country,cityTo1,title)
  
};

runWeek1319();

const runWeek20 = async () => {
  const promiseID = new Promise((resolve, reject) => {
    resolve(firebase.getFlightID("FlightID", getMostAir(week20)));
  });
  const flight = await promiseID;
  

  const promiseCityFrom = new Promise((resolve, reject) => {
    resolve(firebase.getCityFrom("City", getMostFrom(week20)));
  });
  const cityFrom = await promiseCityFrom;

  const promiseCityTo = new Promise((resolve, reject) => {
    resolve(firebase.getCityTo("City", getMostTo(week20)));
  });
  const cityTo = await promiseCityTo;
  const cityTo1 = cityTo.City + " , " + cityTo.Country

  const totalCustomer = getTotal(week20);

  const timeFlight = getTime(week20);
  const avgTime = Math.round(timeFlight / week20.length);

  const title = "Mar 20,2021 - Mar 26,2021"


  createPDF.weekPDF(flight['Flight name'],totalCustomer,timeFlight,avgTime,cityFrom.Country,cityTo1,title)
  
};

runWeek20();
