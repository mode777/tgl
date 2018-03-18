var MyModule = /** @class */ (function () {
    function MyModule() {
        this.value = 'a';
    }
    return MyModule;
}());

var obj = new MyModule();
console.log(obj.value);
