const XLSX = require("xlsx");
const moment = require("moment");
const firebase = require("./firebase.js");
const excel = XLSX.readFile("./Data/excel.xlsx");
const create = require("./createPDF.js");

const formatNum = (num) => {
  return Math.round(num);
};

const formatNumAUD = (num) => {
  return `${(num / 1000).toFixed(3)}`;
};

const date = (num) => {
  const date = moment("1900-01-01")
    .add(num - 2, "days")
    .format("MM/DD/YYYY");
  const dateConvert = moment(date, "MM-DD-YYYY");
  return dateConvert.format("ddd,MMM D , YYYY");
};

const timeFlight = (x) => {
  const map1 = new Map();
  const date = moment("1900-01-01")
    .add(x["Date from"] - 2, "days")
    .format("MM/DD/YYYY");
  const fromHour = `${x["Time From"]} ${date}`;
  const dateObj1 = new Date(Date.parse(fromHour));
  const isoTime1 = dateObj1.toISOString();
  const d1 = new Date(isoTime1);
  map1.set(fromHour, d1);
  const b = [...map1.values()];

  const map2 = new Map();
  const date1 = moment("1900-01-01")
    .add(x["Date to"] - 2, "days")
    .format("MM/DD/YYYY");
  const toHour = `${x["Time To"]} ${date1}`;
  const dateObj = new Date(Date.parse(toHour));
  const isoTime = dateObj.toISOString();
  const d = new Date(isoTime);
  map2.set(toHour, d);
  const a = [...map2.values()];

  return a.map((item, i) => {
    return (item - b[i]) / (1000 * 60 * 60);
  });
};

const runDailyPDF = async () => {

  let index = 0;

  const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);
  
  for (const item of dataExcel) {
    const promiseID = new Promise((resolve, reject) => {
      resolve(firebase.getFlightID("FlightID", item));
    });

    const promiseAUD = new Promise((resolve, reject) => {
      resolve(firebase.getAud("AUD Convert", item));
    });

    const promiseCityFrom = new Promise((resolve, reject) => {
      resolve(firebase.getCityFrom("City", item));
    });

    const promiseCityTo = new Promise((resolve, reject) => {
      resolve(firebase.getCityTo("City", item));
    });

    const getAsync = async () => {
      const flight = await promiseID;
      const aud = await promiseAUD;
      const cityFrom = await promiseCityFrom;
      const cityTo = await promiseCityTo;
      let pdfStart = `${item["Time From"]} ${date(item["Date from"])}`;
      let pdfEnd = `${item["Time To"]} ${date(item["Date to"])}`;
      const pdfTime = timeFlight(item);
      let customer = item["Total customer"];
      let pdfRev = formatNumAUD(formatNum(item.Revenue * aud["AUD convert"]));
      let pdfCost = formatNumAUD(formatNum(item.Cost * aud["AUD convert"]));
      let total = (pdfRev - pdfCost).toFixed(3);
      let pdfFrom = cityFrom.City + ", " + cityFrom["Country"];
      let pdfTo = cityTo.City + ", " + cityTo["Country"];

      index++;
      create.dailyPDF(
        flight.ID,
        index,
        flight.Captain,
        flight["Flight name"],
        pdfFrom,
        pdfTo,
        pdfRev,
        pdfCost,
        total,
        customer,
        pdfTime,
        pdfStart,
        pdfEnd
      );
    };
    getAsync();
  }
};

runDailyPDF();
