(function ($) {
  $("#form-user-edit").submit(function (event) {
    event.preventDefault();
    const updateUser = {
      userName: $("#userName").val(),
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      password: $("#password").val(),
      email: $("#email").val(),
      makeupLevel: $("#makeupLevel").val(),
      userImage: $("#img").data("user"),
    };

    if ($("#imageUpload")[0].files.length == 0) {
      $.ajax({
        type: "POST",
        url: "/users/profile",
        data: updateUser,
        success: function (response) {
          $("#profile-edit-success").text("Profile Updated Successfully");
          window.setTimeout(function(){location.reload()},1800)
        },
        error: function (error) {
          var jsonObj = JSON.parse(error.responseText);
          $("#profile-edit-error").text( jsonObj.error);
          // alert(error.responseText);
        },
      });
    } else {
      var formData = new FormData();
      formData.append("image", $("#imageUpload")[0].files[0]);
      $.ajax({
        type: "POST",
        url: "/uploadSingle",
        contentType: false,
        data: formData,
        processData: false,
        success: function (path) {
          updateUser.userImage = path;
          $.ajax({
            type: "POST",
            url: "/users/profile",
            data: updateUser,
            success: function (response) {
              $("#profile-edit-success").text("Profile Updated Successfully");
              window.setTimeout(function(){location.href = "/users"},1800)
             
            },
            error: function (error) {
              var jsonObj = JSON.parse(error.responseText);
              $("#profile-edit-error").text( jsonObj.error);
              // alert(error.responseText);
            },
          });
        },
        error: function (error) {
          var jsonObj = JSON.parse(error.responseText);
          $("#profile-edit-error").text( jsonObj.error);
          // alert(error.responseText);
        },
      });
    }
  });

  $("#form-user-new").submit(function (event) {
    event.preventDefault();
    const updateUser = {
      userName: $("#userName").val(),
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      password: $("#password").val(),
      email: $("#email").val(),
      makeupLevel: $("#makeupLevel").val(),
    };

    if ($("#imageUpload")[0].files.length == 0) {
      $.ajax({
        type: "POST",
        url: "/users/signup",
        data: updateUser,
        success: function (response) {
          window.location.reload();
        },
        error: function (error) {
          var jsonObj = JSON.parse(error.responseText);
          $("#adduser-error").text( jsonObj.error);
          // alert(error.responseText);
        },
      });
    } else {
      var formData = new FormData();
      formData.append("image", $("#imageUpload")[0].files[0]);
      $.ajax({
        type: "POST",
        url: "/uploadSingle",
        contentType: false,
        data: formData,
        processData: false,
        success: function (path) {
          updateUser.userImage = path;
          $.ajax({
            type: "POST",
            url: "/users/signup",
            data: updateUser,
            success: function (response) {
              window.location.href = "/users";
            },
            error: function (error) {
              var jsonObj = JSON.parse(error.responseText);
              $("#adduser-error").text( jsonObj.error);
              // alert(error.responseText);
            },
          });
        },
        error: function (error) {
          var jsonObj = JSON.parse(error.responseText);
          $("#adduser-error").text( jsonObj.error);
          // alert(error.responseText);
        },
      });
    }
  });
})(window.jQuery);
