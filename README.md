Banquo
===

**This repository is no longer being maintained. Please use [https://github.com/mhkeller/banquo2](https://github.com/mhkeller/banquo2).**

Banquo builds off of [Depict](https://github.com/kevinschaul/depict), a node library designed to use [PhantomJS](http://phantomjs.org/) to take screenshots of interactive visualizations. Banquo is slightly different in that it is built to be called on a Node.js server and returns a base64-encoded version of the screenshot as jsonp, as opposed to saving the screenshot to a file.

As a result, Banquo doesn't run on the command line, as Depict does, but instead is called like the example below from another Node.js script.

*NOTE: As of Banquo 0.3.0, it [no longer requires](https://github.com/ajam/banquo/pull/3) you to install PhantomJs separately.*

### Installation

You'll generally install this as a dependency in your `package.json`.

````
npm install banquo --save
````

If you want to install it without adding it to your `package.json`, run the command above without `--save`.

### Usage

You can set up your own service with banquo by cloning [banquo-server](http://github.com/ajam/banquo-server). 

*Note: Banquo server uses an older version of Banquo. Pull request welcome.*

Here's a basic standalone setup:

````js
var banquo = require('banquo');

var opts = {
    mode: 'base64',
    url: 'america.aljazeera.com',
    viewport_width: 1440,
    delay: 1000,
    selector: '#articleHighlightList-0'
};

banquo.capture(opts, function(err, imageData){
    if (err) {
     console.log(err)
    }
    console.log(imageData);
});
````

Or if mode is `save` and `scrape` is `true` you get the body markup. This behavior will be standardized in future versions so that just by setting `scrape` to `true` you'll get a third argument of the `bodyMarkup`. Pull request welcome.

````js
var banquo = require('banquo');

var opts = {
    mode: 'save',
    url: 'america.aljazeera.com',
    viewport_width: 1440,
    delay: 1000,
    selector: '#articleHighlightList-0',
    scrape: true
};

banquo.capture(opts, function(err, bodyMarkup){
    if (err) {
     console.log(err)
    }
    console.log(bodyMarkup);
});
````

### Options

Key | Required | Default | Options | Description
--- | --- | --- | --- | ---
mode |no| `base64` | `save` or `base64`  | The former will save a file to the `out_file` location and return a success string callback. The latter will return the image as a base64 string.
url |yes| null | *String* | The website you want to screenshot.
viewport_width |no| 1440 | *Number (Pixels)* | The desired browser width. Settings this to a higher number will increase processing time.
viewport_height |no| 900 | *Number (Pixels)* | The desired browser height. Settings this to a higher number will increase processing time. May be useful with long scrolls in fixed height containers.
delay |no| 1000 | *Number (Milliseconds)* | How long to wait after the page has loaded before taking the screenshot. PhantomJS apparently waits for the page to load but if you have a map or other data calculations going on, you'll need to specify a wait time.
selector |no| `body` | *String (CSS selector)* | The div you want to screenshot.
css_hide |no| null | *String (CSS selector)* | Any divs you want to hide, such as zoom buttons on map. Defaults to none.
out_file |no| './image_%Y-%m-%d.png' | *String (File path)*| The name and location of the image file you want to save. Defaults to `image_` plus the ISO year, month, day.
user_agent |no| null | *String* | Set a custom user-agent string.
scrape |no| false | *Boolean* | If set to true and `mode` is `save` will return the HTML as a string. Does not work if mode is `base64`.
