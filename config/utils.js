exports.default = {
  subarr: function (arr, start, count) {
  	var ret = [  ];
  	for(var i = start; i != (start + count) % arr.length; i = (i + 1) % arr.length)
  	{
  		ret.push(arr[i]);
  	}
  	return ret;
  }
};
