guiframework
=============

Javascript presentation and routing framework

- automatically map view ids to routes and declare a javascript handler object.
- add bespoke animations for transitions between page views.
- create standalone view components and declaratively specify javascript handler.


Routing
=============

The framework uses hash routes such as '#/page/one' to select sections of the dom marked by the css class 'page' to display. The current route should have a page with a matching id in the form of page_one, see example below. 

A simple use case for the framework is to allow mapping of url hash routes to fragments of html ('pages') in order to provide single page apps with normal page navigation with deep linking and browser history functionality.

Simple one page app
------------

In the body of the html.
    
    <div class='main-content'>
        <div class='page' id='page_one'>page one</div>
        <div class='page' id='page_two'>page two</div>
    </div>
    
Launch framework on page load.
    
    // Launch framework.
    gui.app = gui.framework({ defaultRoute:'/page/one' });
    
    
Handlers
=============

In addition to routing to a particular page section you can associate a javascript object which will handle any page javascript based enhancements, such as fetching data over ajax or starting an animation.

Example
------------

Attach the data-handler attribute to the page element,

    <div class='page' id='page_one' data-handler="pageOne">page one</div>
    
Define a new javasript component for this page,

    // Handle javascript enhancments for pageOne
    (function() {
        var pageOne = function(opts) {
      
            var that = gui.component();

            that.onload = function() {
                $('#page_one').html("test onload");
            };

            that.unload = function() {
                $('#page_one').html("test unload");
            };

            return that;
      
        };

        gui.pageOne = pageOne;

    })();

By attaching the data-handler object an instance of the above object will be automatically run and in addition it should extend the gui.component class which will mean it will have access to a number of callbacks depending on the app state, e.g. the 'onload' call back will be called each time the page is visited.
