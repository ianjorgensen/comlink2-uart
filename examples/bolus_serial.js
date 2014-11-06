var uart = require('../');
  // scan all serial ports
var Serial = require('serialport');

if (!module.parent) {
  function scan (open) {
    Serial.list(function (err, list) {
      var spec = list.pop( );
      console.log("OPENING", spec);
      var serial = new Serial.SerialPort(spec.comName, {bufferSize: 64});
      serial.open(open.bind(serial));
    });
  }
  var prog = process.argv.slice(1,2).pop( );
  var serial = process.argv.slice(2,3).pop( ) || process.env['SERIAL'];
  if (!serial) {
    console.log('usage: ', prog, 'SERIAL'); 
    process.exit(1);
  }

  scan(function ( ) {
    var pump = uart(this).session;
    console.log("PUMP", pump);
	  pump.open(console.log.bind(console, "OPENED"))
	      .serial(serial)
	      .prelude({minutes: 1})
	      .ReadPumpModel(function model (res, msg) {
		console.log('MODEL', res);
		console.log("ERROR?", msg);
	      })
	      .Bolus({strokes: 40, units: .5}, function (err, msg) {
		console.log("BOLUS!! err", err);
		console.log("BOLUS!! msg", msg);
	      })
	      .end( )
	  ;
  });
  console.log('howdy');

}
