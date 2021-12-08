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
          alert("Review added Suceessfully");
          window.location.reload();
        },
        error: function (xhr, textStatus, error) {
          alert("Login to Add review");
          window.location.href = "/login";
        },
      });
    }
    else{
      alert("FILL ALL REQUIRED DETAILS TO POST REVIEW");
    }
  });
})(window.jQuery);
