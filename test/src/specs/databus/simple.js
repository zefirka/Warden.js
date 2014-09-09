it('Simple', function (done) {
	sync.transmit(1);
	expect(value).toBe(1); 
	done();
});