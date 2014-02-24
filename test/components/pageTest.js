// News is loaded up via ajax from legacy wordpress page.
(function() {
    var pageTest = function(opts) {
      
        var that = gui.component();

        that.onload = function() {
            console.log('run onload');
            $('#index_test').html("test onload");

        };

        that.unload = function() {
            console.log('run unload');
            $('#index_test').html("test unload");
        };

        that.changed = function() {
            console.log('changed');
        };

        return that;
      
      };

    gui.pageTest = pageTest;

})();
