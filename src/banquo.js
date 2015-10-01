'use-strict';

var fs            = require('fs'),
    _             = require('underscore'),
    phantom       = require('node-phantom'),
    chalk         = require('chalk'),
    phantomjs     = require('phantomjs-webfonts');

function banquo(opts, callback) {
  var now = new Date().toISOString().split('T')[0] // '2015-08-07T16:33:29.571Z' => '2015-08-07'
  var settings = _.extend({
    mode: 'base64',
    viewport_width: 1440,
    viewport_height: 900,
    delay: 1000,
    selector: 'body',
    css_file: '',
    scrape: false,
    user_agent: null,
    out_file: './image_'+now+'.png'
  }, opts);

  // Append 'http://' if protocol not specified
  if (!settings.url.match(/^\w+:\/\//)) {
    settings.url = 'http://' + settings.url;
  }

  var css_text;
  if (settings.css_hide){
    css_text = settings.css_file += "\n\n " + settings.css_hide + " { display: none !important; }\n";
  }

  // phantomjs heavily relies on callback functions
  var page,
      ph;

  // If `scape` is set, then fill this var with the innerHTML of body
  var body_markup,
      scrape = settings.scrape;

  console.log(chalk.cyan('Requesting...'), settings.url);

  phantom.create(createPage, {phantomPath: phantomjs.path});

  function createPage(err, _ph) {
    ph = _ph;
    ph.createPage(openPage);
  }

  function openPage(err, _page) {
    page = _page;
    page.set('onError', function() { return; });
    page.onConsoleMessage = function (msg) { console.log(chalk.yellow('Phantom console msg:'), msg); };
    if (settings.user_agent){
        page.set('settings', {
          userAgent: settings.user_agent,
          javascriptEnabled: true,
          loadImages: true
        });
    }
    page.set('viewportSize', {width: settings.viewport_width, height: settings.viewport_height});
    page.open(settings.url, prepForRender);
  }

  function prepForRender(err, status) {
    page.evaluate(runInPhantomBrowser, renderImage, settings.selector, css_text, scrape);
  }

  function runInPhantomBrowser(selector, cssText, scraping) {
    var body_markup;
    if (scraping){
      body_markup = document.getElementsByTagName('html')[0].innerHTML;
    }
    if (cssText) {
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(cssText));
      document.head.appendChild(style);
    }
    var element = document.querySelector(selector);
    return {rect: element.getBoundingClientRect(), markup: body_markup};
  }

  function renderImage(err, valsFromPage) {

    setTimeout(function(){
      page.set('clipRect', valsFromPage.rect);
      if (settings.mode != 'save'){
        page.renderBase64('PNG', base64Rendered);
      }else{
        page.render(settings.out_file, cleanup);
        console.log(chalk.green('\nWriting to file... ') + settings.out_file);
        callback(null, valsFromPage.markup);
      }
    }, settings.delay);
  }

  function base64Rendered(err, imageData){
    callback(err, imageData);
    cleanup();
  }

  function cleanup() {
    ph.exit();
  }
}

module.exports = {
  capture: banquo
}
