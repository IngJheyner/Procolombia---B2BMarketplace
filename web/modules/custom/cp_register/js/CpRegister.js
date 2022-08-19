/*
 * Service for Check NIT
 */

// check if url is valid
function isUrl(s) {
  var regexp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return regexp.test(s);
}
/*
 *  Validate Form 1
 *  - logo is a image file and is required and is png and jpg and have size less than 2MB and dimension less than 200x200
 *  - bussiness_name is required and is a string and have length less than 100
 *  - website is required and is url
 *  - video is optional and is url
 *  - password is required and have length less than 15 and more than 8 and have capital letter and number and special character
 *  - confirm_password is required and equal password
 *  - productive_chain is required
 *  - description_bussiness_spanish is required and is a string and have length less than 1000
 *  - description_bussiness_english is required and is a string and have length less than 1000
 *  - Show message error for each field if is not valid and return false
 */

function validateForm1() {
  var logo = jQuery("#logo").prop("files")[0];
  var bussiness_name = jQuery("#bussiness_name").val();
  var website = jQuery("#website").val();
  var video = jQuery("#video").val();
  var password = jQuery("#password").val();
  var confirm_password = jQuery("#confirm_password").val();
  var productive_chain = jQuery("#productive_chain").val();
  var description_bussiness_spanish = jQuery(
    "#description_bussiness_spanish"
  ).val();
  var description_bussiness_english = jQuery(
    "#description_bussiness_english"
  ).val();
  var message = "";
  var isValid = true;

  if (logo == undefined) {
    message +=
      "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
    jQuery("#logo").html(message);
    jQuery("#logo").show();
  } else {
    var file = logo.type;
    var fileSize = logo.size;
    var fileName = logo.name;
    var fileExtension = fileName.split(".").pop();
    if (fileExtension != "png" && fileExtension != "jpg") {
      message +=
        "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
      jQuery("#logo").html(message);
      jQuery("#logo").show();
      isValid = false;
    } else {
      if (fileSize > 2000000) {
        message +=
          "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
        jQuery("#logo").html(message);
        jQuery("#logo").show();
        isValid = false;
      } else {
        jQuery("#logo").hide();
      }
    }
  }

  if (bussiness_name == "") {
    message += "<p>El nombre de la empresa es requerido</p>";
    jQuery("#error_bussiness_name").html(message);
    jQuery("#error_bussiness_name").show();
    isValid = false;
  } else {
    jQuery("#error_bussiness_name").hide();
  }
  if (website == "") {
    message += "<p>El website es requerido</p>";
    jQuery("#error_website").html(message);
    jQuery("#error_website").show();
    isValid = false;
  } else {
    jQuery("#error_website").hide();
  }
  if (video != "") {
    if (!isUrl(video)) {
      message += "<p>El video es requerido y debe ser una url</p>";
      jQuery("#error_video").html(message);
      jQuery("#error_video").show();
      isValid = false;
    } else {
      jQuery("#error_video").hide();
    }
  }

  if (password == "") {
    message += "<p>El password es requerido</p>";
    jQuery("#error_password").html(message);
    jQuery("#error_password").show();
    isValid = false;
  } else {
    if (password.length < 8 || password.length > 15) {
      message += "<p>El password debe tener entre 8 y 15 caracteres</p>";
      jQuery("#error_password").html(message);
      jQuery("#error_password").show();
      isValid = false;
    } else {
      if (!password.match(/[A-Z]/)) {
        message += "<p>El password debe tener al menos una mayúscula</p>";
        jQuery("#error_password").html(message);
        jQuery("#error_password").show();
        isValid = false;
      } else {
        if (!password.match(/[0-9]/)) {
          message += "<p>El password debe tener al menos un número</p>";
          jQuery("#error_password").html(message);
          jQuery("#error_password").show();
          isValid = false;
        } else {
          if (!password.match(/[^a-zA-Z0-9]/)) {
            message +=
              "<p>El password debe tener al menos un caracter especial</p>";
            jQuery("#error_password").html(message);
            jQuery("#error_password").show();
            isValid = false;
          } else {
            jQuery("#error_password").hide();
          }
        }
      }
    }
  }

  if (confirm_password == "") {
    message += "<p>El confirmar password es requerido</p>";
    jQuery("#error_confirm_password").html(message);
    jQuery("#error_confirm_password").show();
    isValid = false;
  } else {
    if (password != confirm_password) {
      message += "<p>El password y confirmar password deben ser iguales</p>";
      jQuery("#error_confirm_password").html(message);
      jQuery("#error_confirm_password").show();
      isValid = false;
    } else {
      jQuery("#error_confirm_password").hide();
    }
  }

  if (productive_chain == "") {
    message += "<p>La cadena de productividad es requerida</p>";
    jQuery("#error_productive_chain").html(message);
    jQuery("#error_productive_chain").show();
    isValid = false;
  } else {
    jQuery("#error_productive_chain").hide();
  }
  if (description_bussiness_spanish == "") {
    message += "<p>La descripción en español es requerida</p>";
    jQuery("#error_description_bussiness_spanish").html(message);
    jQuery("#error_description_bussiness_spanish").show();
    isValid = false;
  } else {
    jQuery("#error_description_bussiness_spanish").hide();
  }
  if (description_bussiness_english == "") {
    message += "<p>La descripción en ingles es requerida</p>";
    jQuery("#error_description_bussiness_english").html(message);
    jQuery("#error_description_bussiness_english").show();
    isValid = false;
  } else {
    jQuery("#error_description_bussiness_english").hide();
  }
  return isValid;
}

/*
 *  Save user with fetch
 *  - Send data and get nit of local storage
 *  - If user is created hidde tab 1 and show tab 2
 */

function saveUser() {
  var data = {
    logo: jQuery("#logo").val(),
    bussiness_name: jQuery("#bussiness_name").val(),
    website: jQuery("#website").val(),
    video: jQuery("#video").val(),
    password: jQuery("#password").val(),
    confirm_password: jQuery("#confirm_password").val(),
    productive_chain: jQuery("#productive_chain").val(),
    description_bussiness_spanish: jQuery(
      "#description_bussiness_spanish"
    ).val(),
    description_bussiness_english: jQuery(
      "#description_bussiness_english"
    ).val(),
    nit: localStorage.getItem("nit"),
  };
  fetch("/api/register/user", {
    method: "POST",
    body: JSON.stringify(data),
  }).then(function (response) {
    if (response.status == 200) {
      jQuery("#tab1").hide();
      jQuery("#tab2").show();
    } else {
      alert("Error al crear el usuario");
    }
  });
}
