(function ($) {
  const a = $("#btn-whishlist");
  a.on("click", function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: this.href,
      data: {},
      success: function (data) {
        $("#wishsucc").text("Added to WishList");
        //alert("Added to wishlist");
      },
      error: function (error) {
        $("#wisherr").text(JSON.parse(error.responseText).error);
      },
    });
  });
})(window.jQuery);
