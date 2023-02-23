const XLSX = require('xlsx');

const firebase = require("./firebase.js")

const excel = XLSX.readFile('./Data/excel.xlsx');
const FlightID = XLSX.readFile('./Data/FlightID.csv');
const city = XLSX.readFile('./Data/City.csv');
const aud = XLSX.readFile('./Data/AUD convert.csv');

const sheets = excel.SheetNames;

const run = async()=>{

            

            const getFlightID = XLSX.utils.sheet_to_json(
               FlightID.Sheets[FlightID.SheetNames])

            const flightData = getFlightID.map(async (total)=>{
               const doc1 = await firebase.getFlightID('FlightID',total)
               return doc1
            })


            Promise.all(flightData).then((res) => {
              console.log(res)
                 });










              }
            
            
         




            
            
                  
               



                     




for(var i = 0 ; i < sheets.length ; i++){

   const setFlightID = XLSX.utils.sheet_to_json(
      FlightID.Sheets[FlightID.SheetNames[i]])

      for(const total of setFlightID){
         firebase.setFlightID('FlightID',total)
      }



   // const setCity = XLSX.utils.sheet_to_json(
   //    city.Sheets[city.SheetNames[i]]
   // )

   //    for(const total of setCity){
   //       firebase.setCity('City',total)
   //    }

   // const getCity = XLSX.utils.sheet_to_json(
   //    city.Sheets[city.SheetNames[i]]
   // )

   //    for(const total of getCity){
   //      const doc1 = await firebase.getCity('City',total)
   //       console.log(doc1);
   //    }

   // const setAud = XLSX.utils.sheet_to_json(
   //    aud.Sheets[aud.SheetNames[i]]
   // )
   //    for(const total of setAud){
   //       firebase.setAud('AUD Convert',total)
   //    }

      // const getAud = XLSX.utils.sheet_to_json(
      //    aud.Sheets[aud.SheetNames[i]]
      // )

      //    for(const total of getAud){
      //       const doc1 = await firebase.getAud('AUD Convert',total)
      //       console.log(doc1);
      //    }

   
}

run();





