fs = require('fs');
http = require('http');
url = require('url');
path = require('path');
port = process.argv[2]||8080;



http.createServer(function(req, res){
  var fullFilePath = path.join(process.cwd(), url.parse(req.url).pathname);
    fs.stat(fullFilePath, function(err, stats) {
      if(err) {
       res.statusCode = 404;
       res.end("File not found");
       return;
     }
     if (fs.statSync(fullFilePath).isDirectory()) {
       var body = '<html>'+
      '<head>'+
      '<meta http-equiv="Content-Type" '+
      'content="text/html; charset=UTF-8" />'+
      '</head>'+
      '<body>'+
      '<a href="file.bin" download>Download binary file</a>' +
      '</body>'+
      '</html>';
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(body);
      res.end();
    }
    else{
      var file = new fs.ReadStream(fullFilePath);
      sendFile(file,res);
    }

});
}).listen(parseInt(port, 10));

    function sendFile(file,res){
      file.pipe(res);
      file.on('error',function(err){
        res.statusCode=500;
        res.end("Server Error");
        console.error(err);
        res.on('close',function(){
          file.destroy();
        });
      });
}
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");