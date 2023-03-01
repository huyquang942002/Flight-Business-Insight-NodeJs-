const XLSX = require("xlsx");
const moment = require("moment");
const firebase = require("./firebase.js");
const excel = XLSX.readFile("./Data/excel.xlsx");
const create = require("./createPDF.js");


const dataExcel = XLSX.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]]);



const week1319 = []
const week20 = []


dataExcel.forEach((item)=>{
    const date1319 = new Date("3/20/2021")
    const date = new Date((item['Date to'] - (25567 + 1)) * 86400 * 1000);
    const dateFormat = date.toLocaleDateString()
    const dateReal = new Date(dateFormat)
    if(dateReal < date1319){
        week1319.push(item)
    }else{
        week20.push(item)
    }
})

function getMostAir(items) {

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
    let max = '';
    let temp = 0;
    for (const key in idCounts) {
      if (idCounts[key] > temp) {
        max = key;
        temp = idCounts[key];
      }
    }
    return  {ID:`${max}`}
  }

  const getMostplace = (items)=>{
    const count = {};

    items.forEach((item)=>{
        const { From } = item
        if(count[From]){
            count[From]++
        }else{
            count[From] = 1;
        }
    })
    let max = ''
    let temp = 0
    for(const key in count){
        if(count[key]>temp){
            max = key
            temp = count[key]
        }
    }
    return {From:`${max}`}
  }
  getMostplace(week1319)


const run = async()=>{

    
    // const promiseID = new Promise((resolve, reject) => {
    //     resolve(firebase.getFlightID("FlightID", getMostAir(week1319)));
    // });

    // const flight = await promiseID
    
    // const promiseAUD = new Promise((resolve, reject) => {
    //     resolve(firebase.getAud("AUD Convert", item));
    // });
    
    const promiseCityFrom = new Promise((resolve, reject) => {
        resolve(firebase.getCityFrom("City",getMostplace(week1319)));
    });
    const cityFrom = await promiseCityFrom;
    
    // const promiseCityTo = new Promise((resolve, reject) => {
    //     resolve(firebase.getCityTo("City", item));
    // });
    
    // for(const item of week1319){
    //       const getAsync = async () => {
            // const aud = await promiseAUD;
            // const cityTo = await promiseCityTo;
    //     }
    //     getAsync()
    // }
}   

run()



