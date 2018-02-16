/*
  Custom AJAX made by Mark Jung(2018-02-05)
  parameter : url(string), data(object), callback(function)
  return : null

  * on Success : data will be parsed into JSON object, it will print out original data, and JSON parsed data
                  So the callback function should handle data as JSON.
*/
function customAjax(url,data,callback) {
   $.ajax({
     type: "post",
     url: url,
     data:data,
     success: function(data) {
        // console.log(data); // predefined logic if any
        console.log(JSON.parse(data));
        if(typeof callback == 'function') {
           callback(JSON.parse(data));
        }
     }
  });
}
