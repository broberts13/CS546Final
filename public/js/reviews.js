(function ($) {
  const form = $("#addreview");
  form.submit(function (event) {
    let ratingInput = $("#rating");
    let reviewTitleInput = $("#title");
    let reviewBodyInput = $("#reviewBody");
    event.preventDefault();
    if (
      ratingInput.val().trim() &&
      reviewTitleInput.val().trim() &&
      reviewBodyInput.val().trim()
    ) {
      $.ajax({
        type: "POST",
        url: form.attr("action"),
        contentType: "application/json",
        data: JSON.stringify({
          title: reviewTitleInput.val().trim(),
          reviewBody: reviewBodyInput.val().trim(),
          rating: ratingInput.val().trim(),
        }),
        success: function (data) {
          $("#input-error").text("");
          $("#input-success").text(data.success);
          window.setTimeout(function(){location.reload()},2000)
        },
        error: function (error) {
          $("#input-error").text(JSON.parse(error.responseText).error);
        },
      });
    } else {
      $("#input-error").text("Fill All Required Details To Post Review");
    }
  });
  $(".delete-review").click(function (e) {
    var ID = $(this).closest(".review-blog").find(".review-id");
    var reviewId = ID.data("reviewid");
    var likereviewUrl = "/reviews/" + reviewId;

    $.ajax({
      type: "DELETE",
      url: likereviewUrl,
      data: {},
      success: function (data) {
        alert("delete successful!");
        window.location.reload();
      },
      error: function (jqXhr, textStatus, errorMessage) {
        alert("Login to delete review");
        window.location.href = "/login";
      },
    });
  });
})(window.jQuery);
