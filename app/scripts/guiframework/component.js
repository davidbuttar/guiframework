/* global gui */
// guiframework parent class for all components

gui.component = function(opts) {
    'use strict';
    var that = {};
    opts = opts || {};

    // Called when the component is active
    // this can be after page load or a later
    // navigation to  the same location
    that.onload = function() {

    };

    // Called when all effects have run and component is visible
    that.onvisible = function() {

    };

    // A component may want to preload data
    // before it is shown to do this it must
    // override this function and run the callback
    // to inform the system it's ready
    that.loadData = function(callback) {
        callback();
    };

    // Call when navigating away, allows
    // component to wrap up if need be
    that.unload = function() {

    };

    // Called when we have a change to the parameters
    // on the same page
    that.changed = false;

    return that;
};
