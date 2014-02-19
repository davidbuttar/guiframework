// guiframework is a helper library for building single page web apps
// which maintain the app state via a hash in the url.
// It also allows calls onload, unload, loadData and onvisible when required
// for guiframework components.

// Set up namespace if it's not already available
var gui = gui || {};

(function() {
    'use strict';
    var framework = function(opts) {
        var that = {};
        opts = opts || {};
        
        var defaultLoc = opts.defaultRoute || '/index/index/';
        var indexFile = opts.indexFile || ''; // root of app on server
        var prettyUri = (typeof opts.prettyUrl !== 'undefined') ? opts.prettyUrl : true; // use pretty uris, if false using query strings
        
        var pages = {};
        var components = {};
        var curLoc;
        var prevLoc;
        var curId = false;
        var prevId = false;
        var observers = opts.observers || [];
        var defaultFadeOutTime = opts.defaultFadeOutTime || 150;
        var defaultFadePauseTime = opts.defaultFadeOutTime || 200;
        var defaultFadeInTime = opts.defaultFadeInTime || 500;

        // Users can specify any enhancements that should be run 
        // against the html such as a jquery plugin.
        var htmlEnhancement = opts.htmlEnhancement || false;

        // A function to run on the first load of the app to download any required global data
        var onFirstLoad = opts.onFirstLoad || false;
        var fetching = false;
        var pageVisibleCallback = false;
        var samePage = false;


        // Place this id in a page and the framework will not run
        var staticPage = $('#static_page').length >=1;
        
        // Page Transition effects can be added on a site per site basis
        var effects = {};

        // Initialize popup manager
        gui.popups = gui.popupManager(that);


        // Default effect
        function fadeBetween() {
            $('#' + prevId).animate({
                'opacity' : 0
            }, defaultFadeOutTime, function() {
                swapActive();
                setTimeout(function() {
                    $('#' + curId).css({
                        'left' : '0px'
                    });
                    pageVisible();
                    $('#' + curId).animate({
                        'opacity' : 1
                    }, defaultFadeInTime);
                    pages[curId].onload();
                    fetching = false;
                }, defaultFadePauseTime);
            });
        }

        // Loop round DOM fragments and find js that needs
        // initializing
        function loadHandlers(el, id) {
            var componentClass = 'page';

            // No element found, so attach default component
            if (!el){
                pages[id] = gui.component();
                return;
            }
            
            // The CSS class name used to id a component.
            // Run if element is a component
            if (el.className.indexOf(componentClass) !== -1) {
                if (el.getAttribute('data-handler')) {
                    pages[id] = gui[el.getAttribute('data-handler')]();
                } else {
                    pages[id] = gui.component();
                }
            } else {
                pages[id] = gui.component();
            }
            // Search for sub components or included pages
            componentClass = 'component';
            var localComponents = $(el).find('.' + componentClass + ' , .page');
            for (var i = 0, l = localComponents.length; i < l; i++) {
                if ($(localComponents[i]).hasClass('page')){
                    $(localComponents[i]).removeClass('page').addClass('component');
                }
                if (localComponents[i].getAttribute('data-handler')) {
                    if (!components[localComponents[i].getAttribute('id')]) {
                        components[localComponents[i].getAttribute('id')] = gui[localComponents[i].getAttribute('data-handler')]();
                        components[localComponents[i].getAttribute('id')].onload();
                    }
                }
            }

            //Check for an ajax filler to deal with legacy pages in mygrapeshot
            var localAjax = $(el).find('.ajax');
            if (localAjax[0]) {
                $.ajax({
                    url : localAjax[0].getAttribute('data-loc')
                }).done(function(data) {
                    //$('#ajax-content').html();
                    $(localAjax[0]).after($(data).find('#main-inner').html()).remove();
                });
            }
        }

        // Make new component active
        function swapActive() {
            $('#' + prevId).removeClass('comp-active');
            $('#' + curId).addClass('comp-active');
        }

        // We may have fail to load a page
        // So curId and prevId are unreliable
        // need to figure out what is really currently displayed
        // and where we are going to
        function updatePrev() {
            prevId = $('.comp-active').attr('id');
        }

        // Based on data-effect values calculate
        // an effect.
        function suggestedEffectFunctionName(prevEffect, curEffect){
            return prevEffect+'To' + curEffect.charAt(0).toUpperCase() + curEffect.slice(1);
        }

        // Show page with id, applying any outgoing on incoming animations.
        function showPage() {
            loaded();
            updatePrev();
            if (prevId) {
                var prevEffect = $('#' + prevId).data('effect') || 'fade';
                var curEffect = $('#' + curId).data('effect') || 'fade';
                var suggestedEffect = suggestedEffectFunctionName(prevEffect, curEffect);
                if (effects[suggestedEffect]) {
                    effects[suggestedEffect]($('#' + prevId), $('#' + curId), swapActive, pageVisible, pages[curId].onload);
                } else if (prevId === curId) {// going to the page we are on requires no effects
                    pages[curId].onload();
                    fetching = false;
                    pageVisible();
                } else {
                    fadeBetween();
                }
            } else {
                $('#' + curId).addClass('comp-active');
                pageVisible();
                $('#' + curId).animate({
                    'opacity' : 1
                }, 500);
                pages[curId].onload();
                fetching = false;
            }
        }

        // Run when page is display:block to avoid not being able to detect height etc
        function pageVisible() {
            if (pageVisibleCallback) {
                var callback = pageVisibleCallback;
                pageVisibleCallback = false;
                callback();
            }
            pages[curId].onvisible();
        }

        // If the html for a component is in place we can
        // run any jquery helps on it, and load it's data.
        function htmlLoaded(){
            var el = $('#' + curId);
            
            if(htmlEnhancement){
                htmlEnhancement();
            }

            loadHandlers(el[0], curId);

            // Run handlers
            loadPageData();
        }

        // Lazy load a pages html if need be.
        function loadPage(uri) {
            var ajaxFlag = prettyUri ? '?ajax=true' : '&ajax=true';
            // Test if html is preloaded
            if($('#'+curId).length === 1){
                htmlLoaded();
            }else{
                $.ajax({
                    url : indexFile+uri + ajaxFlag,
                    error : function() {
                        gui.msg.error('Page fetch unsuccessful');
                        fetching = false;
                    },
                    success : function(html) {
                        // Make sure were are loading a fragment
                        // and not a full page
                        if (html.indexOf('DOCTYPE') !== -1) {
                            console.error('Error loading incorrect page type');
                            return;
                        } else if (html.indexOf('not_found') !== -1) {
                            curId = 'index_not_found';
                        }
                        var el = $('#' + curId);
                        if (el.length === 0) {
                            el = $(html).prependTo('.main-content');
                        }
                        htmlLoaded();
                    }
                });
            }
        }

        // Allow the component to prefetch any data it 
        // required it should then call showPage when it's ready
        function loadPageData() {
            if (onFirstLoad) {
                onFirstLoad(function() {
                    pages[curId].loadData(showPage);
                    that.updateObservers();
                    onFirstLoad = false;
                });
            } else {
                pages[curId].loadData(showPage);
                that.updateObservers();
            }
        }

        // Display a loading message.
        function loading() {
            gui.msg.loading(function() {
                if (prevId){
                    $('#' + prevId).animate({
                        'opacity' : 0
                    }, 150);
                }
            });
        }

        // Hide loading message.
        function loaded() {
            gui.msg.loaded();
            fetching = false;
            if (samePage) {
                $('#' + curId).stop(true, true).animate({
                    'opacity' : 1
                }, 150);
            }
        }

        // Url to id
        function processUrl(uri) {
            var controller, action, uriBits;
            if(prettyUri){
                uri = uri.replace(/^\//,'').replace(/\/$/,'');
                uriBits = uri.split('/');
                controller = uriBits[0] || 'index';
                action = uriBits[1] || 'index';
            }else{
                controller = that.getParameterByName('c', uri);
                action = that.getParameterByName('a', uri);
            }
            return controller + '_' + action;
        }


        // ---- Public Methods ----


        that.getParameterByName = function(name, url)
        {
            url = url || window.location.href;
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regexS = '[\\?&]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            if(results === null){
                return false;
            }else {
                return decodeURIComponent(results[1].replace(/\+/g, ' '));
            }
        };

        // Update any observers passing the current active ID
        that.updateObservers = function() {
            for (var i = 0, ll = observers.length; i < ll; i++) {
                observers[i](curId);
            }
        };

        // When the framework is loading via ajax set it to fetching
        that.fetching = function(inFetching) {
            fetching = inFetching;
        };

        // Get the fetching state
        that.isFetching = function() {
            return fetching;
        };

        //Use the prevLoc to go back, limited to one page
        that.back = function() {
            window.location.hash = prevLoc || defaultLoc;
        };

        // Add an observer which can then react to route changes
        that.addObserver = function(inCallback) {
            observers.push(inCallback);
        };

        // Add an observer which can then react to route changes
        that.addEffect = function(inName, inEffect) {
            effects[inName] = inEffect;
        };

        //Return the current page handler of a given id
        that.handler = function(id) {
            if (pages[id]){
                return pages[id];
            }else{
                return false;
            }
        };

        //Return the current page handler of a given id
        that.component = function(id) {
            if (components[id]){
                return components[id];
            }else{
                return false;
            }
        };

        // Load any stand alone components found on the page
        that.loadComponents = function(inEl, selector) {
            var componentClass = selector || 'component';
            var el = inEl || 'body';
            var localComponents = $(el).find('.' + componentClass);
            for (var i = 0, l = localComponents.length; i < l; i++) {
                if (localComponents[i].getAttribute('data-handler')) {
                    if (!components[localComponents[i].getAttribute('id')]) {
                        components[localComponents[i].getAttribute('id')] = gui[localComponents[i].getAttribute('data-handler')]();
                        // Unless it's a popup run onload to get the component loaded.
                        if (!$(localComponents[i]).hasClass('pm_popup')){
                            components[localComponents[i].getAttribute('id')].onload();
                        }
                    }
                }
            }

            // Trigger the event (useful on page load).
            $(window).hashchange();
        };


        that.page = function(loc, callback) {
            that.pageVisible(callback);
            if ('?' + loc !== curLoc) {
                window.location.hash = '#?' + loc;
            } else {
                pageVisible();
            }
        };

        // Get a callback on next page visible, useful for testing
        that.pageVisible = function(callback) {
            pageVisibleCallback = callback;
        };

        // Bind the history event.
        $(window).hashchange(function() {
            if (staticPage){ return; }
            if (fetching) {
                //reverse any change to the page location
                if (curLoc){
                    location.hash = curLoc;
                }
                return;
            }

            fetching = true;

            prevLoc = curLoc;

            // Alerts every time the hash changes!
            curLoc = location.hash.replace('#', '');

            if (curLoc === '') {
                curLoc = defaultLoc;
            }

            // If available call unload on previous page
            prevId = curId || processUrl(curLoc);
            curId = processUrl(curLoc);

            loading();

            samePage = ((prevId === curId) && pages[prevId] && pages[prevId].changed);

            // If it's the same page and it has a changed function don't do normal full page load process
            if (prevId && pages[prevId]) {
                if (samePage) {
                    pages[prevId].changed();
                } else {
                    pages[prevId].unload();
                }
            }

            // If the component/page is already loaded then don't need to 'loadPage'
            // so can just start to loadPageData if there is any. Pages always end registered
            // in the pages array even if they have no explicid handlers.
            if (pages[curId]) {
                if (!samePage) {
                    loadPageData();
                }
            } else {
                loadPage(curLoc);
            }
        });

        return that;

    };

    gui.framework = framework;

})();