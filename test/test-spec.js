describe('by model', function() {
   it('should find an element by text input model', function() {
     var username = element(by.model('username'));
     var name = element(by.binding('username'));
	 var password = element(by.model('password1'));
     var pass = element(by.binding('password1'));
	 var isRegister = element(by.model('isRegister'));
     var isReg = element(by.binding('isRegister'));
	 
	 var eventListName = element(by.model('eventFilter.eventTitle'));
	 var AddEventTitle = element(by.model('newEvent.eventTitle'));

     username.clear();
     expect(name.getText()).toEqual('');
	 password.clear();
     expect(pass.getText()).toEqual('');

	 
     username.sendKeys('santiago.tambasco@gmail.com');
     expect(name.getText()).toEqual('santiago.tambasco@gmail.com');
     password.sendKeys('cometoeat12345');
     expect(pass.getText()).toEqual('cometoeat12345');   
	 
	 element( by.id('login()') ).click();
	 
	 expect(isReg.getText()).toEqual('true');
	 
	 element( by.id('eventList') ).click();
	 
	 expect(eventListName.getText()).toEqual('');
	 
	 element( by.id('addEvent') ).click();
	 
	 expect(AddEventTitle.getText()).toEqual('');
	 
	 element( by.id('about') ).click();
	 
	 
	  
   });
});
