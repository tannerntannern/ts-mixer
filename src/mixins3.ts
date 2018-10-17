type Constructor<T> = {new(...args: any[]): T};

type Merge<Obj1, Obj2> = {[K in keyof Obj1]: Obj1[K]} & {[K in keyof Obj2]: Obj2[K]};
function mergeStatics<C1, C2>(class1: C1, class2: C2): Merge<C1, C2> {
	return Object.assign({}, class1, class2);
}

function Mix<C1, C2>(ctor1: Constructor<C1>, ctor2: Constructor<C2>): Merge<Constructor<C1>, Constructor<C2>> & Constructor<C1 & C2> {
	// Mix constructors
	function MixedClass(...args) {
		ctor1.apply(this, args);
		ctor2.apply(this, args);
	}

	// Mix prototypes
	MixedClass.prototype = Object.assign({}, ctor1.prototype, ctor2.prototype);

	// Mix static variables
	Object.assign(MixedClass, ctor1, ctor2);

	return <any> MixedClass;
}

class CanRun {
	static TEST = 'test';
	run() { console.log('Run, run, run... ') }
}

class CanJump {
	jump() { console.log('JUMP!') }
}

class LongJumper extends (<Constructor<CanJump & CanRun>> Mix(CanRun, CanJump)) {}

let lj = new LongJumper();
lj.jump();














