/*
 * Service for Register
 */

// open input file with button
(function ($, Drupal) {
  'use strict';
  //initial config
  function init() {
    //check if email is in local storage go to step 2 register/user/buyer
    if (localStorage.getItem('email_buyer')) {
      window.location.href = '/register/user/buyer';
    }
    // Initalize select2

    new TomSelect('#country_code_mobile', {
      create: false,
      // use method disable()
      render: {
        option: function (data, escape) {
          return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;
        },
        item: function (item, escape) {
          return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;
        }
      },
    })

    document.getElementById("country_code_mobile-ts-control").disabled = true;
    $("#country_code_mobile-ts-control").attr('style', 'display: none !important');
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
      $("#error_mensaje_pass").text("Debil");
    } else {
      if (progress === 50) {
        $("#progressbar").css("background", "#fdca00");
        $("#error_mensaje_pass").text("Normal");
      } else {
        if (progress === 75) {
          $("#progressbar").css("background", "#0085ca");
          $("#error_mensaje_pass").text("Buena");
        } else {
          if (progress === 100) {
            $("#error_mensaje_pass").text("Fuerte");
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
      message += "El nombre es requerido\n";
      $("#name").css("border-color", "#ba0c2f");
      $("#error_name").show();
      $("#error_name_message").text(message)
      isValid = false;
    } else {
      if (name.length > 20) {
        message += "El nombre no puede tener mas de 20 caracteres\n";
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
      message += "El apellido es requerido\n";
      $("#last_name").css("border-color", "#ba0c2f");
      $("#error_last_name").show();
      $("#error_last_name_message").text(message)
      isValid = false;
    } else {
      if (last_name.length > 20) {
        message += "El apellido no puede tener mas de 20 caracteres\n";
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
      message = "El email es requerido y debe ser un email válido";
      $("#email").css("border-color", "#ba0c2f");
      $("#error_mail").show();
      $("#error_mail_message").text(message)
      isValid = false;
    } else {
      $('#error_mail').tooltip('hide')
      $("#error_mail").hide();
      $("#email").css("border-color", "#cccccc");
    }

    if (cellphone !== "") {
      if (!isNumber(cellphone)) {
        message = "El celular debe ser un número";
        $("#cellphone").css("border-color", "#ba0c2f");
        $("#error_cellphone").show();
        $("#error_cellphone_message").text(message)
        isValid = false;
      } else {
        $("#cellphone").css("border-color", "#cccccc");
        $("#error_cellphone").hide();
      }
    }

    if (business_name === "") {
      message += "La compañia es requerida\n";
      $("#business_name").css("border-color", "#ba0c2f");
      $("#error_business_name").show();
      $("#error_business_name_message").text(message)
      isValid = false;
    } else {
      if (business_name.length > 100) {
        message += "La compañia no puede tener mas de 100 caracteres\n";
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
      message = "El password es requerido";
      $("#password_buyer").css("border-color", "#ba0c2f");
      $("#error_password_buyer_message").text(message)
      $("#error_password_buyer").show();
      isValid = false;
    } else {
      if (password.length < 8) {
        message = "El password debe tener entre 8 y 15 caracteres";
        $("#password_buyer").css("border-color", "#ba0c2f");
        $("#error_password_buyer_message").text(message)
        $("#error_password_buyer").show();
        isValid = false;
      } else {
        if (!password.match(/[A-Z]/)) {
          message = "El password debe tener al menos una mayúscula";
          $("#password_buyer").css("border-color", "#ba0c2f");
          $("#error_password_buyer_message").text(message)
          $("#error_password_buyer").show();
          isValid = false;
        } else {
          if (!password.match(/[0-9]/)) {
            message = "El password debe tener al menos un número";
            $("#password_buyer").css("border-color", "#ba0c2f");
            $("#error_password_buyer_message").text(message)
            $("#error_password_buyer").show();
            $("#error_password_buyer")

              ;
            isValid = false;
          } else {
            if (!password.match(/[^a-zA-Z0-9]/)) {
              message =
                "El password debe tener al menos un caracter especial";
              $("#password_buyer").css("border-color", "#ba0c2f");
              $("#error_password_buyer_message").text(message)
              $("#error_password_buyer").show();
              $("#error_password_buyer")

                ;
              isValid = false;
            } else {
              $("#error_password_buyer").hide();
              $("#password_buyer").css("border-color", "#cccccc");
            }
          }
        }
      }
    }

    if (confirm_password_buyer == "") {
      message = "El campo verificar contraseña es requerido";
      $("#confirm_password_buyer").css("border-color", "#ba0c2f");
      $("#error_confirm_password_buyer_message").text(message)
      $("#error_confirm_password_buyer").show();
      isValid = false;
    } else {
      if (password != confirm_password_buyer) {
        message = "El campo verificar contraseña y Contraseña deben ser iguales";
        $("#confirm_password_buyer").css("border-color", "#ba0c2f");
        $("#error_confirm_password_buyer_message").text(message)
        $("#error_confirm_password_buyer").show();
        isValid = false;
      } else {
        $("#error_confirm_password_buyer").hide();
        $("#confirm_password_buyer").css("border-color", "#cccccc");
      }
    }

    if (langcode == "") {
      message = "El campo lenguaje es requerido";
      $("#langcode").css("border-color", "#ba0c2f");
      $("#error_langcode_message").text(message)
      $("#error_langcode").show();
      isValid = false;
    } else {
      $("#error_langcode").hide();
      $("#langcode").css("border-color", "#cccccc");
    }

    if (!policy) {
      message = "Debe aceptar las políticas de privacidad";
      $("#error_policy").show();
      $("#error_policy_message").text(message)
      isValid = false;
    } else {
      $("#error_policy").hide();
    }

    if (!conditions) {
      message = "Debe aceptar las condiciones de uso";
      $("#error_conditions").show();
      $("#error_conditions_message").text(message)
      isValid = false;
    } else {
      $("#error_conditions").hide();
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
        langcode: $("#langcode").val()
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      fetch("/pre-register/buyer/create_step_1", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          $("#loading_1").hide();
          $("#save").show();
          if (response.status == 200) {
            //save email in local storage
            localStorage.setItem("email_buyer", data.email);
            //redirect to step 2
            window.location.href = '/register/user/buyer';
          } else {
            alert("Error al crear el usuario" + error);
          }
        })
        .catch(function (error) {
          $("#loading_1").hide();
          $("#save").show();
          alert("Error al crear el usuario" + error);
        });
    }
  }

  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_pre_register_buyer = {
    attach: function (context, settings) {

      //if document is ready call init and check if production_chain is in dom
      if (context === document && $("#country_code_mobile").length > 0) {
        init();
      }
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
    }
  };


}(jQuery, Drupal));