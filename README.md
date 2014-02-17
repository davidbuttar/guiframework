guiframework
=============

Javascript presentation and routing framework

- automatically map view ids to routes and declare a javascript handler object.
- add bespoke animations for transitions between page views.
- create standalone view components and declaratively specify javascript handler.

Example
-------

    

    <script>
    $(function() {
        gui.app = gui.framework({
            prettyUrl : false,
            defaultRoute: "?c=index&a=index"
        });
    });
    </script>
