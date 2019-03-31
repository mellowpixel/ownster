
RegExpTest = function(){
	
	this.email_test	= function(email){
		var reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		
		if(reg.test(email)){
			return true;
		} else {
			return false;
		}
	}
	
	this.name_test = function(name){
		var reg = /[^a-zA-Z -]/;
		
		if(reg.test(name)){
			return false;
		} else {
			if(name.length > 0){
				return true;
			} else {
				return false;
			}
		}	
	}
	
	this.password_test = function(password){
		var reg = /.{6,}/;
		
		if(reg.test(password)){
			return true;
		} else {
			return false;
		}	
	}
	
	this.address_test = function(address){
		var reg = /[^\w.,\s()]/;
		
		if(reg.test(address)){
			return false;
		} else {
			if(address.length > 0){
				return true;
			} else {
				return false;
			}
		}
	}
}