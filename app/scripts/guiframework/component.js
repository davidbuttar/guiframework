/* global gui */
// guiframework parent class for all components
'use strict';
(function() {
    var comp = function(opts) {
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
        // component to wrap up if need be.
        that.unload = function() {
            
        };

        return that;
    };

    gui.component = comp;

})();
