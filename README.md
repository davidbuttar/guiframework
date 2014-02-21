guiframework
=============

Javascript presentation and routing framework

- automatically map view ids to routes and declare a javascript handler object.
- add bespoke animations for transitions between page views.
- create standalone view components and declaratively specify javascript handler.


Routing
=============

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
