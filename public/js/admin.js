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
          productPicture: path,
        };
        $.ajax({
          type: "POST",
          url: "/products", //goes to /admin instead?
          data: newProd,
          success: function (response) {
            window.location.href = "/admin";
            alert("create product success");
          },
          error: function (error) {
            alert(error.responseText);
          },
        });
      },
      error: function (error) {
        alert(error.responseText);
      },
    });
  });
})(window.jQuery);
