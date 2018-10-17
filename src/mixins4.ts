let MyMixin = (superclass) => class Test extends superclass {
	static TEST = 'test';
};

class MyClass extends MyMixin(Object) {

}