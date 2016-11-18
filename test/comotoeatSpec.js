describe('by model', function() {
   it('should find an element by text input model', function() {
   	 browser.get('http://localhost:3000/login');
     var username = element(by.model('username'));
	 var password = element(by.model('password1'));
	 
	 var eventListName = element(by.model('eventFilter.eventTitle'));
	 var AddEventTitle = element(by.model('newEvent.eventTitle'));

     element(by.model('username')).clear();
     expect(element(by.model('username')).getText()).toEqual('');
	 element(by.model('password1')).clear();
     expect(element(by.model('password1')).getText()).toEqual('');

	 
     element(by.model('username')).sendKeys('santiago.tambasco@gmail.com');
     expect(element(by.model('username')).getAttribute('value')).toEqual('santiago.tambasco@gmail.com');
     element(by.model('password1')).sendKeys('1');
     expect(element(by.model('password1')).getAttribute('value')).toEqual('1');
   });
});
