/* jshint undef:false */

;(function ($, undefined) {

  var div;

  module('All tests', {
    setup: function() {
      div = $('<div id="test-div">Test div</div>');
    }
  });

  test('if loading jquery function is chainable', function() {
    ok(div.loading() instanceof $, 'loading is chainable');
  });

  test('if loading object is accessible by Loading jquery method', function() {
    equal(div.Loading(), undefined, 'Not started elements have undefined loading object');
    div.loading();
    ok(div.Loading() instanceof $.Loading, 'Started elements have a valid Loading object');
    equal(div.Loading().element.attr('id'), 'test-div', 'Loading object has reference to the right element');
  });

  test('events and triggers', function() {
    var mustBeTrueStart = false;
    div.on('loading.start', function(event, loading) {
      mustBeTrueStart = true;
      ok(loading instanceof $.Loading, 'Loading object is send as parameter to loading.start handler');
    });
    div.loading('start');
    ok(mustBeTrueStart, 'start method trigger the loading.start handlers');

    var mustBeTrueStop = false;
    div.on('loading.stop', function(event, loading) {
      mustBeTrueStop = true;
      ok(loading instanceof $.Loading, 'Loading object is send as parameter to loading.stop handler');
    });
    div.loading('stop');
    ok(mustBeTrueStop, 'stop method trigger the loading.stop handlers');

    var mustBeTrueClick = false;
    div.on('loading.click', function(event, loading) {
      mustBeTrueClick = true;
      ok(loading instanceof $.Loading, 'Loading object is send as parameter to loading.click handler');
    });
    div.Loading().overlay.trigger('click');
    ok(mustBeTrueClick, 'click method trigger the loading.click handlers');
  });

  test('active flag', function() {
    div.loading();
    div.off('loading.start').off('loading.stop');

    equal(div.Loading().active(), true, 'Active state is turned on on initialization');

    div.loading('stop');
    equal(div.Loading().active(), false, 'Active state is turned off if stopped, even with events disabled');

    div.loading('start');
    equal(div.Loading().active(), true, 'Active state is turned on if started, even with events disabled');
  });

  test(':loading selector', function() {
    equal(div.is(':loading'), false, 'Not loading elements return false to selector');

    div.loading();
    equal(div.is(':loading'), true, 'Loading elements return true to selector');

    div.loading('stop');
    equal(div.is(':loading'), false, 'Stopped elements return false to selector');
  });

  test('start option', function() {
    div.loading({
      start: false
    });

    equal(div.Loading().active(), false, 'Loading object is not started if `start` options is set to false');
  });

})(jQuery);