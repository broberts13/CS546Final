(function ($) {
  $("#createprod").submit(function (event) {
    event.preventDefault();
    var formData = new FormData();
    formData.append("image", $("#imageUpload")[0].files[0]);
    console.log("formData", formData)
    $.ajax({
      type: "POST",
      url: "/uploadSingle",
      contentType: false,
      data: formData,
      processData: false,
      success: function (path) {
        const newProd = {
          productName: $("#productName").val(),
          productLinks: $("#productLinks").val().split(","),
          brand: $("#brand").val(),
          price: $("#price").val(),
          category: $("#category").val(),
          pendingid: $("#pendingid").val(),
          productPicture: path,
        };
        console.log(newProd)
        $.ajax({
          type: "POST",
          url: "/products",
          data: newProd,
          success: function (response) {
            pendingId = $('#pendingid').val();
            if (pendingId) {
              console.log("creating product success, and removing pending item")
              $.ajax({
                type: "POST",
                url: "/admin/deletePending",
                data: {pendingId:pendingId},
                success: function (response) {
                  window.location.href = "/admin";
                  alert("delete pending product success");
                },
                error: function (error) {
                  // alert(error.responseText);
                  var jsonObj = JSON.parse(error.responseText);
                  $("#creat-prod-error").text( jsonObj.error);
                },
              });
            } 
            else {
              window.location.href = "/admin";
            }
            alert("create product success");
          },
          error: function (error) {
            var jsonObj = JSON.parse(error.responseText);
            $("#creat-prod-error").text( jsonObj.error);
            // alert(error.responseText);
          },
        });
      },
      error: function (error) {
        var jsonObj = JSON.parse(error.responseText);
        $("#creat-prod-error").text( jsonObj.error);
        // alert(error.responseText);
      },
    });
  });
})(window.jQuery);
