

(function ($) {
  const form = $("#addreview");
  form.submit(function (event) {
    let ratingInput = $("#rating");
    let reviewTitleInput = $("#title");
    let reviewBodyInput = $("#reviewBody");
    event.preventDefault();
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
        alert("Login to Add review, fILL ALL DETAILS, Failed to Add");
      },
    });
  });
  //add comment input tag for a review
  $(".comment-btn").click(function(e) {
    e.preventDefault();
    $(".comment-group").remove();
    $(this).parent().parent().parent().parent().find("div.card-header").after("\
    <div class='form-group comment-group'><label class='col-md-3 control-label' for='comment'>Your Comment</label>\
      <div class='col-md-9'>\
          <textarea class='form-control' name='commentBody' placeholder='Please enter your comment here...' rows='3'></textarea>\
      </div>\
      <div class='form-group'>\
          <div class='col-md-12 text-center'>\
            <button type='button' class='float-right btn btn-primary btn-md comment-submit'>Submit</button>\
          </div>\
      </div>\
    </div>");
  });
  // submit comment for a review 
  $(".card-body").on("click",".comment-submit",function(e) {
    e.preventDefault();
    let commentBody = $(this).parent().parent().parent().find("textarea.form-control").val();
    if(commentBody==""){
      alert("comment cant not be null")
      return;
    }
    let reviewId = $(this).parent().parent().parent().parent().parent().find("input.review-id").val();
    if(reviewId==""){
      alert("something is wrong!")
      return;
    }
    $.ajax({
      type: "POST",
      url: "/reviews/comment/"+reviewId,
      contentType: "application/json",
      data: JSON.stringify({
        commentBody: commentBody,
      }),
      success: function (data) {
        alert("comment added Suceessfully");
        window.location.reload();
      },
      error: function (xhr, textStatus, error) {
        alert("Login to Add Review, FILL ALL DETAILS, Failed to Add");
        console.log(error)
      },
    });
  });
  $(".like-btn").click(function(e) {
    e.preventDefault();
    let reviewId = $(this).parent().parent().parent().parent().find("input.review-id").val();
    $.ajax({
      type: "PUT",
      url: "/reviews/likes/"+reviewId,
      contentType: "application/json",
      data: JSON.stringify({
      }),
      success: function (data) {
        alert("review like Suceessfully");
        // window.location.reload();
      },
      error: function (xhr, textStatus, error) {
        alert("Login to Add Review, FILL ALL DETAILS, Failed to Add");
        console.log(error)
      },
    });


  });


  
})(window.jQuery);
