# Banquo

Banquo builds off of [Depict](https://github.com/kevinschaul/depict), a node library designed to use PhantomJS to take screenshots of interactive visualizations. Banquo is slightly different in that it is built to be called on a Node.js server and returns a base64-encoded version of the screenshot as jsonp, as opposed to saving the screenshot to a file.

As a result, Banquo doesn't run on the command line, as Depict does, but instead is called like so from another Node.js script.

### Installation

`npm install banquo`

### Usage

````
var banquo = require('banquo');

var opts = {
    mode: 'base64',
    url: 'america.aljazeera.com',
    viewport_width: 1440,
    delay: 1000,
    selector: '#map-canvas'
}
banquo.capture(opts, function(image_data){
    console.log(image_data);
})
````

### Options

Key | Required | Default | Options | Description
--- | --- | --- | --- | ---
mode |no| `base64` | `save` or `base64`  | The former will save a file to the `out_file` location and return a success string callback. The latter will return the image as a base64 string.
url |yes| null | *String* | The website you want to screenshot.
viewport_width |no| 1440 | *Number (pixels)* | The desired browser width. Settings this to a higher number will increase processing time.
delay |no| 1000 | *Number (milliseconds)* | How long to wait after the page has loaded before taking the screenshot. PhantomJS apparently waits for the page to load but if you have a map or other data calculations going on, you'll need to specify a wait time.
selector |no| `body` | *CSS selector* | The div you want to screenshot.
css_hide |no| null | *CSS selector* | Any divs you want to hide, such as zoom buttons on map. Defaults to none.
out_file |no| null | *string* | The name / location of the image file you want to save.

You can set up your own service with banquo by cloning [banquo-server](http://github.com/ajam/banquo-server)
