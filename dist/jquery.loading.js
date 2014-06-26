/*
 *  jquery-loading - v0.0.0
 *  Easily add and manipulate loading states of any element on the page
 *  http://github.com/CarlosBonetti/jquery-loading
 *
 *  Made by Carlos Bonetti
 *  Under MIT License
 */
;(function($, window, undefined) {

  var Loading = function(element, options) {
    this.element = element;
    this.settings = $.extend({}, Loading.defaults, options);
    this.settings.fullPage = this.element.is('body');

    this.init();
  };

  Loading.defaults = {

    /**
     * Message to be rendered on the overlay content
     */
    message: 'Loading...',

    /**
     * Theme to be applied on the loading element
     *
     * Some default themes are implemented on `jquery.loading.css`, but you can
     *  define your own. Just add a `.loading-theme-my_awesome_theme` selector
     *  somewhere with your custom styles and change this option
     *  to 'my_awesome_theme'. The class is applied to the parent overlay div
     */
    theme: 'light',

    /**
     * Set to true to stop the loading state if the overlay is clicked
     * This options does NOT override the onClick event
     */
    stoppable: false,

    /**
     * Function to be executed when the loading state is started
     * Receives the loading object as parameter
     */
    onStart: function(loading) {
      loading.overlay.fadeIn(150);
    },

    /**
     * Function to be executed when the loading state is stopped
     * Receives the loading object as parameter
     */
    onStop: function(loading) {
      loading.overlay.fadeOut(150);
    },

    /**
     * Function to be executed when the overlay is clicked
     * Receives the loading object as parameter
     */
    onClick: function() {}
  };

  /**
   * Extend the Loading plugin default settings with the user options
   */
  Loading.setDefaults = function(options) {
    Loading.defaults = $.extend({}, Loading.defaults, options);
  };

  $.extend(Loading.prototype, {

    /**
     * Initializes and create the overlay
     */
    init: function() {
      this.initOverlay();
      this.attachMethodsToExternalEvents();
      this.attachOptionsHandlers();
    },

    /**
     * Create the overlay element and the default content
     */
    initOverlay: function() {
      this.overlay = $('<div class="loading-overlay loading-theme-' + this.settings.theme + '"><div class="loading-overlay-content">' + this.settings.message + '</div></div>')
        .css({
          position: this.settings.fullPage ? 'fixed' : 'absolute',
          zIndex: 9 + this.settings.fullPage,
          opacity: 0.7,
          display: 'table'
        })
        .hide();

      this.overlayContent = this.overlay.find('.loading-overlay-content')
        .css({
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center'
        });

      $('body').prepend(this.overlay);

      var elementID = this.element.attr('id');
      if (elementID) {
        this.overlay.attr('id', elementID + '_loading-overlay');
      }

      this.resize();
    },

    /**
     * Attach some methods to external events
     * e.g. overlay click, window resize etc
     */
    attachMethodsToExternalEvents: function() {
      var self = this;

      // Stop loading if the `stoppable` option is set
      if (self.settings.stoppable) {
        self.overlay.on('click', function() {
          self.stop();
        });
      }

      // Trigger the `loading.click` event if the overlay is clicked
      self.overlay.on('click', function() {
        self.element.trigger('loading.click', this);
      });

      // Bind the `resize` method to `window.resize`
      $(window).on('resize', function() {
        self.resize();
      });

      // Bind the `resize` method to `document.ready` to guarantee right
      // positioning and dimensions
      $(document).on('ready', function() {
        self.resize();
      });
    },

    /**
     * Attach the handlers defined on `options` for the respective events
     */
    attachOptionsHandlers: function() {
      var self = this;

      self.element.on('loading.start', function(event, loading) {
        self.settings.onStart(loading);
      });

      self.element.on('loading.stop', function(event, loading) {
        self.settings.onStop(loading);
      });

      self.element.on('loading.click', function(event, loading) {
        self.settings.onClick(loading);
      });
    },

    /**
     * Reposition the overlay on the top of the target element
     * This method needs to be called if the target element changes position
     *  or dimension
     */
    resize: function() {
      var element = this.element,
          totalWidth = element.outerWidth(),
          totalHeight = element.outerHeight();

      if (this.settings.fullPage) {
        totalHeight = '100%';
        totalWidth = '100%';
      }

      this.overlay.css({
        top: element.offset().top,
        left: element.offset().left,
        width: totalWidth,
        height: totalHeight
      });
    },

    /**
     * Trigger the `loading.start` event and turn on the loading state
     */
    start: function() {
      this.element.trigger('loading.start', this);
    },

    /**
     * Trigger the `loading.stop` event and turn off the loading state
     */
    stop: function() {
      this.element.trigger('loading.stop', this);
    },

    /**
     * Check whether the loading state is active or not
     */
    active: function() {
      return this.overlay.is(':visible');
    },

    /**
     * Toggle the state of the loading overlay
     */
    toggle: function() {
      if (this.active()) {
        this.stop();
      } else {
        this.start();
      }
    },

    /**
     * Change the loading options at runtime
     */
    options: function(options) {
      this.settings = $.extend({}, this.settings, options);
    }
  });

  /**
   * Name of the data attribute where the plugin object will be stored
   */
  var dataAttr = 'jquery-loading';

  /**
   * Create the `loading` jQuery chainable method
   */
  $.fn.loading = function (options) {
    // Get the other arguments if the plugin was called
    //  as e.g. `$(...).loading('method', arg1, arg2, ...)`
    var otherArgs = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : [];

    return this.each(function() {
      var loading = $.data(this, dataAttr);
      if (!loading) {
        $.data(this, dataAttr, (loading = new Loading($(this), options)));
      }

      if (typeof options === 'string') {
        loading[options].apply(loading, otherArgs);
      } else {
        loading.start();
      }
    });
  };

  /**
   * Create the `:loading` jQuery selector
   * Examples of use:
   *  `$(':loading')` to get all the elements with the loading state active
   *  `$('#my-element').is(':loading')` to check if the element is loading
   */
  $.expr[':'].loading = function(element) {
    var loadingObj = $.data(element, dataAttr);

    if (!loadingObj) {
      return false;
    }

    return loadingObj.active();
  };

  $.Loading = Loading;

})(jQuery, window);