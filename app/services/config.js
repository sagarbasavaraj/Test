/**
 * Module to hold default configuration for app.
 * 
 * @module config

 */
define(function(){
	
	var configData;
	
	return{
		setData:setData,
		getData:getData
	};
	
	function setData(data){
		configData = data;
	}
	
	function getData(){
		return configData;
	}

});