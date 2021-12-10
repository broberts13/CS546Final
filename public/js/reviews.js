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
  $(".delete-review").click(function(e) {

      var ID = $(this).closest(".review-blog").find(".review-id");
      var reviewId= ID.data("reviewid");
      var likereviewUrl = "/reviews/"+reviewId;	
          
        $.ajax({
            type: 'DELETE',
            url: likereviewUrl,
            data: {},
            success: function (data) {
                  alert("delete successful!");
                  window.location.reload();
            },
              error: function (jqXhr, textStatus, errorMessage) {
              alert("Login to delete review");
              window.location.href = "/login";
            }
        });

  });

})(window.jQuery);
