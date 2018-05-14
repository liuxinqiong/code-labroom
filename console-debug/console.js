var car;
var func1 = function () {
    console.group('group');
    console.time('func1');
    console.profile('profileName');
    func2();
    console.timeEnd('func1');
    console.memory;
    console.count('func1 COUNT')
    console.profileEnd('profileName')
    console.assert(false, 'assert test')
    console.groupEnd('group');
}
var func2 = function () {
    func3();
}
var func3 = function () {
    car = new Car();
    car.funcX();
}
var Car = function () {
    this.brand = 'volvo';
    this.color = 'red';
    this.funcX = function () {
        this.funcY();
    }
    this.funcY = function () {
        this.funcZ();
    }
    this.funcZ = function () {
        console.trace('trace car')
    }
}
func1();
func1();