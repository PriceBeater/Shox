var basic= function() {
  var _lessthan=function(threshold,input){
    if(input<=threshold)
      return true;
    return false;
  }

	return {
		LT : _lessthan 
	};

}();
module.exports = basic;

