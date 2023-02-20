const XLSX = require('xlsx');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const firebase = require("./firebase.js")
const fs = require('fs')
const excel = XLSX.readFile('./Data/excel.xlsx');
const FlightID = XLSX.readFile('./Data/FlightID.csv');

const sheets = excel.SheetNames;

let indexFile = 1;




const createPDF = (indexFile,dateFrom,doc1)=>{



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

    // for(const doc in doc1){
    //   console.log(doc.ID)
      
    // }

    doc
        .fillColor('#000000')
        .fontSize(18)
        .text('Flight number:  ',36, 360, {oblique : true, lineBreak : false, })
        .fillColor('#333333')
        .text(`${doc.ID}`)
    
   
    doc.end();

    // console.log('created file successfully' + indexFile);

  }
  
  }

const run =async ()=>{


for(let i = 0 ; i < sheets.length ; i++){

    const dataFull =  XLSX.utils.sheet_to_json(
         excel.Sheets[excel.SheetNames[i]])
            for(const data of dataFull){


              // const ID = data.ID

              const dateFrom = moment('1900-01-01').add(`${data['Date from']}`-2, 'days').format('MM-DD-YYYY');

              const getFlightID = XLSX.utils.sheet_to_json(
                FlightID.Sheets[FlightID.SheetNames[i]])
          
                for(const total of getFlightID){
          
                      const doc1 =  await firebase.getID('FlightID',total)

                      console.log(doc1);

                      // createPDF(indexFile,dateFrom,doc1)
                }
              
              
              indexFile++;

          }
}
}
run()