const XLSX = require("xlsx");

const firebase = require("./firebase.js");

const FlightID = XLSX.readFile("./Data/FlightID.csv");
const city = XLSX.readFile("./Data/City.csv");
const aud = XLSX.readFile("./Data/AUD convert.csv");

const setDatafirebase = async () => {

  const FlightID1 = XLSX.utils.sheet_to_json(FlightID.Sheets[FlightID.SheetNames]);

  for (const total of FlightID1) {
    firebase.setFlightID("FlightID", total);
  }

  const City = XLSX.utils.sheet_to_json(city.Sheets[city.SheetNames]);

  for (const total of City) {
    firebase.setCity("City", total);
  }


  const Aud = XLSX.utils.sheet_to_json(aud.Sheets[aud.SheetNames]);

  for (const total of Aud) {
    firebase.setAud("AUD Convert", total);
  }


};

setDatafirebase();
