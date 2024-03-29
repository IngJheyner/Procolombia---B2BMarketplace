/*
 * Service for Register
 */

// open input file with button
(function ($, Drupal) {
  'use strict';
  //initial config
  var code_mobile_select;
  function init() {

    //check if email is in local storage go to step 2 register/user/buyer
    if (localStorage.getItem('email_buyer')) {
      var urlParams = new URLSearchParams(window.location.search);
      var token = urlParams.get('token');
      //get v_r_k from local storage
      var v_r_k = localStorage.getItem('v_r_k');
      let formData = new FormData();
      formData.append('token', token);
      formData.append('token_encoded', v_r_k);
      if (token) {
        fetch('/mailing/verification/user',
          {
            method: 'POST',
            body: formData
          }
        ).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status == 'ok') {
            $("#success").modal('show');
            setTimeout(function () {
              window.location.href = '/register/user/buyer';
            }, 3000);
          } else {
            console.log(Drupal.t("Token invalid"));

            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t('Unexpected error'));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Token invalid"));
          }
        }).catch(function (error) {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t('Request failed'));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Request failed email"));
        });
      } else {
        window.location.href = '/register/user/buyer';
      }
    }

    const phoneInputField2 = document.querySelector("#country_code_mobile");
    code_mobile_select = window.intlTelInput(phoneInputField2, {
      initialCountry: "co",
      separateDialCode: true,
    });

    new TomSelect('#langcode', {
      create: false,
      // use method disable()
      render: {
        option: function (data, escape) {
          return `<div><img class="me-2 img-l" src="https://asesoftwaredevserver.evolutecc.com/sites/default/files/matchmaking/images/internal/Icono-Menu-Idioma-color.svg">${data.text}</div>`;
        },
        item: function (item, escape) {
          return `<div><img class="me-2 img-l" src="https://asesoftwaredevserver.evolutecc.com/sites/default/files/matchmaking/images/internal/Icono-Menu-Idioma-color.svg">${item.text}</div>`;
        }
      },
    })
  }

  const isEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isNumber = (number) => {
    return String(number)
      .toLowerCase()
      .match(
        /^[0-9]+$/
      );
  }

  // toggle password to text
  function passwordToText() {
    $("#password_buyer").attr("type", "text");
    $("#confirm_password_buyer").attr("type", "text");
    $("#pass_show_buyer").hide();
    $("#pass_show_buyer_confirm").hide();
    $("#pass_bloq_buyer").show();
    $("#pass_bloq_buyer_confirm").show();
  }

  // toggle password to text
  function textToPassword() {
    $("#password_buyer").attr("type", "password");
    $("#confirm_password_buyer").attr("type", "password");
    $("#pass_show_buyer").show();
    $("#pass_show_buyer_confirm").show();
    $("#pass_bloq_buyer").hide();
    $("#pass_bloq_buyer_confirm").hide();
  }

  // progress bar
  function valueProgressBar() {
    var password = $("#password_buyer").val();
    let progress = 0;
    if (password.length >= 8) {
      progress += 25;
    }
    if (password.match(/[A-Z]/)) {
      progress += 25;
    }
    if (password.match(/[0-9]/)) {
      progress += 25;
    }
    if (password.match(/[^a-zA-Z0-9]/)) {
      progress += 25;
    }

    if (progress === 25) {
      $("#progressbar").css("background", "#ba0c2f");
      $("#error_mensaje_pass").text(Drupal.t("Weak"));
    } else {
      if (progress === 50) {
        $("#progressbar").css("background", "#fdca00");
        $("#error_mensaje_pass").text(Drupal.t("Normal"));
      } else {
        if (progress === 75) {
          $("#progressbar").css("background", "#0085ca");
          $("#error_mensaje_pass").text(Drupal.t("Good"));
        } else {
          if (progress === 100) {
            $("#error_mensaje_pass").text(Drupal.t("Strong"));
            $("#progressbar").css("background", "#31d394");
          }
        }
      }
    }
    $("#progressbar").css("width", progress + "%");
  }

  /*
   *  Validate Form 1
   *  - name is requerid and have max length of 20
   *  - last_name is requerid and have max length of 20
   *  - email is requerid and is email
   *  - cellphone is optional and is number
   *  - business_name is requerid and have max length of 100
   *  - password is required and more than 8 and have capital letter and number and special character
   *  - confirm_password_buyer is required and equal password
   *  - langcode is requerid
   *  - policy is true
   *  - conditions is true
   */

  function validateForm1() {
    var name = $("#name").val();
    var last_name = $("#last_name").val();
    var email = $("#email").val();
    var cellphone = $("#cellphone").val();
    var business_name = $("#business_name").val();
    var password = $("#password_buyer").val();
    var confirm_password_buyer = $("#confirm_password_buyer").val();
    var langcode = $("#langcode").val();
    var policy = $("#policy").is(":checked");
    var conditions = $("#conditions").is(":checked");

    var message = "";
    var isValid = true;

    if (name === "") {
      message = Drupal.t("Name is required");
      $("#name").css("border-color", "#ba0c2f");
      $("#error_name").show();
      $("#error_name_message").text(message)
      isValid = false;
    } else {
      if (name.length > 20) {
        message = Drupal.t("The name cannot be longer than 20 characters");
        $("#name").css("border-color", "#ba0c2f");
        $("#error_name").show();
        $("#error_name_message").text(message)
        isValid = false;
      } else {
        $("#name").css("border-color", "#cccccc");
        $("#error_name").hide();
      }
    }
    if (last_name === "") {
      message = Drupal.t("Lastname is required");
      $("#last_name").css("border-color", "#ba0c2f");
      $("#error_last_name").show();
      $("#error_last_name_message").text(message)
      isValid = false;
    } else {
      if (last_name.length > 20) {
        message = Drupal.t("The last name cannot be longer than 20 characters");
        $("#last_name").css("border-color", "#ba0c2f");
        $("#error_last_name").show();
        $("#error_last_name_message").text(message)
        isValid = false;
      } else {
        $("#last_name").css("border-color", "#cccccc");
        $("#error_last_name").hide();
      }
    }

    if (email == "" || !isEmail(email)) {
      message = Drupal.t("Email is required and must be a valid email address.");
      $("#email").css("border-color", "#ba0c2f");
      $("#error_mail").show();
      $("#error_mail_message").text(message)
      isValid = false;
    } else {
      //check if mail server is valid
      if (email.indexOf("@gmail.com") > -1
        || email.indexOf("@yahoo.com") > -1
        || email.indexOf("@hotmail.com") > -1
        || email.indexOf("@outlook.com") > -1
        || email.indexOf("@live.com") > -1
        || email.indexOf("@msn.com") > -1) {
        message = Drupal.t("The email is invalid");
        $("#email").css("border-color", "#ba0c2f");
        $("#error_mail").show();
        $("#error_mail_message").text(message)
        isValid = false;
      } else {
        $('#error_mail').tooltip('hide')
        $("#error_mail").hide();
        $("#email").css("border-color", "#cccccc");
      }
    }

    if (cellphone === "") {
      message = Drupal.t("Cellphone is required");
      $("#cellphone").css("border-color", "#ba0c2f");
      $("#error_cellphone").show();
      $("#error_cellphone_message").text(message)
      isValid = false;
    } else {
      if (!isNumber(cellphone)) {
        message = Drupal.t("The cell phone must be a number");
        $("#cellphone").css("border-color", "#ba0c2f");
        $("#error_cellphone").show();
        $("#error_cellphone_message").text(message)
        isValid = false;
      } else {
        if (cellphone.length !== 10) {
          message = Drupal.t("The cell phone must not have more than 10 digits");
          $("#cellphone").css("border-color", "#ba0c2f");
          $("#error_cellphone").show();
          $("#error_cellphone_message").text(message)
          isValid = false;
        } else {
          $("#cellphone").css("border-color", "#cccccc");
          $("#error_cellphone").hide();
        }
      }
    }

    if (business_name === "") {
      message = Drupal.t("Company is required");
      $("#business_name").css("border-color", "#ba0c2f");
      $("#error_business_name").show();
      $("#error_business_name_message").text(message)
      isValid = false;
    } else {
      if (business_name.length > 100) {
        message = Drupal.t("The company cannot be longer than 100 characters");
        $("#business_name").css("border-color", "#ba0c2f");
        $("#error_business_name").show();
        $("#error_business_name_message").text(message)
        isValid = false;
      } else {
        $("#business_name").css("border-color", "#cccccc");
        $("#error_business_name").hide();
      }
    }

    if (password == "") {
      message = Drupal.t("Password is required");
      $("#password_buyer").css("border-color", "#ba0c2f");
      $("#password_buyer__span").css("border-color", "#ba0c2f");
      $("#error_password_buyer_message").text(message)
      $("#error_password_buyer").show();
      isValid = false;
    } else {
      console.log(password.length);
      if (password.length < 8 || password.length > 15) {
        message = Drupal.t("The password must be between 8 and 15 characters long");
        $("#password_buyer").css("border-color", "#ba0c2f");
        $("#password_buyer__span").css("border-color", "#ba0c2f");
        $("#error_password_buyer_message").text(message)
        $("#error_password_buyer").show();
        isValid = false;
      } else {
        if (!password.match(/[A-Z]/)) {
          message = Drupal.t("The password must have at least one capital letter");
          $("#password_buyer").css("border-color", "#ba0c2f");
          $("#password_buyer__span").css("border-color", "#ba0c2f");
          $("#error_password_buyer_message").text(message)
          $("#error_password_buyer").show();
          isValid = false;
        } else {
          if (!password.match(/[0-9]/)) {
            message = Drupal.t("The password must have at least one number");
            $("#password_buyer").css("border-color", "#ba0c2f");
            $("#password_buyer__span").css("border-color", "#ba0c2f");
            $("#error_password_buyer_message").text(message)
            $("#error_password_buyer").show();
            isValid = false;
          } else {
            if (!password.match(/[^a-zA-Z0-9]/)) {
              message = Drupal.t("The password must have at least one special character");
              $("#password_buyer").css("border-color", "#ba0c2f");
              $("#password_buyer__span").css("border-color", "#ba0c2f");
              $("#error_password_buyer_message").text(message)
              $("#error_password_buyer").show();
              $("#error_password_buyer")

                ;
              isValid = false;
            } else {
              $("#error_password_buyer").hide();
              $("#password_buyer").css("border-color", "#cccccc");
              $("#password_buyer__span").css("border-color", "#cccccc");
            }
          }
        }
      }
    }

    if (confirm_password_buyer == "") {
      message = Drupal.t("Verify password field is required");
      $("#confirm_password_buyer").css("border-color", "#ba0c2f");
      $("#pass_bloq_buyer_confirm__span").css("border-color", "#ba0c2f");
      $("#error_confirm_password_buyer_message").text(message)
      $("#error_confirm_password_buyer").show();
      isValid = false;
    } else {
      if (password != confirm_password_buyer) {
        message = Drupal.t("The field verify password and Password must be the same");
        $("#confirm_password_buyer").css("border-color", "#ba0c2f");
        $("#pass_bloq_buyer_confirm__span").css("border-color", "#ba0c2f");
        $("#error_confirm_password_buyer_message").text(message)
        $("#error_confirm_password_buyer").show();
        isValid = false;
      } else {
        $("#error_confirm_password_buyer").hide();
        $("#confirm_password_buyer").css("border-color", "#cccccc");
        $("#pass_bloq_buyer_confirm__span").css("border-color", "#cccccc");
      }
    }

    if (langcode == "") {
      message = Drupal.t("The language field is required");
      $("#langcode").css("border-color", "#ba0c2f");
      $("#error_langcode_message").text(message)
      $("#error_langcode").show();
      isValid = false;
    } else {
      $("#error_langcode").hide();
      $("#langcode").css("border-color", "#cccccc");
    }

    if (!$("#policy").is(":checked")) {
      message = Drupal.t("You must accept the privacy policy");
      $("#policy").addClass('error');
      $("#error_policy").show();
      $("#error_policy_message").text(message)
      isValid = false;
    } else {
      $("#error_policy").hide();
      $("#policy").removeClass('error');
    }

    if (!$("#conditions").is(":checked")) {
      message = Drupal.t("You must accept the terms of use");
      $("#conditions").addClass('error');
      $("#error_conditions").show();
      $("#error_conditions_message").text(message)
      isValid = false;
    } else {
      $("#error_conditions").hide();
      $("#conditions").removeClass('error');
    }

    //validate captcha getResponse and if is empty show error
    var response = grecaptcha.getResponse();
    console.log(response);
    console.log("HI x2")
    if (response.length == 0) {
      
      // Display flex for alert-warning.
      $('#alert-warning').css('display', 'flex');
      // Don't show the button.
      $('#error-button-alert-warning').hide();
      // Animation for alert-warning.
      $("#alert-message-layout").css("animation-name", "fadeInUpBig");
      // Change text of alert-warning-heading.
      $('#alert-warning-heading').text(Drupal.t('Missing Captcha'));
      // Change text of alert-warning-message.
      $('#alert-warning-desc').text(Drupal.t('Please verify that you are not a robot'));

      $("#error_captcha").show();
      isValid = false;
    } else {
      $("#error_captcha").hide();
    }

    return isValid;

  }

  /*
   *  Save user with fetch
   *  - Send data and get nit of local storage
   *  - If user is created hidde tab 1 and show tab 2
   */

  function saveUser() {
    if (validateForm1()) {
      //start loading
      $("#loading_1").show();
      $("#save").hide();
      var data = {
        name: $("#name").val(),
        last_name: $("#last_name").val(),
        email: $("#email").val(),
        country_code_mobile: $("#country_code_mobile").val(),
        cellphone: $("#cellphone").val(),
        company: $("#business_name").val(),
        password: $("#password_buyer").val(),
        langcode: $("#langcode").val(),
        country_code_mobile: code_mobile_select.getSelectedCountryData().dialCode,
      };
      console.log(data);
      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      fetch("/pre-register/buyer/create_step_1", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (res) {
          $("#loading_1").hide();
          $("#save").show();
          if (res.status == 200) {
            $("#loader").modal('show');
            var email_form_data = new FormData();
            email_form_data.append("email", data.email);
            fetch("/mailing/verification/email/international", {
              method: "POST",
              body: email_form_data,
            })
              .then(function (response) {
                return response.json();
              }).then(function (data_2) {

                if (data_2.status == "ok") {
                  //save v_r_k in local storage
                  localStorage.setItem("v_r_k", data_2.token);
                  localStorage.setItem("company_name", data.company);
                  localStorage.setItem("email_buyer", data.email);
                  setTimeout(() => {
                    $("#loader").modal('hide');
                    // Redirect to home.
                    window.location.href = "/pre-registro";
                    //add property to button inside #loader
                    $("#loader button").on("click", function () {
                      // Redirect to home.
                      window.location.href = "/pre-registro";
                    });
                  }, 15000);

                  // // Display flex for alert-succes.
                  // $('#alert-succes').css('display', 'flex');
                  // // Show the button.
                  // $('#error-button-alert-succes').show();
                  // // Change button text.
                  // $('#error-button-alert-succes').text(Drupal.t('Go back to main page'));
                  // // Add button link.
                  // $('#error-button-alert-succes').on('click', function () {
                  //   window.location.href = "/home/index";
                  // });
                  // // Animation for alert-succes.
                  // $("#alert-succes").css("animation-name", "fadeInUpBig");
                  // // Change text of alert-succes-heading.
                  // $('#alert-succes-heading').text(Drupal.t('Process completed'));
                  // // Change text of alert-succes-message.
                  // $('#alert-succes-desc').text(Drupal.t("Process completed successfully"));

                } else {
                  $("#loader").modal('hide');
                  
                  // Display flex for alert-message-layout.
                  $('#alert-message-layout').css('display', 'flex');
                  // Show the button.
                  $('#error-button').show();
                  // Change button text.
                  $('#error-button').text(Drupal.t('Contact Support'));
                  // Animation for alert-message-layout.
                  $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                  // Change text of alert-warning-heading.
                  $('#error-tittle').text(Drupal.t('Unexpected error'));
                  // Change text of alert-warning-message.
                  $('#desc-error').text(Drupal.t("Email request error"));
                }
              })
              .catch(function (error) {
                $("#loader").modal('hide');
                // Display flex for alert-message-layout.
                $('#alert-message-layout').css('display', 'flex');
                // Show the button.
                $('#error-button').show();
                // Change button text.
                $('#error-button').text(Drupal.t('Contact Support'));
                // Animation for alert-message-layout.
                $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                // Change text of alert-warning-heading.
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of alert-warning-message.
                $('#desc-error').text(Drupal.t("Email request error"));
              });
          } else {
            // Display flex for alert-warning.
            $('#alert-warning').css('display', 'flex');
            // Don't show the button.
            $('#error-button-alert-warning').hide();
            // Animation for alert-warning.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-warning-heading.
            $('#alert-warning-heading').text(Drupal.t('Warning'));
            // Change text of alert-warning-message.
            $('#alert-warning-desc').text(Drupal.t('E-mail already has been registered'));
          }
        })
        .catch(function (error) {
          $("#loading_1").hide();
          $("#save").show();

          // Display flex for alert-warning.
          $('#alert-warning').css('display', 'flex');
          // Don't show the button.
          $('#error-button-alert-warning').hide();
          // Animation for alert-warning.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-warning-heading.
          $('#alert-warning-heading').text(Drupal.t('Warning'));
          // Change text of alert-warning-message.
          $('#alert-warning-desc').text(Drupal.t('E-mail already has been registered'));
        });
    }
  }

  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_pre_register_buyer = {
    attach: function (context, settings) {

      //if document is ready call init and check if production_chain is in dom
      if (context === document && $("#langcode").length > 0) {
        init();
      }
      //get current url
      var url = window.location.href;

      if(url.includes("pre-register/buyer") || url.includes("pre-registro/comprador")){
        //call function passwordToText
        $("#pass_show_buyer", context).click(function () {
          passwordToText();
        });
        //call function textToPassword
        $("#pass_bloq_buyer", context).click(function () {
          textToPassword();
        });
        //call function passwordToText
        $("#pass_show_buyer_confirm", context).click(function () {
          passwordToText();
        });
        //call function textToPassword
        $("#pass_bloq_buyer_confirm", context).click(function () {
          textToPassword();
        });
        //call function valueProgressBar oninput
        $("#password_buyer", context).on("input", function () {
          valueProgressBar();
        });
        //call function saveUser
        $("#save", context).click(function () {
          saveUser();
        });
        //Reload form data
        $("#reload_form", context).click(function () {
          window.location.reload()
        });
      
        //call function saveUser and validate form
        $("#name", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
            console.log(url);
          }
        });
        //call function saveUser and validate form
        $("#last_name", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
        //call function saveUser and validate form
        $("#business_name", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
        //call function saveUser and validate form
        $("#email", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
        $("#cellphone", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
        $("#password_buyer", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
        $("#confirm_password_buyer", context).keypress(function (event) {
          if (event.keyCode == 13) {
            saveUser();
          }
        });
      }  
    }
  };
}(jQuery, Drupal));