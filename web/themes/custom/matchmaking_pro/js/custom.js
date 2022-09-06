/**
 * @file
 * Global utilities.
 *
 */
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}


(function ($, Drupal) {

  'use strict';

  // function to go to step 3
  function goToLogin() {
    $("#login_modal").modal('show');
  }

  function goToRegister() {
    window.location.href = "/pre-register"
  }

  function goToEditCompanyCol() {
    window.location.href = "/editar/col/usuario"
  }

  function goToDashboardCompanyCol() {
    window.location.href = "/dashboard/col/user"
  }

  function goToEditBuyer() {
    window.location.href = "/edit/international/user"
  }

  function goToDashboardBuyer() {
    window.location.href = "/dashboard/international/user"
  }

  function show_right_menu() {
    var x = document.getElementById("right_menu");
    if (x) {
      if (x.style.display === "none") {
        x.style.display = "block";
        x.style.opacity = "1";
      } else {
        x.style.display = "none";
        x.style.opacity = "0";
      }
    }
  }

  /*
  * Validate login form
  * username is required
  * password is required
  */
  function validateLoginForm() {
    var username = $("#username").val();
    var password = $("#password").val();
    let isValid = true;
    let message = "";

    if (username == "") {
      message = Drupal.t("Username is required.");
      $("#username").css("border-color", "#ba0c2f");
      $("#error_username").show();
      $("#error_username_message").text(message)
      isValid = false;
    } else {
      $('#error_username').tooltip('hide')
      $("#error_username").hide();
      $("#username").css("border-color", "#cccccc");
    }

    if (password == "") {
      message = Drupal.t("Password is required.");
      $("#password").css("border-color", "#ba0c2f");
      $("#error_password").show();
      $("#error_password_message").text(message)
      isValid = false;
    } else {
      $('#error_password').tooltip('hide')
      $("#error_password").hide();
      $("#password").css("border-color", "#cccccc");
    }

    return isValid;
  }

  /*
  * login to drupal
  */
  function login_drupal() {
    if (validateLoginForm()) {
      var username = $("#username").val();
      var password = $("#password").val();

      var data = {
        "username": username,
        "password": password,
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      // show loading
      $("#loading").show();
      //hide login button
      $("#login_button").hide();

      //fecth post auth/login/form
      fetch("/auth/login/form", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status == 200) {
            //hide loading
            //get role
            fetch("/auth/get/role", {
              method: "GET",
            })
              .then((response) => {
                if (response.status == 200) {
                  response.json().then((data) => {
                    if (data.role == "buyer") {
                      window.location.href = "/dashboard/international/user";
                    } else if (data.role == "exportador") {
                      window.location.href = "/dashboard/col/user";
                    } else {
                      window.location.href = "/dashboard/col/user";
                    }
                  });
                } else {
                  $("#loading").hide();
                  $("#login_button").show();
                  $("#error_message").show();
                  $("#error_message").text(Drupal.t("Invalid username or password"));
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            //hide loading
            $("#loading").hide();
            //show login button
            $("#login_button").show();
            //show error message
            $("#error_message").show();
          }
        }).catch((error) => {
          //hide loading
          $("#loading").hide();
          //show login button
          $("#login_button").show();
          //show error message
          $("#error_message").show();
          $("#error_message").text(error);
        }
        );
    }
  }





  Drupal.behaviors.custom = {
    attach: function (context, settings) {
      //call function login
      $("#btn_login", context).click(function () {
        goToLogin();
      });
      //call function register
      $("#btn_register", context).click(function () {
        goToRegister();
      });
      //call function login
      $("#btn_login_2", context).click(function () {
        goToLogin();
      });
      //call function register
      $("#btn_register_2", context).click(function () {
        goToRegister();
      });
      //call function edit profile col
      $("#edit_company_col", context).click(function () {
        goToEditCompanyCol();
      });
      //call function edit profile col
      $("#img_click", context).click(function () {
        goToDashboardCompanyCol();
      });
      //call function edit buyer
      $("#edit_buyer", context).click(function () {
        goToEditBuyer();
      });

      //add css when click menu_user
      $("#menu_user", context).click(function () {
        //toggle style css
        $("#menu_drop").toggleClass("active");
      });
      //add css when click drop_menu
      $("#drop_menu", context).click(function () {
        //toggle style css
        $("#lenguaje").toggleClass("active_dropdown");
      });

      //if click outside menu_user, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#menu_drop").length === 0 && $(e.target).closest("#menu_user").length === 0) {
          //delay to remove css
          setTimeout(function () {
            $("#menu_drop").removeClass("active");
          }, 200);
        }
      });

      //click alert icon
      $("#right_bar", context).click(function () {
        show_right_menu()
      });
      //if click outside right_bar, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#right_menu").length === 0 && $(e.target).closest("#right_bar").length === 0) {
          var x = document.getElementById("right_menu");
          if (x) {
            x.style.display = "none";
            x.style.opacity = "0";
          }
        }
      });

      //change languages base in path url
      $("#change_language", context).click(function () {
        var url = window.location.pathname;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          window.location.href = url.replace("es", "en");
        } else {
          window.location.href = url.replace("en", "es");
        }
      });

      //login form
      $("#login_button", context).click(function () {
        login_drupal();
      });
    }
  };

})(jQuery, Drupal);
