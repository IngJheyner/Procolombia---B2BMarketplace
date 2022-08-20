
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
  if (nit == "" || isNaN(nit)) {
    message += "<p>El NIT es requerido y debe tener 12 dígitos</p>";
    jQuery("#nit").css("border-color", "#ba0c2f");
    jQuery("#error_nit").show();
    jQuery('#error_nit').attr('data-bs-original-title', "Foo").tooltip('show');
    isValid = false;
  } else {
    jQuery('#error_nit').tooltip('hide')
    jQuery("#error_nit").hide();
    jQuery("#nit").css("border-color", "#cccccc");
  }

  if (email == "" || !isEmail(email)) {
    message += "<p>El email es requerido y debe ser un email válido</p>";
    jQuery("#email").css("border-color", "#ba0c2f");
    jQuery("#error_mail").show();
    jQuery('#error_mail').attr('data-bs-original-title', "Foo").tooltip('show');
    isValid = false;
  } else {
    jQuery('#error_mail').tooltip('hide')
    jQuery("#error_mail").hide();
    jQuery("#email").css("border-color", "#cccccc");
  }
  if (!jQuery("#policy").is(":checked")) {
    jQuery("#policy").addClass('error');

    isValid = false;
  } else {
    jQuery("#error_policy").hide();
    jQuery("#policy").removeClass('error');
  }
  if (!jQuery("#conditions").is(":checked")) {
    jQuery("#conditions").addClass('error');
  } else {
    jQuery("#conditions").removeClass('error');
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
    jQuery("#loader").modal('show');
    var nit = jQuery("#nit").val();
    var email = jQuery("#email").val();
    var url = "/verification/validate_nit";
    var data = {
      nit: nit,
      email: email,
    };
    var form_data = new FormData();
    for ( var key in data ) {
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
        console.log(data)
        if (data.includes("success")) {
          setTimeout(() => {  
            jQuery("#loader").modal('hide');
            jQuery("#success").modal('show');
          }, 1000);
          setTimeout(() => {
            localStorage.setItem("nit", nit);
            localStorage.setItem("email", email);
            window.location.href = "/registro/usuario";
          }, 2500);
        } else {
          setTimeout(() => {
            jQuery("#loader").modal('hide');
            if (data.includes("user")) {
              jQuery("#error_user").modal('show');
            } else {
              if (data.includes("neo")) {
                jQuery("#error_neo").modal('show');
              }else{
                alert("ERROR INESPERADO")
              }
            }
          }, 1000);
        }
      })
      .catch(function (error) {
        setTimeout(() => {
          jQuery("#loader").modal('hide');
          alert("ERROR INESPERADO")
        }, 1000);
      });
  }
}
