

(function ($) {
  
  $.ajax({
    type: "GET",
    url: "admin/requests",
    success: function (data) {
      var requestList = $('#requestFrom')
      console.log(JSON.stringify(data));
      //alert("Successfully deleted", JSON.stringify(data));
      // window.location.reload();
      for (r of data.reqProd) {
        showRequest(requestList, r)
      }
      
      
    },
    error: function (xhr, textStatus, error) {
      alert("Error " + error);
    },
  });

const form = $("#deleteProductForm");

form.submit(function (event) {
  const productIdInput = $("#productId");
  event.preventDefault();
  pid = productIdInput.val();
  console.log("form submit method")
  $.ajax({
    type: "POST",
    url: "admin/delete",
    contentType: "application/json",
    data: JSON.stringify({
      productId: pid,
    }),
    success: function (data) {
      console.log(data);
      alert("Successfully deleted", JSON.stringify(data));
      // window.location.reload();
    },
    error: function (xhr, textStatus, error) {
      alert("Failed to delete product", error);
    },
  });
});


function showRequest(requestList, request){
  requestProperties = document.createElement("dl");
  requestPropertiesInnerHtml = "<br><dt>Product Name</dt>";
  
  //<dd>" + (request.productName == null ? 'N/A':request.productName)+ "</dd>";
  if(request.productName == null || request.productName.length == 0 ||request.brand == null || request.brand.length == 0 ){
    requestPropertiesInnerHtml += "<ul>N/A</ul>";
  }
  else{
    requestPropertiesInnerHtml += '<ul>' + request.productName + '</ul>';
  }

  requestPropertiesInnerHtml += "<dt>Brand</dt>";
  if (request.brand == null || request.brand.length == 0 ){
    requestPropertiesInnerHtml += "<ul>N/A</ul>";
  }
  else{
    requestPropertiesInnerHtml += '<ul>' + request.brand + '</ul>';
  }
  for (var element of $.parseHTML(requestPropertiesInnerHtml)) {
    requestProperties.append(element);
  }
  requestList.append(requestProperties);
}

}) (window.jQuery);
