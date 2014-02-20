// News is loaded up via ajax from legacy wordpress page.
(function() {
    var pageTest = function(opts) {
        var that = gui.component();

        that.onload = function() {

            $('#index_test').html("( . Y . Y . )");
        }

        return that;
    };

    gui.pageTest = pageTest;
})();
