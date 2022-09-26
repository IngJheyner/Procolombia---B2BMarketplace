/**
 * @file
 * Global utilities.
 *
 */







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
    window.location.href = "/dashboard"
  }
  function goToDashboardAsesorCol() {
    window.location.href = "/dashboard/adviser/user/col"
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

  // toggle password to text
  function passwordToText() {
    $("#password").attr("type", "text");
    $("#pass_show").hide();
    $("#pass_bloq").show();
  }

  // toggle password to text
  function textToPassword() {
    $("#password").attr("type", "password");
    $("#pass_show").show();
    $("#pass_bloq").hide();
  }

  // toggle password to text
  function passwordToTextForgot() {
    $("#password_forgot").attr("type", "text");
    $("#pass_show_2").hide();
    $("#pass_bloq_2").show();
  }

  // toggle password to text
  function textToPasswordForgot() {
    $("#password_forgot").attr("type", "password");
    $("#pass_show_2").show();
    $("#pass_bloq_2").hide();
  }


  // check if is valid email
  const isEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
      $(".username_container").css("border-color", "#ba0c2f");
      $("#error_username").show();
      $("#error_username_message").text(message)
      isValid = false;
    } else {
      $('#error_username').tooltip('hide')
      $("#error_username").hide();
      $(".username_container").css("border-color", "#cccccc");
    }

    if (password == "") {
      message = Drupal.t("Password is required.");
      $(".password_container").css("border-color", "#ba0c2f");
      $("#error_password").show();
      $("#error_password_message").text(message)
      isValid = false;
    } else {
      $('#error_password').tooltip('hide')
      $("#error_password").hide();
      $(".password_container").css("border-color", "#cccccc");
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
        .then((response) => response.json())
        .then((data) => {
          if (data.role) {
            //redirect based in role
            console.log(data);
            let url = "";
            if (data.role == "adminstrator") {
              url = "/";
            } else {
              if (data.role == "exportador") {
                url = "/dashboard";
              } else if (data.role == "buyer") {
                url = "/dashboard/international/user";
              } else {
                if (data.role == "asesor_comercial") {
                  url = "/dashboard/adviser/user/col";
                } else {
                  if (data.role == "asesor_internacional") {
                    url = "/dashboard/adviser/user/international";
                  } else {
                    url = "/";
                  }
                }
              }
            }
            fetch("auth/userLoginFinalize", {
              method: "POST",
              body: formData,
            }).then((response) => {
              console.log(response);
              if (response.url) {
                window.location.href = url;
              }
              else {
                //error
                $("#loading").hide();
                $("#login_button").show();
                $("#error_login").show();
                $("#error_login_message").text(Drupal.t("Error login"));
              }
            });
          } else {
            //hide loading
            $("#loading").hide();
            //show login button
            $("#login_button").show();
            $("#error_username_alert").show();
            //change style display to flex
            $("#conteedor").css("display", "flex");

            //aca
            $("#error_username_alert").text(data.error);
          }
        }).catch((error) => {
          //hide loading
          $("#loading").hide();
          //show login button
          $("#login_button").show();
          //show error message
          $("#conteedor").css("display", "flex");
          $("#error_username_alert").show();
          $("#error_username_alert").text(error);
        }
        );
    }
  }

  /*
  * Open Modal forgot email
  */
  function openModalForgotEmail() {
    $("#login_modal").modal('hide');
    $("#forgot_email_modal").modal('show');
  }

  /*
  * Open Modal forgot password
  */
  function openModalForgotPassword() {
    $("#login_modal").modal('hide');
    $("#forgot_password_modal").modal('show');
  }

  /*
  * Open Login Modal
  */
  function openModalLogin() {
    $("#forgot_email_modal").modal('hide');
    $("#forgot_password_modal").modal('hide');
    $("#verification_code").modal('hide');
    $("check_information").modal('hide');
    $("#check_information_2").modal('hide');
    $("#check_information_3").modal('hide');
    $("#login_modal").modal('show');
  }

  /*
  * Validate forgot email form
  */
  function validateForgotEmailForm() {
    var nit = $("#nit").val();
    var message = "";
    var isValid = true;
    if (nit == "" || isNaN(nit) || nit.length > 12) {
      message = Drupal.t("The NIT is required and must have less than 12 digits");
      $(".nit_container").css("border-color", "#ba0c2f");
      $("#error_nit").show();
      $("#error_nit_message").text(message)
      $('#error_nit').attr('data-bs-original-title', "Foo").tooltip('show');
      isValid = false;
    } else {
      $("#error_nit").hide();
      $(".nit_container").css("border-color", "#cccccc");
    }

    //validate captcha getResponse and if is empty show error
    var response = grecaptcha.getResponse();
    console.log(response);
    console.log("HI")
    if (response.length == 0) {
      alert("Please verify that you are not a robot");
      $("#error_captcha").show();
      isValid = false;
    } else {
      $("#error_captcha").hide();
    }

    return isValid;
  }


  /*
  * Get Email by Nit
  */
  function getEmailByNit() {
    if (validateForgotEmailForm()) {
      let message = "";
      var nit = $("#nit").val();
      var data = {
        "username": nit,
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      // show loading
      $("#loading_forgot_email").show();
      //hide login button
      $("#nit_button").hide();

      //fecth post auth/get/email
      fetch("/auth/get/email", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            //put * in the third part of the email before the @
            var email = data.email;
            var email_parts = email.split("@");
            var email_parts_1 = email_parts[0];
            //get length of email_parts_1
            var length_email_parts_1 = email_parts_1.length / 3;
            //replace last length_email_parts_1 characters with *
            var email_parts_1 = email_parts_1.substring(0, email_parts_1.length - length_email_parts_1);
            for (var i = 0; i < length_email_parts_1; i++) {
              email_parts_1 += "*";
            }
            email = email_parts_1 + "@" + email_parts[1];
            $("#forgot_email").text(email);
            $("#loading_forgot_email").hide();
            $("#nit_button").show();
            //show modal recovery email
            $("#forgot_email_modal").modal('hide');
            $("#verification_code").modal('show');
            $("#error_nit").hide();
            $(".nit_container").css("border-color", "#cccccc");
            //show check_information after 5 seconds
            setTimeout(function () {
              //hide verification_code
              $("#verification_code").modal('hide');
              $("#check_information").modal('show');
            }, 10000);
          } else {
            //hide loading
            message = Drupal.t("The NIT not found");
            $(".nit_container").css("border-color", "#ba0c2f");
            $("#error_nit").show();
            $("#error_nit_message").text(message)
            $("#loading_forgot_email").hide();
            $("#nit_button").show();
          }
        }).catch((error) => {
          //hide loading
          message = Drupal.t("The NIT not found");
          $(".nit_container").css("border-color", "#ba0c2f");
          $("#error_nit").show();
          $("#error_nit_message").text(message)
          $("#loading_forgot_email").hide();
          $("#nit_button").show();
        }
        );
    }
  }

  /*
  * Validate forgot password form
  */
  function validateForgotPasswordForm() {
    var email_forgot = $("#email_forgot").val();
    var message = "";
    var isValid = true;
    if (email_forgot == "") {
      message = Drupal.t("E-mail is required");
      $("#email_forgot_container").css("border-color", "#ba0c2f");
      $("#error_email_forgot").show();
      $("#error_email_forgot_message").text(message)
      $('#error_email_forgot').attr('data-bs-original-title', "Foo").tooltip('show');
      isValid = false;
    } else {
      if (!isEmail(email_forgot)) {
        message = Drupal.t("E-mail is not valid");
        $("#email_forgot_container").css("border-color", "#ba0c2f");
        $("#error_email_forgot").show();
        $("#error_email_forgot_message").text(message)
        isValid = false;
      } else {
        $("#error_email_forgot").hide();
        $("#email_forgot_container").css("border-color", "#cccccc");
      }
    }
    return isValid;
  }

  /*
  * recover password
  */
  function recoverPassword() {
    if (validateForgotPasswordForm()) {
      var email_forgot = $("#email_forgot").val();
      var data = {
        "username": email_forgot,
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      // show loading
      $("#loading_forgot_password").show();
      //hide login button
      $("#password_forgot_button").hide();

      //fecth auth/recover/password
      fetch("/auth/recover/password", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            //hide loading
            $("#loading_forgot_password").hide();
            //show login button
            $("#password_forgot_button").show();
            //show modal recovery email
            $("#forgot_password_modal").modal('hide');
            $("#check_information_2").modal('show');
          } else {
            //hide loading
            $("#loading_forgot_password").hide();
            //show login button
            $("#password_forgot_button").show();
            //show error message
            $("#error_message").show();
            $("#error_message").text(data.error);
          }
        }).catch((error) => {
          //hide loading
          $("#loading_forgot_password").hide();
          //show login button
          $("#password_forgot_button").show();
          //show error message
          $("#error_message").show();
          $("#error_message").text(error);
        }
        );
    }
  }

  /*
  * Validate change passowrd form
  */

  function validateChangePasswordForm() {
    var password_forgot = $("#password_forgot").val();

    var message = "";
    var isValid = true;
    if (password_forgot == "") {
      message = "El password es requerido";
      $("#password_forgot").css("border-color", "#ba0c2f");
      $("#error_password_forgot_message").text(message)
      $("#error_password_forgot").show();
      isValid = false;
    } else {
      if (password_forgot.length < 8 && password_forgot.length > 15) {
        message = "El password debe tener entre 8 y 15 caracteres";
        $("#password_forgot").css("border-color", "#ba0c2f");
        $("#error_password_forgot_message").text(message)
        $("#error_password_forgot").show();
        isValid = false;
      } else {
        if (!password_forgot.match(/[A-Z]/)) {
          message = "El password debe tener al menos una mayúscula";
          $("#password_forgot").css("border-color", "#ba0c2f");
          $("#error_password_forgot_message").text(message)
          $("#error_password_forgot").show();
          isValid = false;
        } else {
          if (!password_forgot.match(/[0-9]/)) {
            message = "El password debe tener al menos un número";
            $("#password_forgot").css("border-color", "#ba0c2f");
            $("#error_password_forgot_message").text(message)
            $("#error_password_forgot").show();
            $("#error_password_forgot")

              ;
            isValid = false;
          } else {
            if (!password_forgot.match(/[^a-zA-Z0-9]/)) {
              message =
                "El password debe tener al menos un caracter especial";
              $("#password_forgot").css("border-color", "#ba0c2f");
              $("#error_password_forgot_message").text(message)
              $("#error_password_forgot").show();
              $("#error_password_forgot")

                ;
              isValid = false;
            } else {
              $("#error_password_forgot").hide();
              $("#password_forgot").css("border-color", "#cccccc");
            }
          }
        }
      }
    }
    return isValid;
  }

  /*
  * Change password
  */
  function changePassword() {
    if (validateChangePasswordForm()) {
      var password_forgot = $("#password_forgot").val();
      var urlParams = new URLSearchParams(window.location.search);
      var email = urlParams.get('email');
      var time = urlParams.get('time');
      var token = urlParams.get('token');
      var data = {
        "password": password_forgot,
        "email": email,
        "timestamp": time,
        "hash": token,
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      // show loading
      $("#loading_change_password").show();
      //hide login button
      $("#change_password_button").hide();

      //fecth auth/change/password
      fetch("/auth/change/password", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            //hide loading
            $("#loading_change_password").hide();
            //show login button
            $("#change_password_button").show();
            //show modal recovery email
            $("#modal_recover_password").modal('hide');
            $("#check_information_3").modal('show');
            //clean query params
            window.history.replaceState({}, document.title, "/" + "");
          } else {
            //hide loading
            $("#loading_change_password").hide();
            //show login button
            $("#change_password_button").show();
            //show error message
            $("#error_message").show();
            $("#error_message").text(data.error);
          }
        }).catch((error) => {
          //hide loading
          $("#loading_change_password").hide();
          //show login button
          $("#change_password_button").show();
          //show error message
          $("#error_message").show();
          $("#error_message").text(error);
        });
    }
  }

  Drupal.behaviors.custom = {
    attach: function (context, settings) {

      //call function login and validate form
      $("#login_modal #username", context).keypress(function (event) {
        if (event.keyCode == 13) {
          login_drupal();
        }
      });
      //call function login and validate form
      $("#login_modal #password", context).keypress(function (event) {
        if (event.keyCode == 13) {
          login_drupal();
        }
      });

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
        //goToDashboardCompanyCol();
      });
      //call function edit profile asesor
      $("#img_click_asesor", context).click(function () {
        goToDashboardAsesorCol();
      });

      //call function edit buyer
      $("#edit_buyer", context).click(function () {
        goToEditBuyer();
      });

      //add css when click menu_user
      $("#menu_user", context).click(function () {
        //toggle style css
        $("#menu_drop").toggleClass("activ_menu");
      });
      //add css when click drop_menu
      $("#drop_menu", context).click(function () {
        //toggle style css
        $("#lenguaje").toggleClass("active_dropdown");
      });
      $("#drop_menu_movile", context).click(function () {
        //toggle style css
        $("#lenguaje").toggleClass("active_dropdown");
      });

      //if click outside menu_user, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#menu_drop").length === 0 && $(e.target).closest("#menu_user").length === 0) {
          //delay to remove css
          setTimeout(function () {
            $("#menu_drop").removeClass("activ_menu");
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
        var url = window.location.pathname + window.location.search;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          //save in session storage
          document.cookie = "language=en;path=/;";
          window.location.href = url.replace("/es", "/en");
        } else {
          document.cookie = "language=es;path=/;";
          window.location.href = url.replace("/en", "/es");
        }
      });

      //call function passwordToText
      $("#pass_show", context).click(function () {
        passwordToText();
      });
      //call function textToPassword
      $("#pass_bloq", context).click(function () {
        textToPassword();
      });

      //call function passwordToText
      $("#pass_show_2", context).click(function () {
        passwordToTextForgot();
      });
      //call function textToPassword
      $("#pass_bloq_2", context).click(function () {
        textToPasswordForgot();
      });

      //login form
      $("#login_button", context).click(function () {
        login_drupal();
      });

      //forgot email
      $("#forgot_email_button", context).click(function () {
        openModalForgotEmail();
      });

      //forgot password
      $("#forgot_password_button", context).click(function () {
        openModalForgotPassword();
      });

      //login modal
      $("#login_modal_button_1", context).click(function () {
        openModalLogin();
      });
      $("#login_modal_button_2", context).click(function () {
        openModalLogin();
      });
      $("#login_modal_button_3", context).click(function () {
        openModalLogin();
      });
      $("#login_modal_button_4", context).click(function () {
        openModalLogin();
      });
      $("#login_modal_button_5", context).click(function () {
        openModalLogin();
      });
      $("#login_modal_button_6", context).click(function () {
        openModalLogin();
      });

      //get email by nit
      $("#nit_button", context).click(function () {
        getEmailByNit();
      });
      //get email by nit
      $("#forgot_email_modal #nit", context).keypress(function (event) {
        if (event.keyCode == 13) {
          getEmailByNit();
        };
      });

      //recover password
      $("#password_forgot_button", context).click(function () {
        recoverPassword();
      });

      //recover password
      $("#forgot_password_modal #email_forgot", context).keypress(function (event) {
        if (event.keyCode == 13) {
          recoverPassword();
        };
      });

      //change password
      $("#change_password_button", context).click(function () {
        changePassword();
      });

      //toggle dashboard
      $("#button_dashboard_exportador", context).click(function () {
        showDashboardExportador();
      });

      //toggle dashboard
      $("#button_dashboard_buyer", context).click(function () {
        showDashboardBuyer();
      });

      //show menu drop mobile
      $("#show_menu_mobil", context).click(function () {
        //toggle style css
        $("#menu_drop_mobil").toggleClass("activ_menu");
      });
      //show menu drop mobile
      $("#show_menu_login", context).click(function () {
        //toggle style css
        $("#menu_drop_login").toggleClass("activ_menu");
      });

      if (context === document) {
        //check if query params has email, time and token
        var urlParams = new URLSearchParams(window.location.search);
        var email = urlParams.get('email');
        var time = urlParams.get('time');
        var token = urlParams.get('token');
        if (email && time && token) {
          //show modal recover password
          $("#modal_recover_password").modal("show");
        }
      }

      //buttons international
      //edit button mobile international
      $("#edit_button_mobile_international", context).click(function () {
        //redirect
        window.location.href = "/edit/international/user";
      });

      //change language button
      $("#change_language_button", context).click(function () {
        //change display
        $("#change_language_button").css("display", "none");
      });

      //buttons exportador
      //edit button mobile exportador
      $("#edit_button_mobile_exportador", context).click(function () {
        //redirect
        window.location.href = "/edit/col/user";
      });

      //change language button
      $("#change_language_button_exportador", context).click(function () {
        //change display
        //check if style display is none
        if ($("#change_language_content_exportador").css("display") == "none") {
          $("#change_language_content_exportador").css("display", "block");
          $("#change_language_content_exportador").css("min-width", "100%");
        } else {
          $("#change_language_content_exportador").css("display", "none");
          $("#change_language_content_exportador").css("min-width", "0");
        }
      });

      //change languages base in path url
      $("#change_language_exportador", context).click(function () {
        var url = window.location.pathname + window.location.search;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          //save in session storage
          document.cookie = "language=en;path=/;";
          window.location.href = url.replace("es", "en");
        } else {
          document.cookie = "language=es;path=/;";
          window.location.href = url.replace("en", "es");
        }
      });

      //buttons asesor_comercial
      //edit button mobile asesor_comercial
     //change language button
      $("#change_language_button_asesor_comercial", context).click(function () {
        //change display
        //check if style display is none
        if ($("#change_language_content_asesor_comercial").css("display") == "none") {
          $("#change_language_content_asesor_comercial").css("display", "block");
          $("#change_language_content_asesor_comercial").css("min-width", "100%");
        } else {
          $("#change_language_content_asesor_comercial").css("display", "none");
          $("#change_language_content_asesor_comercial").css("min-width", "0");
        }
      });
      
      //change languages base in path url
      $("#change_language_asesor_comercial", context).click(function () {
        var url = window.location.pathname + window.location.search;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          //save in session storage
          document.cookie = "language=en;path=/;";
          window.location.href = url.replace("es", "en");
        } else {
          document.cookie = "language=es;path=/;";
          window.location.href = url.replace("en", "es");
        }
      });

      //buttons asesor_internacional
      //edit button mobile asesor_internacional
      $("#edit_button_mobile_asesor_internacional", context).click(function () {
        //redirect
        window.location.href = "/edit/international/user";
      });

      //change language button
      $("#change_language_button_asesor_internacional", context).click(function () {
        //change display
        //check if style display is none
        if ($("#change_language_content_asesor_internacional").css("display") == "none") {
          $("#change_language_content_asesor_internacional").css("display", "block");
          $("#change_language_content_asesor_internacional").css("min-width", "100%");
        } else {
          $("#change_language_content_asesor_internacional").css("display", "none");
          $("#change_language_content_asesor_internacional").css("min-width", "0");
        }
      });
      //change languages base in path url
      $("#change_language_asesor_internacional", context).click(function () {
        var url = window.location.pathname + window.location.search;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          //save in session storage
          document.cookie = "language=en;path=/;";
          window.location.href = url.replace("es", "en");
        } else {
          document.cookie = "language=es;path=/;";
          window.location.href = url.replace("en", "es");
        }
      });

      //change language button
      $("#change_language_button_main", context).click(function () {
        //change display
        //check if style display is none
        if ($("#change_language_content_main").css("display") == "none") {
          $("#change_language_content_main").css("display", "block");
          $("#change_language_content_main").css("min-width", "100%");
        } else {
          $("#change_language_content_main").css("display", "none");
          $("#change_language_content_main").css("min-width", "0");
        }
      });
      //change languages base in path url
      $("#change_language_main", context).click(function () {
        var url = window.location.pathname + window.location.search;
        console.log(url);
        var url_split = url.split("/");
        var language = url_split[1];
        console.log(language);
        if (language == "es") {
          //save in session storage
          document.cookie = "language=en;path=/;";
          window.location.href = url.replace("es", "en");
        } else {
          document.cookie = "language=es;path=/;";
          window.location.href = url.replace("en", "es");
        }
      });

      //change language button
      $("#change_language_button", context).click(function () {
        //change display
        $("#change_language_button").css("display", "none");
      });
      
      
    }
  };
})(jQuery, Drupal);