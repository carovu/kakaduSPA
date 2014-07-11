/* 
* Config file for protractor. Protractor needed for e2e testing. 
*/
exports.config = {
  specs: ['e2e/*.js'],
  baseUrl: 'http://localhost:9001' //default test port with Yeoman
};