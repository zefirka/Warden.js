describe('Warden initializaion', function () {  
    it('Warden is loaded', function () {      
        expect(Warden).not.toBe(undefined);  
    });  

    it('Warden versioning is ready', function () {      
        expect(typeof Warden.version).toBe("string");  
    });  

    // it('Warden.module is ready', function () {      
    //     expect(Warden.module).not.toBe(undefined);  
    //     expect(typeof Warden.module).toBe('function');
    // });  
});  

