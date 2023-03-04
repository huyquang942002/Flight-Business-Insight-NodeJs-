const QuickChart = require('quickchart-js');

// const week1319 = [
//   { Revenue: 123456, Cost: 38419, 'Date to': '03/13/2021' },
//   { Revenue: 57089, Cost: 33386, 'Date to': '03/14/2021' },
//   { Revenue: 52053, Cost: 29702, 'Date to': '03/15/2021' },
//   { Revenue: 218722, Cost: 83441, 'Date to': '03/16/2021' },
//   { Revenue: 273350, Cost: 140485, 'Date to': '03/17/2021' },
//   { Revenue: 426924, Cost: 211952, 'Date to': '03/18/2021' },
//   { Revenue: 238274, Cost: 156373, 'Date to': '03/19/2021' }
// ];

// const week1319 = [
//   { des: 'Ho Chi Minh , Vietnam', appear: 5 },
//   { des: 'Andelaide , Australia', appear: 6 },
//   { des: 'Bankok , Thailand', appear: 5 },
//   { des: 'Kyoto , Japan', appear: 4 }
// ];


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

const pieChart1319 = (item)=>{


  // Tính tổng appear để tính phần trăm
  const totalAppear = item.reduce((total, { appear }) => total + appear, 0);
  
  // Tạo mảng dữ liệu cho biểu đồ
  const data = item.map(({ des, appear }) => ({
    name: des,
    value: Math.round((appear / totalAppear) * 100),
  }));
  
  
  // Tạo biểu đồ pie
  const chart = new QuickChart();
  chart.setConfig({
    type: "pie",
    data: {
      labels: data.map(({ name }) => name),
      datasets: [
        {
          data: data.map(({ value }) => value),
          backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Most visited destination of the week by %",
        fontSize: 18,
      },
    },
  });
  
  chart.toFile(`./images/pieChart1319.png`);
}

const pieChart20 = (item)=>{


  // Tính tổng appear để tính phần trăm
  const totalAppear = item.reduce((total, { appear }) => total + appear, 0);
  
  // Tạo mảng dữ liệu cho biểu đồ
  const data = item.map(({ des, appear }) => ({
    name: des,
    value: Math.round((appear / totalAppear) * 100),
  }));
  
  
  // Tạo biểu đồ pie
  const chart = new QuickChart();
  chart.setConfig({
    type: "pie",
    data: {
      labels: data.map(({ name }) => name),
      datasets: [
        {
          data: data.map(({ value }) => value),
          backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Most visited destination of the week by %",
        fontSize: 18,
      },
    },
  });
  
  chart.toFile(`./images/pieChart20.png`);
}

module.exports = {
  barChart,
  pieChart1319,
  pieChart20
}