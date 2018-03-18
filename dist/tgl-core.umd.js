(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    var MyModule = /** @class */ (function () {
        function MyModule() {
            this.value = 'a';
        }
        return MyModule;
    }());

    var obj = new MyModule();
    console.log(obj.value);

})));
