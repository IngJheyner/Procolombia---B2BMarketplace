
/*
 * Service for Check NIT
 */
(function ($, Drupal) {
  'use strict';

  function init() {
    //check if in the query params exist token
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
            window.location.href = "/registro/usuario";
          }, 5000);
        } else {
          alert("Token invalid");
        }
      }).catch(function (error) {
        console.log('Request failed', error);
      });
    }

  }

  const isEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  /*
   *  Validate Form
   *  - NIT is required and is a number and have length of 12
   *  - Email is required and is a valid email
   *  - policy is true
   *  - conditions is true
   *  - Show message error for each field if is not valid and return false
   */
  function validateForm() {
    var nit = $("#nit").val();
    var email = $("#email").val();
    var message = "";
    var isValid = true;
    if (nit == "" || isNaN(nit) || nit.length > 12) {
      message = Drupal.t("The NIT is required and must have less than 12 digits");
      $("#nit").css("border-color", "#ba0c2f");
      $("#error_nit").show();
      $("#error_nit_message").text(message)
      $('#error_nit').attr('data-bs-original-title', "Foo").tooltip('show');
      isValid = false;
    } else {
      $('#error_nit').tooltip('hide')
      $("#error_nit").hide();
      $("#nit").css("border-color", "#cccccc");
    }

    if (email == "" || !isEmail(email)) {
      message = Drupal.t("Email is required and must be a valid email address.");
      $("#email").css("border-color", "#ba0c2f");
      $("#error_mail").show();
      $("#error_mail_message").text(message)
      $('#error_mail').attr('data-bs-original-title', "Foo").tooltip('show');
      isValid = false;
    } else {
      $('#error_mail').tooltip('hide')
      $("#error_mail").hide();
      $("#email").css("border-color", "#cccccc");
    }
    if (!$("#policy").is(":checked")) {
      $("#policy").addClass('error');

      isValid = false;
    } else {
      $("#error_policy").hide();
      $("#policy").removeClass('error');
    }
    if (!$("#conditions").is(":checked")) {
      $("#conditions").addClass('error');
    } else {
      $("#conditions").removeClass('error');
    }

    return isValid;
  }

  /*
   *  Check NIT with fetch
   *  - Send Nit and save Email in localStorage
   *  - If NIT is valid, redirect to register form
   *  - If NIT is not valid, show error message
   */

  function checkNit() {
    if (validateForm()) {
      $("#loader").modal('show');
      var nit = $("#nit").val();
      var email = $("#email").val();
      var url = "/verification/validate_nit";
      var data = {
        nit: nit,
        email: email,
      };
      var form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }

      fetch(url, {
        method: "POST",
        body: form_data,
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          if (data.includes("success")) {
            //send mailing/verification/email/col and send only email
            var email_form_data = new FormData();
            email_form_data.append("email", email);
            fetch("/mailing/verification/email/col", {
              method: "POST",
              body: email_form_data,
            })
              .then(function (response) {
                return response.json();
              }).then(function (data_2) {
                
                if (data_2.status == "ok") {
                  //save v_r_k in local storage
                  localStorage.setItem("v_r_k", data_2.token);
                  localStorage.setItem("nit", nit);
                  localStorage.setItem("email", email);
                  let json = data.split(":[")[1].split("]")[0];
                  localStorage.setItem("data_neo", json);
                  setTimeout(() => {
                    $("#loader").modal('hide');
                  }, 15000);
                } else {
                  $("#loader").modal('hide');
                  alert("Request failed email");
                }
              })
              .catch(function (error) {
                $("#loader").modal('hide');
                alert("Request failed email", error);
              });
          } else {
            setTimeout(() => {
              $("#loader").modal('hide');
              if (data.includes("user")) {
                $("#error_user").modal('show');
              } else {
                if (data.includes("neo")) {
                  $("#error_neo").modal('show');
                } else {
                  alert("ERROR INESPERADO")
                }
              }
            }, 4000);
          }
        })
        .catch(function (error) {
          setTimeout(() => {
            $("#loader").modal('hide');
            alert("ERROR INESPERADO")
          }, 4000);
        });
    }
  }

  //go_home
  function goHome() {
    window.location.href = "/verificacion/usuario";
  }
  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_check_nit = {
    attach: function (context, settings) {
      //init 
      if (context == document) {
        init();
      }
      //call function to check nit
      $("#check_nit", context).click(function () {
        checkNit();
      });
      //call function to redirect to google form
      $("#go_form", context).click(function () {
        window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSdJ7kX4dg2lTMlxBu2xuCy_tdtBme-Mn7DMHoCKDESTtaN7vg/viewform";
      });
      //call function to redirect to google form
      $("#login_btn", context).click(function () {
        window.location.href = "/user/login";
      });
      //call function go home
      $("#cancel_procces", context).click(function () {
        goHome();
      });

    }
  };

}(jQuery, Drupal));