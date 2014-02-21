guiframework
=============

Javascript presentation and routing framework using jquery.

- automatically map view ids to routes and declare a javascript handler object.
- create standalone view components and declaratively specify javascript handler.
- add bespoke effects for transitions between page views.

Routing
=============

When your application starts, the framework is responsible for displaying page templates. It does so by matching the current URL to the page ids that you've defined, in the body of the html.
    
    <div class='gui-main-content'>
        <div class='gui-page' id='page_one'>page one</div>
        <div class='gui-page' id='page_two'>page two</div>
    </div>

The page with id='page_one' will be displayed when the url is /page/one and like wise it's /page/two for the other page. Pages should be defined with the special 'gui-page' css class so that guiframework knows there are the page templates for the app.


You can lauch guiframework as follows, giving it the default route to match your home page.

    $(function () {
        gui.app = gui.framework({
            defaultRoute: '/page/one'
        });
    });
    
You must also provide css rules for .gui-page and .gui-page-active. It will have the gui-page-active class when it is the active page.

    .gui-page {
        display: none;
    }

    .gui-page-active {
        display: block;
    }
    
Handlers
=============

In addition you can associate a javascript object with a page which will handle any page javascript based enhancements, such as fetching data over ajax or starting an animation.

Example
------------

Attach the data-handler attribute to the page element,

    <div class='page' id='page_one' data-handler="pageOne">page one</div>
    
Define a new javascript component for this page,

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


Components
=============

Components are the javascript handlers which we can attach to both pages (as seen in the handlers sectiona above) and stand alone components, a component has a number of useful callbacks.

- onload: Called on page load on components and called on each fresh visit on pages.
- unload: Called when leaving a current page.
- loadData: Called before a page due to be visited is visible, so that any ajax data can be fetched and inserted in to the dom before the user sees the page.
- changed: Pages can optionally implement the changed function which will trigger when the same page is selected but the parametes have changed, e.g. /index/posts/1 changes to /index/posts/2.


Effects
=============

By default when you move from one page to another the outgoing page will fade out and the incoming page will fade in, however more bespoke animations are possible, using the data-effect attribute. For example to add a slide up effect.

    <div class='page' id='page_one' data-effect="slideup">page one</div>
    
And then add the follow to your app instance,

    gui.app.addEffect('fadeToSlideup', function(outgoingElm, incomingElm, swappedCallback, onvisibleCallback,                                                           onloadCallback){
        outgoingElm.animate({
                'opacity' : 0
            }, 600, function() {
            swappedCallback();
            incomingElm.css({
                'top' : '100%'
            }).animate({
                'opacity' : 1,
                'top' : '0px'
            },{
                duration:300,
                specialEasing: {
                    top: 'linear'
                },
                complete:onvisibleCallback
            });
            onloadCallback();
            fetching = false;
        });
    });

The app will then call fadeToSlideup when going from a default page which using a fade out effect, to a page which has the slideup data-effect value. This will cause the page to slide up into view.

Note: you will have to have appropriate css rules set so that slideup page is positioned correctly.

