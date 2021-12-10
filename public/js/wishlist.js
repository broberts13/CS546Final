(function ($) {
  const a = $("#btn-whishlist");
  a.on("click", function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: this.href,
      data: {},
      success: function (data) {
        alert("Added to wishlist");
      },
      error: function (xhr, textStatus, error) {
        alert("To save your product to wishlist, Login first");
        window.location.href = "/login";
      },
    });
  });
 })(window.jQuery);
