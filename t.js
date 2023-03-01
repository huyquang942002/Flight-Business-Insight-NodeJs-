const XLSX = require("xlsx");
const firebase = require("./firebase.js");
const excel = XLSX.readFile("./Data/excel.xlsx");
const pdfGen = require("./pdfGen.js")


const formatNum = (num)=>{
  return Math.round(num)
}

const formatNumAUD = (num)=>{
  return `${(num / 1000).toFixed(3)}`
}


const runDailyPDF = async () => {

  const map = new Map();
  
  let index = 0;

  const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);

  dataExcel.forEach((temp) => {
    map.set(temp);
  });



  for (const x of dataExcel) {
    const promiseID = new Promise((resolve, reject) => {
      resolve(firebase.getFlightID("FlightID", x));
    });

    const promiseAUD = new Promise((resolve, reject) => {
      resolve(firebase.getAud("AUD Convert", x));
    });

    const promiseCityFrom = new Promise((resolve, reject) => {
      resolve(firebase.getCityFrom("City", x));
    });

    const promiseCityTo = new Promise((resolve, reject) => {
      resolve(firebase.getCityTo("City", x));
    });


    
    const getAsync = async () => {
      const flight = await promiseID;
      const aud = await promiseAUD;
      const cityFrom = await promiseCityFrom;
      const cityTo = await promiseCityTo;
      let customer = x['Total customer']
      let pdfRev = formatNumAUD(formatNum(x.Revenue * aud['AUD convert']));
      let pdfCost = formatNumAUD(formatNum(x.Cost * aud['AUD convert']));
      let total = (pdfRev - pdfCost).toFixed(3)
      let pdfFrom = cityFrom.City + ', '  + cityFrom['Country']
      let pdfTo = cityTo.City +  ', ' + cityTo['Country']
      
      index++
      pdfGen.dailyPDF(flight.ID,index,flight.Captain,flight['Flight name'],pdfFrom,pdfTo,pdfRev,pdfCost,total,customer)
    };
    getAsync();
  }
};



runDailyPDF();
