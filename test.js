var banquo = require('./src/banquo.js');

var opts = {
    mode: 'save',
    url: 'america.aljazeera.com',
    viewport_width: 1440,
    delay: 1000,
    selector: '#articleHighlightList-0'
};

banquo.capture(opts, function(err){
   if (err) {
    console.log(err)
   }
});