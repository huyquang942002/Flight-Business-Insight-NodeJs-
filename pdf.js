const XLSX = require('xlsx');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const firebase = require("./firebase.js")
const fs = require('fs');
const { type } = require('os');
const excel = XLSX.readFile('./Data/excel.xlsx');
const FlightID = XLSX.readFile('./Data/FlightID.csv');

const sheets = excel.SheetNames;

let indexFile = 1;

const asd = ()=>{
  const doc = new PDFDocument({size: 'A4'});

  doc
  .image('images/logo.png',210,200)
}

const createPDF = (indexFile,flightID,flightName,flightCaptain,totalCustomer,flightRevenue,flightCost
                  ,from,to)=>{

  {
    // Create a document
    const doc = new PDFDocument({size: 'A4'});
    doc.pipe(fs.createWriteStream(`DailyReports/Daily${indexFile}.pdf`));
    doc.font('Helvetica')
    doc
      .fontSize(24)
      .fillColor('#444444')
      .text('Flight daily report', 200,54, {
        width: 190
      })
      .fontSize(15)
      .text(from,230,90)
      .fontSize(10.5)
      .fillColor('#000000')
      .text('Flights are recorded on a daily basis, and are completed based on analyst Nong Quang Huy, any' ,
    40,150)
      .text('questions please contact email: huyquang92016@gmail.com', {
        align: 'center'
      })
    doc
      .image('images/logo.png',210,200)
      


    doc
        .fillColor('#000000')
        .fontSize(18)
        .text('Flight number:  ',36, 360, {oblique : true, lineBreak : false, })
        .fillColor('#333333')
        .text(`${flightID}`)
    


    let inforDaily = [`Plane name: ${flightName} - Captain: ${flightCaptain}`, 
    `Total customer : ${totalCustomer}`
    ,`Revenue : ${(flightRevenue/1000).toFixed(3)} AUD - Operation Cost : ${(flightCost/1000).toFixed(3)} AUD - Profit : ${((flightRevenue/1000).toFixed(3)-(flightCost/1000).toFixed(3)).toFixed(3)} AUD`
                    ,`Date Start : ${from}`
                    ,`Date End : ${to}`]
    
    doc
      .fontSize(14)
      .list(inforDaily, 36, 410)  

   
    doc.end();

    // console.log('created file successfully' + indexFile);

  }
  
  }

const run =async ()=>{

            const getFlightID = XLSX.utils.sheet_to_json(
              FlightID.Sheets[FlightID.SheetNames])

          const flightData = getFlightID.map(async (total)=>{
              const doc1 = await firebase.getFlightID('FlightID',total)
              return doc1
          })

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


          Promise.all(flightData).then((res) => {
              const dataExcel =  XLSX.utils.sheet_to_json(
                  excel.Sheets[excel.SheetNames[0]])
    
                const flight = dataExcel.map(item1 => {
                  const match = res.filter(item2 => item2.ID === item1.ID)[0];
                  // console.log(match);
                  return match
                });

              for (let i = 0; i < flight.length; i++) {
    
                let match =  dataExcel.find((item)=>item.ID===flight[i].ID)
    
                  match['Flight name'] = flight[i]['Flight name'];
                  match['Captain'] = flight[i]['Captain'];
                  match['Total customer'] = dataExcel[i]['Total customer']
                  match['Currency Unit'] = dataExcel[i]['Currency Unit']
                  switch(match['Currency Unit']){
                    case 'SGD':match.Revenue = Math.round(match.Revenue * 0.98);
                               match.Cost = Math.round(match.Cost * 0.98)
                    break;

                    case 'USD':match.Revenue = Math.round(match.Revenue * 0.73)
                               match.Cost = Math.round(match.Cost * 0.73)
                    break;

                    case 'EURO':match.Revenue= Math.round(match.Revenue * 0.66) 
                                match.Cost = Math.round(match.Cost * 0.66)
                    break;

                    case 'AUD':match.Revenue 
                               match.Cost 
                    break;
                  }
                  match['Time from'] = dataExcel[i]['Time From']
                  match['Time to'] = dataExcel[i]['Time To']

                  
                  // Date start
                  dateStart1 = moment('1900-01-01').add(`${match['Date from']}`-2, 'days').format('MM/DD/YYYY');
                  const date = moment(dateStart1, 'MM-DD-YYYY');
                  const dateStart = date.format('ddd, MMM D, YYYY');


                  
                  
                  dateEnd1 = moment('1900-01-01').add(`${match['Date to']}`-2,'day').format('MM/DD/YYYY');
                  const date1 = moment(dateEnd1,'MM-DD-YYYY');
                  const dateEnd = date1.format('ddd, MMM D, YYYY');
                  
                  
                  timeEnd = match['Time to']
                  timeStart = match['Time from'];
                  const from = ` ${timeStart} ${dateStart}`
                  const to = ` ${timeEnd} ${dateEnd}`;

                  const fromHour = ` ${timeStart} ${dateStart1}`
                  // console.log(fromHour);
                  const toHour = ` ${timeEnd} ${dateEnd1}`;
                  


                  const map = new Map()
                  const map2 = new Map()

                  // for(const c of toHour){
                    // console.log(c);
                    // const dateObj = new Date(Date.parse(c));
                    // console.log(dateObj);
                    // const isoTime = dateObj.toISOString();
                    // const d = new Date(isoTime)
                    // map2.set(c,d)
                  // }

                  // for(const c of fromHour){
                  //   const dateObj = new Date(Date.parse(c));
                  //   const isoTime = dateObj.toISOString();
                  //   const d = new Date(isoTime)
                  //   map.set(c,d)
                  // }

                  // const b = [...map.values()];

                  // const b2 = [...map2.values()];


                  // const f = b.map((x,i)=>{
                  //   return g = (x-b2[i])/ (1000 * 60 * 60)

                  // })

                  // console.log(f);



                  totalCustomer = match['Total customer']
                  flightID = match.ID;
                  flightCaptain = match.Captain;
                  flightName = match['Flight name'];
                  flightRevenue = match.Revenue;
                  flightCost = match.Cost
                  // createPDF(indexFile,flightID,flightName,flightCaptain,totalCustomer,flightRevenue,flightCost,from,to)
                  indexFile++;

                }
          });



        }
          
          
          

run()