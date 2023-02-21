const XLSX = require('xlsx');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const firebase = require("./firebase.js")
const fs = require('fs');
const excel = XLSX.readFile('./Data/excel.xlsx');
const FlightID = XLSX.readFile('./Data/FlightID.csv');

const sheets = excel.SheetNames;

let indexFile = 1;

const asd = ()=>{
  const doc = new PDFDocument({size: 'A4'});

  doc
  .image('images/logo.png',210,200)
}

const createPDF = (indexFile,dateFrom,flightID,flightCaptain,flightName)=>{



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
      .text(dateFrom,230,90)
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
    
   
    doc.end();

    // console.log('created file successfully' + indexFile);

  }
  
  }

const run =async ()=>{


for(let i = 0 ; i < sheets.length ; i++){

    const dataExcel =  XLSX.utils.sheet_to_json(
         excel.Sheets[excel.SheetNames[i]])

    const dataFlight = XLSX.utils.sheet_to_json(
      FlightID.Sheets[FlightID.SheetNames[i]])

          let flightID;
          let flightName;
          let flightCaptain;
          let dateFrom;


          const flight = dataExcel.map(item1 => {
            const match = dataFlight.filter(item2 => item2.ID === item1.ID)[0];
            return match
          });

           
          

          for (let i = 0; i < flight.length; i++) {

            let match =  dataExcel.find((item)=>item.ID===flight[i].ID)

              match['Flight name'] = flight[i]['Flight name'];
              match['Captain'] = flight[i]['Captain'];

              flightID = match.ID;
              flightCaptain = match.Captain;
              flightName = match['Flight name'];
              dateFrom = moment('1900-01-01').add(`${match['Date from']}`-2, 'days').format('MM-DD-YYYY');
              createPDF(indexFile,dateFrom,flightID,flightCaptain,flightName)
              indexFile++;

          }
          

          
          
          // for(const f of flight){
          //   flightID = f.ID;
          //   flightCaptain = f.Captain;
          //   flightName = f['Flight name'];
          // }

          // for(const data of dataExcel){
          //   dateFrom = moment('1900-01-01').add(`${data['Date from']}`-2, 'days').format('MM-DD-YYYY');
          //   createPDF(indexFile,dateFrom)
          //   indexFile++;
          // }

          
          

}
}
run()