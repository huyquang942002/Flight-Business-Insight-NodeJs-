const QuickChart = require('quickchart-js');

const week1319 = [
  { Revenue: 123456, Cost: 38419, 'Date to': '03/13/2021' },
  { Revenue: 57089, Cost: 33386, 'Date to': '03/14/2021' },
  { Revenue: 52053, Cost: 29702, 'Date to': '03/15/2021' },
  { Revenue: 218722, Cost: 83441, 'Date to': '03/16/2021' },
  { Revenue: 273350, Cost: 140485, 'Date to': '03/17/2021' },
  { Revenue: 426924, Cost: 211952, 'Date to': '03/18/2021' },
  { Revenue: 238274, Cost: 156373, 'Date to': '03/19/2021' }
];


const barChart = async(data)=>{

  const chart = new QuickChart();

  let label = [];
  let rev = [];
  let cost = [];
  let fileImage;


  const dates = []

  for(const item of data){


    const dateString = item['Date to']
    const date = new Date(dateString);
    const day = date.getDate(); 
    dates.push(day);


    label.push(day)
    rev.push(item.Revenue)
    cost.push(item.Cost)

  
  chart.setWidth(500)
  chart.setHeight(300);
  
  chart.setConfig(`{
  type: 'bar',
  data: {
    labels: [${label}],
    datasets: [{
      label: 'Cost',
      data: [${cost}]
    }, {
      label: 'Revenue',
      data: [${rev}]
    }]
  }
}`);
}
const firstDate = dates[0]

const lastDate = dates[dates.length-1]

fileImage = `./images/Mar ${firstDate},2021 - Mar ${lastDate},2021.png`

chart.toFile(`${fileImage}`);

}

barChart(week1319)


module.exports = {
  barChart
}