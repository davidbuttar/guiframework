/* global gui */
// guiframework expects this class and it's accosciated html
// to display loading alert and other messages and dialogs.
'use strict';
(function() {
    var sysMsg = function(opts) {
        var that = {};
        opts = opts || {};
        var loadingTimer;
        var loadingTime = 400;
        var attachedDialogCancel = false;
        var autoHideTime = 3200;
        var hideGeneralTimeout; // General messages auto hide
        
        // Center a message both vertically and horizontally.
        function centerMessage($this) {
            $this.css('top', (($(window).height() - $this.outerHeight()) / 2) + $(window).scrollTop() + 'px');
            $this.css('left', (($(window).width() - $this.outerWidth()) / 2) + $(window).scrollLeft() + 'px');
        }

        // Attach events appropriately for dialog boxes
        function attachDialogEvents(callback, keepOverlay) {
            if (!attachedDialogCancel) {
                $('#gui-dialog-cancel').click(function(e) {
                    e.preventDefault();
                    that.hideDialog();
                });
                attachedDialogCancel = true;
            }
            $('#gui-dialog-ok').unbind();
            $('#gui-dialog-ok').bind('click', function() {
                that.hideDialog(keepOverlay);
                callback();
            });
        }

        // Display Loading message after a certain period
        that.loading = function(callback) {
            loadingTimer = setTimeout(function() {
                $('#gui-loading').show();
                centerMessage($('#gui-loading'));
                if (callback){
                    callback();
                }
            }, loadingTime);
        };

        // Hide loading
        that.loaded = function() {
            clearTimeout(loadingTimer);
            $('#gui-loading').hide();
        };
        
        // Uses popup overlay if required
        that.showOverlay = function() {
            $('#gui-overlay').stop();
            gui.popups.showOverlay();
            $('#gui-overlay').animate({
                'opacity' : 0.4
            }, 300);
        };

        // Hide background overlay
        that.hideOverlay = function() {
            $('#gui-overlay').animate({
                'opacity' : 0
            }, 300, function() {
                $('#gui-overlay').css({
                    'display' : 'none'
                });
            });
        };
        
        // Generic dialog function pass the text and a callback to take
        // Place on confirmation
        that.dialog = function(text, callback, keepOverlay, noCancel, asHTML) {
            attachDialogEvents(callback, keepOverlay);
            that.showOverlay();
            $('#gui-dialog').removeClass('no-cancel');
            if (noCancel){
                $('#gui-dialog').addClass('no-cancel');
            }
            if ( typeof asHTML !== 'undefined' && asHTML) {
                $('#gui-dialog').find('.message-dialog').html(text);
            } else {
                $('#gui-dialog').find('.message-dialog').text(text);
            }
            $('#gui-dialog').show();
            centerMessage($('#gui-dialog'));
        };

        // Hide dialog box
        that.hideDialog = function(keepOverlay) {
            if (!keepOverlay){
                that.hideOverlay();
            }
            $('#gui-dialog').hide();
        };
        
        // Display Saving Message
        that.general = function(str, timeout) {
            var curTimeout = timeout || autoHideTime;
            that.hide();
            clearTimeout(hideGeneralTimeout);
            $('#gui-general').show();
            $('#gui-general').find('.message-type').html(str);
            centerMessage($('#gui-general'));
            hideGeneralTimeout = setTimeout(function(){
                $('#gui-general').hide();
            }, curTimeout);
        };
        
        // Display Saving Message
        that.error = function(str) {
            str = str || 'Unknown failure';
            that.hide();
            $('#gui-error').find('.message-error').text(str);
            $('#gui-error').show();
            centerMessage($('#gui-error'));
        };

        // Hide any system messages.
        that.hide = function() {
            that.hideOverlay();
            $('.message').hide();
        };

        // Allow closing of an error message
        $(document).on('click', '#error-ok', function() {
            $('.message').hide('slow');
            that.hideOverlay();
        });

        return that;

    };

    gui.msg = sysMsg();

})();
