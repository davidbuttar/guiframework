/* global describe, it, assert, $, gui, before, beforeEach, afterEach */

(function () {
    'use strict';

    describe('Routing', function(){
    
        // Make sure we have enough time.
        this.timeout(15000);

        /**
         * Do the test set up
         */
        beforeEach(function(){
            gui.app = gui.framework();
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

        /**
         * Clean up the test.
         * 
         * @param  {Function} done The done callback
         * @return Nothing
         */
        afterEach(function(done){
            if(document.location.hash === ''){
                done();
                return;
            }
            document.location.hash = '';
            gui.app.pageVisible(function(){
                console.log('test done');
                done();
            });
        });

        describe('On page load the hash value should be blank', function(){
            it('should have blank hash value', function(){
                document.location.hash.should.equal('');
            });
        });

        describe('On page load the index should be comp-active', function(){
            it('page with id=index_index should be active', function(){
                assert($('#index_index').hasClass('comp-active'), 'index_index has comp-active class');
            });
        });

        describe('On change hash to #/index/test', function(){

            before(function(done){
                document.location.hash = '/index/test';
                gui.app.pageVisible(function(){
                    done();
                });
            });

            it('page with id=index_test should be the only one active', function(){
                assert(
                    $('#index_test').hasClass('comp-active'),
                    'index_test has comp-active class'
                );
                assert(
                    !$('#index_index').hasClass('comp-active'),
                    'index_index does not have comp-active class'
                );
            });

            /*it('page with id=index_index should not be active', function(){
       
            });*/

        });

        describe('When I click go to test id=index_test should be active', function(){

            before(function(done){
                $('#index_button_link').trigger('click');
                gui.app.pageVisible(function(){
                    done();
                });
            });

            it('page with id=index_test should be active', function(){
                assert($('#index_test').hasClass('comp-active'), 'index_test has comp-active class');
            });

            it('page with id=index_test should hold three boobies', function(){
                assert(
                    $('#index_test').html() === '( . Y . Y . )',
                    'content of index_test is not as tripple boobies'
                );
            });
        });

        describe('When I visit the index button page the whatami is bannana', function(){

            before(function(done){
                document.location.hash = '/index/button';
                gui.app.pageVisible(function(){
                    done();
                });
            });

            it('When on id=index_button the contentn of whatami is bannana', function(){
                assert(
                    $('#whatami').html() === 'bannana',
                    'content of whatami is bannana'
                );
            });
        });

    });

})();
