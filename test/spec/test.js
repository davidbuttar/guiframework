/* global describe, it, assert, myName */

(function () {
    'use strict';

    describe('Whats my name', function () {
        describe('This app should know my name', function () {
            it('should think my name is David Buttar', function () {
                assert(myName() === 'David Buttar', 'Was expecting David Buttar');
            });
        });
    });


    describe('Array', function(){
        describe('#indexOf()', function(){
            it('should return -1 when the value is not present', function(){
                [1,2,3].indexOf(5).should.equal(-1);
                [1,2,3].indexOf(0).should.equal(-1);
            });
        });
    });

})();
