/*
 * Service for Check NIT
 */

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
  var nit = jQuery("#nit").val();
  var email = jQuery("#email").val();
  var message = "";
  var isValid = true;
  if (nit == "" || nit.length != 12 || isNaN(nit)) {
    message += "<p>El NIT es requerido y debe tener 12 dígitos</p>";
    jQuery("#error_nit").html(message);
    jQuery("#error_nit").show();
    isValid = false;
  } else {
    jQuery("#error_nit").hide();
  }
  if (email == "" || !isEmail(email)) {
    message += "<p>El email es requerido y debe ser un email válido</p>";
    jQuery("#error_email").html(message);
    jQuery("#error_email").show();
    isValid = false;
  } else {
    jQuery("#error_email").hide();
  }
  if (!jQuery("#policy").is(":checked")) {
    message += "<p>Debe aceptar las políticas de privacidad</p>";
    jQuery("#error_policy").html(message);
    jQuery("#error_policy").show();
    isValid = false;
  } else {
    jQuery("#error_policy").hide();
  }
  if (!jQuery("#conditions").is(":checked")) {
    message += "<p>Debe aceptar las condiciones de uso</p>";
    jQuery("#error_conditions").html(message);
    jQuery("#error_conditions").show();
    isValid = false;
  } else {
    jQuery("#error_conditions").hide();
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
    var nit = jQuery("#nit").val();
    var email = jQuery("#email").val();
    var url = "/verification/validate_nit";
    var data = {
      nit: nit,
      email: email,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data) {
          localStorage.setItem("nit", nit);
          localStorage.setItem("email", email);
          window.location.href = "/registro/usuario";
        } else {
          jQuery("#error_nit").html(data.message);
          jQuery("#error_nit").show();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
