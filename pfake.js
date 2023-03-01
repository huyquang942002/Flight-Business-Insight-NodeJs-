const XLSX = require("xlsx");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const firebase = require("./firebase.js");
const fs = require("fs");
const excel = XLSX.readFile("./Data/excel.xlsx");
const FlightID = XLSX.readFile("./Data/FlightID.csv");

let indexFile = 1;

const dailyPDF = (
  indexFile,
  flightID,
  flightName,
  flightCaptain,
  totalCustomer,
  flightRevenue,
  flightCost,
  from,
  to,
  timeFlight,
  froms,
  tos
) => {
  {
    // Create a document
    const doc = new PDFDocument({ size: "A4" });
    doc.pipe(fs.createWriteStream(`DailyReports/Daily${indexFile}.pdf`));
    doc.font("Helvetica");
    doc
      .fontSize(24)
      .fillColor("#444444")
      .text("Flight daily report", 200, 54, {
        width: 190,
      })
      .fontSize(15)
      .text(from, 230, 90)
      .fontSize(10.5)
      .fillColor("#000000")
      .text(
        "Flights are recorded on a daily basis, and are completed based on analyst Nong Quang Huy, any",
        40,
        150
      )
      .text("questions please contact email: huyquang92016@gmail.com", {
        align: "center",
      });
    doc.image("images/logo.png", 210, 200);

    doc
      .fillColor("#000000")
      .fontSize(18)
      .text("Flight number:  ", 36, 360, { oblique: true, lineBreak: false })
      .fillColor("#333333")
      .text(`${flightID}`);

    let inforDaily = [
      `Plane name: ${flightName} - Captain: ${flightCaptain}`,
      `Total customer : ${totalCustomer}`,
      `Revenue : ${(flightRevenue / 1000).toFixed(3)} AUD - Operation Cost : ${(
        flightCost / 1000
      ).toFixed(3)} AUD - Profit : ${(
        (flightRevenue / 1000).toFixed(3) - (flightCost / 1000).toFixed(3)
      ).toFixed(3)} AUD`,
      `Date Start : ${from}`,
      `Date End : ${to}`,
      `Time flight : ${[...timeFlight]} Hour`,
      `From : ${froms}`,
      `To : ${tos}`,
    ];

    doc.fontSize(14).list(inforDaily, 36, 410);

    doc.end();
  }
};

const runDailyPDF = async () => {
  const getFlightID = XLSX.utils.sheet_to_json(
    FlightID.Sheets[FlightID.SheetNames]
  );

  const flightData = getFlightID.map((total) => {
    return firebase.getFlightID("FlightID", total);
  });

  let flightID;
  let flightName;
  let flightCaptain;
  let dateStart1;
  let dateEnd1;
  let flightRevenue;
  let totalCustomer;
  let flightCost;
  let timeStart;
  let timeEnd;

  const res = await Promise.all(flightData);

  const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);

  const flight = dataExcel.map((item1) => {
    return  res.filter((item2) => item2.ID === item1.ID)[0];
  }); 

  let matches = []


  for (let i = 0; i < flight.length; i++) { 
    let match = dataExcel.find((item) => item.ID === flight[i].ID);

    match["Flight name"] = flight[i]["Flight name"];
    match["Captain"] = flight[i]["Captain"];
    match["Total customer"] = dataExcel[i]["Total customer"];
    match["Currency Unit"] = dataExcel[i]["Currency Unit"];
    match.Revenue = dataExcel[i].Revenue;
    match.Cost = dataExcel[i].Cost

    switch (match["Currency Unit"]) {
      case "SGD":
        match.Revenue = Math.round(dataExcel[i].Revenue * 0.98);
        match.Cost = Math.round( dataExcel[i].Cost * 0.98);
        break;

      case "USD":
        match.Revenue = Math.round(dataExcel[i].Revenue * 0.73);
        match.Cost = Math.round( dataExcel[i].Cost * 0.73);
        break;

      case "EURO":
        match.Revenue = Math.round(dataExcel[i].Revenue * 0.66);
        match.Cost = Math.round( dataExcel[i].Cost * 0.66);
        break;

      case "AUD":
        match.Revenue;
        match.Cost;
        break;
    }

    let froms;

    match["From"] = dataExcel[i]["From"];
    switch (match["From"]) {
      case "AND":
        froms = "Australia";
        break;
      case "BAK":
        froms = "Thailand";
        break;
      case "DN":
        froms = "VietNam";
        break;
      case "HCM":
        froms = "VietNam";
        break;
      case "KYO":
        froms = "Japan";
        break;
      case "MEL":
        froms = "Australia";
        break;
      case "SEL":
        froms = "Korea";
        break;
      case "SYD":
        froms = "Australia";
        break;

      default:
        froms = "VietNam";
    }

    let tos;

    match["To"] = dataExcel[i]["To"];
    switch (match["To"]) {
      case "AND":
        tos = "Andelaide , Australia";
        break;
      case "BAK":
        tos = "Bankok , Thailand ";
        break;
      case "DN":
        tos = "DaNang , VietNam";
        break;
      case "HCM":
        tos = "Ho Chi Minh , VietNam";
        break;
      case "KYO":
        tos = "Kyoto , Japan";
        break;
      case "MEL":
        tos = "Melbounrne , Australia";
        break;
      case "SEL":
        tos = "Seoul , Korea";
        break;
      case "SYD":
        tos = "Sydney , Australia";
        break;

      default:
        tos = "VietNam";
    }

    match["Time froms"] = dataExcel[i]["Time From"];
    match["Time tos"] = dataExcel[i]["Time To"];

    // Date start
    dateStart1 = moment("1900-01-01")
      .add(`${dataExcel[i]["Date from"]}` - 2, "days")
      .format("MM/DD/YYYY");
    const date = moment(dateStart1, "MM-DD-YYYY");
    const dateStart = date.format("ddd, MMM D, YYYY");

    dateEnd1 = moment("1900-01-01")
      .add(`${dataExcel[i]["Date to"]}` - 2, "day")
      .format("MM/DD/YYYY");
    const date1 = moment(dateEnd1, "MM-DD-YYYY");
    const dateEnd = date1.format("ddd, MMM D, YYYY");

    timeEnd = match["Time tos"];
    timeStart = match["Time froms"];
    const from = ` ${timeStart} ${dateStart}`;
    const to = ` ${timeEnd} ${dateEnd}`;

    const fromHour = ` ${timeStart} ${dateStart1}`;
    const toHour = ` ${timeEnd} ${dateEnd1}`;

    const map = new Map();
    const map2 = new Map();

    const dateObj = new Date(Date.parse(toHour));
    const isoTime = dateObj.toISOString();
    const d = new Date(isoTime);
    map2.set(toHour, d);

    const b2 = [...map2.values()];

    const dateObj1 = new Date(Date.parse(fromHour));
    const isoTime1 = dateObj1.toISOString();
    const d1 = new Date(isoTime1);
    map.set(fromHour, d1);

    const b = [...map.values()];

    const timeFlight = b2.map((x, i) => {
      return (g = (x - b[i]) / (1000 * 60 * 60));
    });


    matches.push(match)

    totalCustomer = match["Total customer"];
    flightID = match.ID;
    flightCaptain = match.Captain;
    flightName = match["Flight name"];
    flightRevenue = match.Revenue;
    flightCost = match.Cost;
    dailyPDF(
      indexFile,
      flightID,
      flightName,
      flightCaptain,
      totalCustomer,
      flightRevenue,
      flightCost,
      from,
      to,
      timeFlight,
      froms,
      tos
    );
    indexFile++;
  }

};

runDailyPDF();
