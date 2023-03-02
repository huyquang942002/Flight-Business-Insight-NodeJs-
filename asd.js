const items = [
    {
      Revenue: 100000,
      Cost: 36026,
      'Date to' : '3/13/2021'
    },
    {
      Revenue: 100000,
      Cost: 36026,
      'Date to' : '3/14/2021'
    },
    {
      Revenue: 100000,
      Cost: 36026,
      'Date to' : '3/15/2021'
    },
    {
      Revenue: 100000,
      Cost: 36026,
      'Date to' : '3/13/2021'
    },
    {
      Revenue: 100000,
      Cost: 36026,
      'Date to' : '3/14/2021'
    }
  ];

  const arr = [];

  items.forEach((item)=>{
    const date = item['Date to']
    if(!arr[date]){
      arr[date] = {
        Revenue : 0,
        Cost : 0
      }
    }
    arr[date].Revenue += item.Revenue
    arr[date].Cost += item.Cost
  })

  console.log(arr);


  
  // const rev = {};
  
  // items.forEach(item => {
  //   const date = item['Date to'];
  //   if (!rev[date]) {
  //     rev[date] = {
  //       Revenue: 0,
  //       Cost: 0
  //     };
  //   }
  //   rev[date].Revenue += item.Revenue;
  //   rev[date].Cost += item.Cost;
  // });

  
  // const result = [];
  
  // for (const key in rev) {
  //   const value = rev[key];
  //   const revenue = value.Revenue;
  //   const cost = value.Cost;
  //   result.push({Revenue: revenue, Cost: cost, 'Date to': key});
  // }

  // console.log(result);
  

  
  