function generatePDF(tagSelector) {

    var iframe = document.querySelector(tagSelector);

    var doc = new PDFDocument({
        size: 'a4',
        layout: 'portrait' // default is portrait
      });
    var stream = doc.pipe(blobStream());
    
    if(generator) {
        console.log("generator "+generator);
        generator.drawPDF(doc);
    }

    // doc.save()
    //     .moveTo(100, 150)
    //     .lineTo(100, 250)
    //     .lineTo(200, 250)
    //     .fill("#FF3300");
    // end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
        iframe.src = stream.toBlobURL('application/pdf');
    });
    
}
