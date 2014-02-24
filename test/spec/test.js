/* global describe, it, assert, $, gui, beforeEach, afterEach, mainContent */

(function () {
    'use strict';

    describe('Routing', function(){
    
        // Make sure we have enough time.
        this.timeout(15000);


        beforeEach(function(){
            $('.main-content').html(mainContent);
            gui.app = gui.framework({
                defaultFadeInTime:1,
                defaultFadeOutTime:1,
                defaultFadePauseTime:1
            });
            gui.app.loadComponents();
        });


        afterEach(function(done){
            setTimeout(function(){
                document.location.hash = '';
                gui.app = {};
                $(window).unbind( 'hashchange');
                done();
            }, 200);
        });


        describe('On fresh page load the default page should be visible', function(){
            it('index_index should be selected', function(){
                
                document.location.hash.should.equal('');
                $('#index_index').hasClass('comp-active').should.equal(true);
            
            });
        });


        describe('On change hash to #/index/test', function(){

            it('page with id=index_test should be the only one active', function(done){
                document.location.hash = '/index/test';
                gui.app.pageVisible(function(){
                    assert(
                        $('#index_test').hasClass('comp-active'),
                        'index_test has comp-active class'
                    );
                    assert(
                        !$('#index_index').hasClass('comp-active'),
                        'index_index does not have comp-active class'
                    );
                    done();
                });
            });

        });


        describe('When a route changes I should be able to call the onload of the new pages component', function(){

            it('page with id=index_test should be active', function(done){
                $('#index_button_link').trigger('click');
                gui.app.pageVisible(function(){
                    assert(
                        $('#index_test').hasClass('comp-active'),
                        'index_test has comp-active class'
                    );
                    done();
                });
            });

            it('page with id=index_test should have text changed by onload', function(done){
                $('#index_button_link').trigger('click');
                gui.app.pageVisible(function(){
                    setTimeout(function(){
                        assert(
                            $('#index_test').html() === 'test onload',
                            'content of index_test is not "test onload"'
                        );
                        done();
                    },10);
                    
                });
            });

        });


        describe('When a route changes I should be able to call the unload of the outgoing component', function(){

            it('page with id=index_test should hold test unload', function(done){
                $('#index_button_link').trigger('click');
                gui.app.pageVisible(function(){

                    document.location.hash = '/index/index';

                    gui.app.pageVisible(function(){

                        $('#index_test').html().should.equal('test unload');

                        done();
                    });
                });

            });
        
        });


        describe('Browser History should be preseved', function(){

            it('should return to predictable location on multiple navigation and back requests', function(done){

                gui.app.page('/index/index', function(){

                    gui.app.page('/index/test', function(){

                        gui.app.page('/index/button', function(){

                            gui.app.page('/index/test', function(){

                                history.back();

                                gui.app.pageVisible(function(){

                                    history.back();

                                    gui.app.pageVisible(function(){

                                        $('.comp-active').attr('id').should.equal('index_test');
                                        done();

                                    });
                                });
                            });
                        });
                    });
                });
            
            });
        
        });

    });


    describe('Route Observer', function(){
        // Make sure we have enough time.
        this.timeout(15000);

        beforeEach(function(){
            $('.main-content').html(mainContent);
            gui.app = gui.framework({
                defaultFadeInTime:1,
                defaultFadeOutTime:1,
                defaultFadePauseTime:1
            });
            gui.app.loadComponents();

            gui.app.addObserver(function (id){
                if (id === 'index_button'){
                    $('#whatami').html('bannana');
                }
                else{
                    $('#whatami').html('apple');
                }
            });
            
        });

        afterEach(function(done){
            setTimeout(function(){
                document.location.hash = '';
                gui.app = {};
                $(window).unbind( 'hashchange');
                done();
            }, 100);
        });

        describe('Add callback to observe route changes, with an update that includes the active id', function(){
            it('It should set #whatami to bannana when id changes to index_button', function(done){
                
                document.location.hash = '/index/button';
                
                gui.app.pageVisible(function(){
                    assert(
                        $('#whatami').html() === 'bannana',
                        'content of whatami is bannana'
                    );
                    done();
                });
                
            });
        });

    });


    describe('Query String', function(){
        // Make sure we have enough time.
        this.timeout(15000);

        beforeEach(function(){
            
            $('.main-content').html(mainContent);
            
            gui.app = gui.framework({
                defaultFadeInTime:1,
                defaultFadeOutTime:1,
                defaultFadePauseTime:1,
                prettyUrl:false
            });

            gui.app.loadComponents();
            
        });

        afterEach(function(done){
            setTimeout(function(){
                document.location.hash = '';
                gui.app = {};
                $(window).unbind( 'hashchange');
                done();
            }, 100);
        });

        describe('Get parameter values from the uri hash', function(){
            it('should correctly report the values of c and a', function(){
                
                document.location.hash = '?c=index&a=button';
                
                gui.app.getParameterByName('c').should.equal('index');
                gui.app.getParameterByName('a').should.equal('button');
                
            });
        });

        describe('Should not fail when a url is a parameter', function(){
            it('should correctly report the values of c and a', function(){
                
                document.location.hash = '#?c=index&a=charts&loc=http://duff-linux.cambridge.grapeshot.co.uk/mygrapeshot/analytics/api/index.php/appnexus/traffic/?';
                
                gui.app.getParameterByName('c').should.equal('index');
                gui.app.getParameterByName('a').should.equal('charts');
                
            });
        });

        describe('Should be able to read parameters from the url parameter', function(){
            it('should correctly report the values of c and a', function(){
                
                document.location.hash = '#?a=index&b=charts&loc=http://duff-linux.cambridge.grapeshot.co.uk/mygrapeshot/analytics/api/index.php/appnexus/traffic/?c=hello';
                
                gui.app.getParameterByName('c').should.equal('hello');
                
            });
        });

    });

})();
