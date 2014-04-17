/* global gui */
// Allows insertion of popups of various types in the page.
// can be populater with inline content from the dom or an iframe.

gui.popupManager = function(app) {
    'use strict';
    var that = {};
    var popupSettings = {};
    var curOpt = {};
    var $this = false;

    // Make sure popup is centered vertically and horizontally
    function centerMessage() {
        if ($this) {
            $this.css('top', (($(window).height() - $this.outerHeight()) / 2) + $(window).scrollTop() + 'px');
            $this.css('left', (($(window).width() - $this.outerWidth()) / 2) + $(window).scrollLeft() + 'px');
        }
    }

    // Add a popup with inOpt and show it unless inNoshow is true
    function add(inOpt, inNoshow) {
        if (!inOpt.id){
            return;
        }
        // Can't do anything without id
        popupSettings[inOpt.id] = inOpt;
        curOpt = inOpt;
        if (!inNoshow){
            show();
        }
    }

    // Show popup inId or return false if no such popup
    function show(inId) {
        if (inId && ( typeof popupSettings[inId] === 'undefined')) {
            return false;
        } else if (inId) {
            curOpt = popupSettings[inId];
        }
        showOverlay();
        return true;
    }

    // Hide popups
    function hide() {
        hideOverlay();
    }

    // Resize background and recenter the popup when the window has been resized
    $(window).resize(function() {
        if ($('#gui-overlay').length && $('#gui-overlay').css('display') === 'block') {
            $('#pm_channel-help h1').text($(document).height());
            $('#gui-overlay').css({
                'height' : 'auto'
            });
            $('#gui-overlay').css({
                'height' : $(document).height()
            });
            centerMessage();
        }
    });

    // Put the darken background overlay on place
    function showOverlay() {
        that.showOverlay();
        showBox();
        $('#gui-overlay').animate({
            'opacity' : 0.4
        }, 300);
    }

    // Hide overlay
    function hideOverlay() {
        hideBox();
        $('#gui-overlay').animate({
            'opacity' : 0
        }, 300, function() {
            // /this.style.removeAttribute('filter');
            $('#gui-overlay').css({
                'display' : 'none'
            });

        });
    }

    // Show Popup Box
    function showBox() {
        if (!document.getElementById('pm_' + curOpt.id)) {
            buildBox();
        }
        var handler = app.component('pm_'+curOpt.id);
        if (handler) {
            handler.onload();
        }
        $this = $('#pm_' + curOpt.id);
        $this.css({
            'display' : 'block'
        });
        // position in middle of page
        centerMessage();
        return $this;
    }

    // Depending on opts get inner content of popup
    function getInnerContent() {
        if (curOpt.url) {
            return '<iframe src=\'' + curOpt.url + '\' horizontalscrolling=\'no\' verticalscrolling=\'no\' width=\'' + curOpt.width + '\' height=\'' + curOpt.height + '\' frameBorder=\'0\'></iframe>';
        } else if (curOpt.selector) {
            var html = $(curOpt.selector).html();
            return html;
        }
    }

    // Content in an element on the page can be built into a popup box
    // using this function
    function buildBox() {
        var innerContent = getInnerContent();
        var buttons = '';
        if(curOpt.ok){
            buttons = '<div class=\'pm-popup-buttons\'> <button class=\'button\'>OK</button></div>';
        }
        var boxHtml = '<div id=\'pm_'+curOpt.id+'\' class=\'pm_popup\'><div class=\'pm-popup-inner\'> '+innerContent + buttons+'</div></div>';
        var thisPopup = $(boxHtml).appendTo('body');
        if (curOpt.ok) {
            //attach events
            thisPopup.find('.button').click(function() {
                $(window).scrollTop(0);
                hide();
                curOpt.ok();
            });
        }
    }

    // Hide Popup Box
    function hideBox() {
        $('#pm_' + curOpt.id).css({
            'display' : 'none'
        });
    }

    // pm_close css class can be placed anywhere and this will
    // cause it to close any popups
    $(document).on('click', '.pm_close', function() {
        hide();
    });

    // Avoid triggering any document background click events, e.g. an event that
    // deselects selected elements on background click, when the popup is visible
    // the background state should not be clickable.
    $(document).on('click', '.pm_popup', function(e) {
        e.stopPropagation();
    });

    // Puplic api

    // Show overlay inserting first if need be
    that.showOverlay = function() {
        // Check if overlay is inserted already
        if (!document.getElementById('gui-overlay')) {
            $('body').append('<div id=\'gui-overlay\' style=\'opacity:0;\'>&nbsp;</div>');
            //$('#m_overlay').css({'opacity':'0.55'});

        }
        $('#gui-overlay').css({
            'display' : 'block',
            'height' : $(document).height()
        });
    };

    that.show = show;
    that.hide = hide;
    that.add = add;

    return that;
};