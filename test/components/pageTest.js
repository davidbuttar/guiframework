// News is loaded up via ajax from legacy wordpress page.
(function() {
    var pageTest = function(opts) {
        var that = gui.component();

        console.log("asdfasdfasdf");
        that.onload = function() {
            console.log("onload fired");
            $('#index_test').html("( . Y . Y . )");
        }

        return that;
    };

    gui.pageTest = pageTest;
})();
