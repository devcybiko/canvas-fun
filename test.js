class ClassWithStaticMethod {
    static staticProperty = 'someValue';
    static staticMethod() {
        return 'static method has been called.';
    }
    static {
        console.log('Class static initialization block called');
    }
}
