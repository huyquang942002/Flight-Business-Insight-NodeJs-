const PDFDocument = require('pdfkit');
const fs = require('fs');


let dailyPDF = (ID,index,Captain,name,pdfFrom,pdfTo,pdfRev,pdfCost,total,customer)=> {
    {
      // Create a document
      const doc = new PDFDocument({ size: "A4" });
      doc.pipe(fs.createWriteStream(`DailyReports/Daily${index}.pdf`));
      doc.font("Helvetica");
      doc
        .fontSize(24)
        .fillColor("#444444")
        .text("Flight daily report", 200, 54, {
          width: 190,
        })
        .fontSize(15)
        .text(pdfFrom, 230, 90)
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
        .text(`${ID}`);
  
      let inforDaily = [
        `Plane name: ${name} - Captain: ${Captain}`,
        `Total customer : ${customer}`,
        `Revenue : ${(pdfRev)} AUD - Operation Cost : ${(pdfCost)} AUD - Profit : ${total} AUD`,
        // `Date Start : ${UI_from}`,
        // `Date End : ${UI_to}`,
        // `Time flight : ${[...timeFlight]} Hour`,
        `From : ${pdfFrom}`,
        `To : ${pdfTo}`,
      ];
  
      doc.fontSize(14).list(inforDaily, 36, 410);
  
      doc.end();
    }
  };

  module.exports = {
    dailyPDF,
  }