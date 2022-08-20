/*
 * Service for Check NIT
 */
// open input file with button
function openInputFile() {
  jQuery("#logo").click();
}

// onChangeFile Show Logo and name
function onChangeLogo() {
  // get file
  var file = jQuery("#logo")[0].files[0];
  // get file name
  var fileName = file.name;
  // get file size in kb
  var fileSize = file.size / 1024;
  // get url temp
  var url = URL.createObjectURL(file);
  // show image
  jQuery("#logo_img").attr("src", url);
  jQuery("#logo_img").show();
  jQuery("#logo_name").val(fileName + "(" + fileSize.toFixed(2) + "KB)");
  jQuery("#logo_name").show();
  jQuery("#prew").show();
  jQuery("#logo_input").hide();
}

// remove logo file and hide image
function removeLogo() {
  jQuery("#logo_img").hide();
  jQuery("#logo_name").hide();
  jQuery("#logo_img").attr("src", "");
  jQuery("#logo_name").val("");
  jQuery("#logo").val("");
  jQuery("#prew").hide();
  jQuery("#logo_input").show();
}

// toggle password to text
function passwordToText() {
  jQuery("#password").attr("type", "text");
  jQuery("#confirm_password").attr("type", "text");
  jQuery("#pass_show").hide();
  jQuery("#pass_show_confirm").hide();
  jQuery("#pass_bloq").show();
  jQuery("#pass_bloq_confirm").show();
}

// toggle password to text
function textToPassword() {
  jQuery("#password").attr("type", "password");
  jQuery("#confirm_password").attr("type", "password");
  jQuery("#pass_show").show();
  jQuery("#pass_show_confirm").show();
  jQuery("#pass_bloq").hide();
  jQuery("#pass_bloq_confirm").hide();
}

// progress bar
function valueProgressBar() {
  var password = jQuery("#password").val();
  let progress = 0;
  if (password.length >= 8 && password.length <= 15) {
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
    jQuery("#progressbar").css("background", "#ba0c2f");
  } else {
    if (progress === 50) {
      jQuery("#progressbar").css("background", "#fdca00");
    } else {
      if (progress === 75) {
        jQuery("#progressbar").css("background", "#0085ca");
      } else {
        if (progress === 100) {
          jQuery("#progressbar").css("background", "#31d394");
        }
      }
    }
  }
  jQuery("#progressbar").css("width", progress + "%");
}

//create tumbnail youtube
function createThumbnailYoutube(url) {
  //validate is url youtube
  if (isUrlYoutube(url)) {
    let request_url = `https://youtube.com/oembed?url=${url}&format=json`;
    fetch(request_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        jQuery("#thumbnail").attr("src", data.thumbnail_url);
        jQuery("#title").text(data.title);
        jQuery("#author_name").text(data.author_name);
      })
      .catch((error) => {
        let message = "No se reonoco el video";
        jQuery("#video").css("border-color", "#ba0c2f");
        jQuery("#error_video").show();
        jQuery("#error_video")
          .attr("data-bs-original-title", "Foo")
          .tooltip("show");
      });
  } else {
    //show video error
    let message = "Url no es una url de youtube";
    jQuery("#video").css("border-color", "#ba0c2f");
    jQuery("#error_video").show();
    jQuery("#error_video")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
  }
}

//set NIT
let NIT = localStorage.getItem("nit");
jQuery("#nit").val(NIT);

// check if url is valid
function isUrlYoutube(s) {
  var regexp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
  return regexp.test(s);
}

//is url
function isUrl(s) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

/*
 *  Validate Form 1
 *  - logo is a image file and is required and is png and jpg and have size less than 2MB and dimension less than 200x200
 *  - business_name is required and is a string and have length less than 100
 *  - website is required and is url
 *  - video is optional and is url
 *  - password is required and have length less than 15 and more than 8 and have capital letter and number and special character
 *  - confirm_password is required and equal password
 *  - productive_chain is required
 *  - description_business_spanish is required and is a string and have length less than 1000
 *  - description_business_english is required and is a string and have length less than 1000
 *  - Show message error for each field if is not valid and return false
 */

function validateForm1() {
  var logo = jQuery("#logo").prop("files")[0];
  var business_name = jQuery("#business_name").val();
  var website = jQuery("#website").val();
  var video = jQuery("#video").val();
  var password = jQuery("#password").val();
  var confirm_password = jQuery("#confirm_password").val();
  var description_business_spanish = jQuery(
    "#description_business_spanish"
  ).val();
  var message = "";
  var isValid = true;
  if (logo == undefined) {
    message +=
      "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
    jQuery("#logo").css("border-color", "#ba0c2f");
    jQuery("#error_logo").show();
    jQuery("#error_logo").attr("data-bs-original-title", "Foo").tooltip("show");
    isValid = false;
  } else {
    var file = logo.type;
    var fileSize = logo.size;
    var fileName = logo.name;
    var fileExtension = fileName.split(".").pop();
    if (fileExtension != "png" && fileExtension != "jpg") {
      message +=
        "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
      jQuery("#logo").css("border-color", "#ba0c2f");
      jQuery("#error_logo").show();
      jQuery("#error_logo")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      if (fileSize > 2000000) {
        message +=
          "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
        jQuery("#logo").css("border-color", "#ba0c2f");
        jQuery("#error_logo").show();
        jQuery("#error_logo")
          .attr("data-bs-original-title", "Foo")
          .tooltip("show");
        isValid = false;
      } else {
        if (logo.width > 200 || logo.height > 200) {
          message +=
            "Logo is required and is a image file and is png and jpg and have size less than 2MB and dimension less than 200x200\n";
          jQuery("#logo").css("border-color", "#ba0c2f");
          jQuery("#error_logo").show();
          jQuery("#error_logo")
            .attr("data-bs-original-title", "Foo")
            .tooltip("show");
          isValid = false;
        } else {
          jQuery("#error_logo").tooltip("hide");
          jQuery("#error_logo").hide();
          jQuery("#logo").css("border-color", "#cccccc");
        }
      }
    }
  }

  if (business_name == "") {
    message += "<p>El nombre de la empresa es requerido</p>";
    jQuery("#business_name").css("border-color", "#ba0c2f");
    jQuery("#error_business_name").show();
    jQuery("#error_business_name")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (business_name.length > 100) {
      message +=
        "<p>El nombre de la empresa no puede tener mas de 100 caracteres</p>";
      jQuery("#business_name").css("border-color", "#ba0c2f");
      jQuery("#error_business_name").show();
      jQuery("#error_business_name")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_business_name").tooltip("hide");
      jQuery("#error_business_name").hide();
      jQuery("#business_name").css("border-color", "#cccccc");
    }
  }

  if (website == "") {
    message += "<p>El website es requerido</p>";
    jQuery("#website").css("border-color", "#ba0c2f");
    jQuery("#error_website").show();
    jQuery("#error_website")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (!isUrl(website)) {
      message += "<p>El website no es valido</p>";
      jQuery("#website").css("border-color", "#ba0c2f");
      jQuery("#error_website").show();
      jQuery("#error_website")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_website").tooltip("hide");
      jQuery("#error_website").hide();
      jQuery("#website").css("border-color", "#cccccc");
    }
  }

  if (video != "") {
    if (!isUrlYoutube(video)) {
      message += "<p>El video es requerido y debe ser una url</p>";
      jQuery("#video").css("border-color", "#ba0c2f");
      jQuery("#error_video").show();
      jQuery("#error_video")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_video").tooltip("hide");
      jQuery("#error_video").hide();
      jQuery("#video").css("border-color", "#cccccc");
    }
  } else {
    jQuery("#error_video").tooltip("hide");
    jQuery("#error_video").hide();
    jQuery("#video").css("border-color", "#cccccc");
  }

  if (password == "") {
    message += "<p>El password es requerido</p>";
    jQuery("#password").css("border-color", "#ba0c2f");
    jQuery("#error_password").show();
    jQuery("#error_password")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (password.length < 8 || password.length > 15) {
      message += "<p>El password debe tener entre 8 y 15 caracteres</p>";
      jQuery("#password").css("border-color", "#ba0c2f");
      jQuery("#error_password").show();
      jQuery("#error_password")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      if (!password.match(/[A-Z]/)) {
        message += "<p>El password debe tener al menos una mayúscula</p>";
        jQuery("#password").css("border-color", "#ba0c2f");
        jQuery("#error_password").show();
        jQuery("#error_password")
          .attr("data-bs-original-title", "Foo")
          .tooltip("show");
        isValid = false;
      } else {
        if (!password.match(/[0-9]/)) {
          message += "<p>El password debe tener al menos un número</p>";
          jQuery("#password").css("border-color", "#ba0c2f");
          jQuery("#error_password").show();
          jQuery("#error_password")
            .attr("data-bs-original-title", "Foo")
            .tooltip("show");
          isValid = false;
        } else {
          if (!password.match(/[^a-zA-Z0-9]/)) {
            message +=
              "<p>El password debe tener al menos un caracter especial</p>";
            jQuery("#password").css("border-color", "#ba0c2f");
            jQuery("#error_password").show();
            jQuery("#error_password")
              .attr("data-bs-original-title", "Foo")
              .tooltip("show");
            isValid = false;
          } else {
            jQuery("#error_password").tooltip("hide");
            jQuery("#error_password").hide();
            jQuery("#password").css("border-color", "#cccccc");
          }
        }
      }
    }
  }

  if (confirm_password == "") {
    message += "<p>El confirmar password es requerido</p>";
    jQuery("#confirm_password").css("border-color", "#ba0c2f");
    jQuery("#error_confirm_password").show();
    jQuery("#error_confirm_password")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (password != confirm_password) {
      console.log(password, confirm_password);
      message += "<p>El password y confirmar password deben ser iguales</p>";
      jQuery("#confirm_password").css("border-color", "#ba0c2f");
      jQuery("#error_confirm_password").show();
      jQuery("#error_confirm_password")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_confirm_password").tooltip("hide");
      jQuery("#error_confirm_password").hide();
      jQuery("#confirm_password").css("border-color", "#cccccc");
    }
  }

  if (description_business_spanish == "") {
    message += "<p>La descripción en español es requerida</p>";
    jQuery("#description_business_spanish").css("border-color", "#ba0c2f");
    jQuery("#error_description_business_spanish").show();
    jQuery("#error_description_business_spanish")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (description_business_spanish.length > 1000) {
      message +=
        "<p>La descripción en español debe tener menos de 1000 caracteres</p>";
      jQuery("#description_business_spanish").css("border-color", "#ba0c2f");
      jQuery("#error_description_business_spanish").show();
      jQuery("#error_description_business_spanish")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_description_business_spanish").tooltip("hide");
      jQuery("#error_description_business_spanish").hide();
      jQuery("#description_business_spanish").css("border-color", "#cccccc");
    }
  }

  if (description_business_english == "") {
    message += "<p>La descripción en inglés es requerida</p>";
    jQuery("#description_business_english").css("border-color", "#ba0c2f");
    jQuery("#error_description_business_english").show();
    jQuery("#error_description_business_english")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (description_business_english.length > 1000) {
      message +=
        "<p>La descripción en inglés debe tener menos de 1000 caracteres</p>";
      jQuery("#description_business_english").css("border-color", "#ba0c2f");
      jQuery("#error_description_business_english").show();
      jQuery("#error_description_business_english")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_description_business_english").tooltip("hide");
      jQuery("#error_description_business_english").hide();
      jQuery("#description_business_english").css("border-color", "#cccccc");
    }
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
    jQuery("#loading").show();
    jQuery("#button").hide();
    var data = {
      logo: jQuery("#logo").prop("files")[0],
      business_name: jQuery("#business_name").val(),
      website: jQuery("#website").val(),
      video: jQuery("#video").val(),
      password: jQuery("#password").val(),
      description_business_spanish: jQuery(
        "#description_business_spanish"
      ).val(),
      description_business_english: jQuery(
        "#description_business_english"
      ).val(),
      nit: localStorage.getItem("nit"),
      email: localStorage.getItem("email"),
    };
    console.log(data);
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    fetch("/registro/create_step_1", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        if (response.status == 200) {
          jQuery("#tab2").addClass("active");
          jQuery("#content2").addClass("show active");
          jQuery("#tab1").removeClass("active");
          //Add class complete to tab 1
          jQuery("#tab1").addClass("complete");
          jQuery("#content1").removeClass("show active");
        } else {
          alert("Error al crear el usuario" + error);
        }
      })
      .catch(function (error) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        alert("Error al crear el usuario" + error);
      });
  }
}

/*
 *  Validate Form 2
 *  - production_chain is requerid
 *  - principal_code_ciiu is requerid
 *  - secondary_code_ciiu is optional
 *  - third_code_ciiu is optional
 *  - departament is requerid
 *  - city is requerid
 *  - business_model is requerid
 *  - certification_business is optional
 *  - certification_business_file is optional and have size less than 2mb
 */

function validateForm2() {
  var isValid = true;
  var message = "";
  var production_chain = jQuery("#production_chain").val();
  var principal_code_ciiu = jQuery("#principal_code_ciiu").val();
  var secondary_code_ciiu = jQuery("#secondary_code_ciiu").val();
  var third_code_ciiu = jQuery("#third_code_ciiu").val();
  var departament = jQuery("#departament").val();
  var city = jQuery("#city").val();
  var business_model = jQuery("#business_model").val();
  var certification_business = jQuery("#certification_business").val();
  var certification_business_file = jQuery("#certification_business_file").prop(
    "files"
  )[0];
  var certification_business_file_size_mb = Math.round(
    certification_business_file_size / 1024 / 1024
  );

  if (production_chain == "") {
    message += "<p>La cadena de producción es requerida</p>";
    jQuery("#production_chain").css("border-color", "#ba0c2f");
    jQuery("#error_production_chain").show();
    jQuery("#error_production_chain")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_production_chain").tooltip("hide");
    jQuery("#error_production_chain").hide();
    jQuery("#production_chain").css("border-color", "#cccccc");
  }
  if (principal_code_ciiu == "") {
    message += "<p>El código CIIU principal es requerido</p>";
    jQuery("#principal_code_ciiu").css("border-color", "#ba0c2f");
    jQuery("#error_principal_code_ciiu").show();
    jQuery("#error_principal_code_ciiu")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_principal_code_ciiu").tooltip("hide");
    jQuery("#error_principal_code_ciiu").hide();
    jQuery("#principal_code_ciiu").css("border-color", "#cccccc");
  }

  if (departament == "") {
    message += "<p>El departamento es requerido</p>";
    jQuery("#departament").css("border-color", "#ba0c2f");
    jQuery("#error_departament").show();
    jQuery("#error_departament")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_departament").tooltip("hide");
    jQuery("#error_departament").hide();
    jQuery("#departament").css("border-color", "#cccccc");
  }

  if (city == "") {
    message += "<p>La ciudad es requerida</p>";
    jQuery("#city").css("border-color", "#ba0c2f");
    jQuery("#error_city").show();
    jQuery("#error_city").attr("data-bs-original-title", "Foo").tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_city").tooltip("hide");
    jQuery("#error_city").hide();
    jQuery("#city").css("border-color", "#cccccc");
  }

  if (business_model == "") {
    message += "<p>El modelo de negocio es requerido</p>";
    jQuery("#business_model").css("border-color", "#ba0c2f");
    jQuery("#error_business_model").show();
    jQuery("#error_business_model")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_business_model").tooltip("hide");
    jQuery("#error_business_model").hide();
    jQuery("#business_model").css("border-color", "#cccccc");
  }
  if (certification_business != "") {
    if (certification_business_file_size_mb > 2) {
      message += "<p>El archivo de certificación debe ser menor a 2mb</p>";
      jQuery("#certification_business_file").css("border-color", "#ba0c2f");
      jQuery("#error_certification_business_file").show();
      jQuery("#error_certification_business_file")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_certification_business_file").tooltip("hide");
      jQuery("#error_certification_business_file").hide();
      jQuery("#certification_business_file").css("border-color", "#cccccc");
    }
  }

  return isValid;
}

/*
 * update data form 2 with nit
 *  - Send data and get nit of local storage
 * - If user is update hidde tab 2 and show tab 3
 */
function updateForm2() {
  if (validateForm2()) {
    jQuery("#loading").show();
    jQuery("#button").hide();
    var formData = new FormData();
    formData.append("production_chain", jQuery("#production_chain").val());
    formData.append(
      "principal_code_ciiu",
      jQuery("#principal_code_ciiu").val()
    );
    formData.append(
      "secondary_code_ciiu",
      jQuery("#secondary_code_ciiu").val()
    );
    formData.append("third_code_ciiu", jQuery("#third_code_ciiu").val());
    formData.append("departament", jQuery("#departament").val());
    formData.append("city", jQuery("#city").val());
    formData.append("business_model", jQuery("#business_model").val());
    formData.append(
      "certification_business",
      jQuery("#certification_business").val()
    );
    formData.append(
      "certification_business_file",
      jQuery("#certification_business_file").prop("files")[0]
    );
    formData.append("nit", localStorage.getItem("nit"));
    fetch("registro/update_step_2", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        if (response.status === 200) {
          //show alert information
          jQuery("#alert-information").show();
        } else {
          alert("Error al actualizar los datos");
        }
      })
      .catch(function (error) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        alert("Error al actualizar los datos");
      });
  }
}

// function to go to step 3
function goToStep3() {
  jQuery("#tab3").addClass("active");
  jQuery("#content3").addClass("show active");
  jQuery("#tab2").removeClass("active");
  //Add class complete to tab 1
  jQuery("#tab2").addClass("complete");
  jQuery("#content1").removeClass("show active");
}

/*
 *  Validate Form 3
 *  - name is required and have max length of 20
 *  - last_name is required and have max length of 20
 *  - position_spanish is required and have max length of 50
 *  - position_english is required and have max length of 50
 *  - country_code_landline is required
 *  - landline is required and is number and have max length of 20
 *  - country_code_mobile is required
 *  - mobile is required and is number and have max length of 20
 *  - contact_email is required and is email
 */
function validateForm3() {
  var isValid = true;
  var message = "";
  var name = jQuery("#name").val();
  var last_name = jQuery("#last_name").val();
  var position_spanish = jQuery("#position_spanish").val();
  var position_english = jQuery("#position_english").val();
  var country_code_landline = jQuery("#country_code_landline").val();
  var landline = jQuery("#landline").val();
  var country_code_mobile = jQuery("#country_code_mobile").val();
  var mobile = jQuery("#mobile").val();
  var contact_email = jQuery("#contact_email").val();

  if (name == "") {
    message += "<p>El nombre es requerido</p>";
    jQuery("#name").css("border-color", "#ba0c2f");
    jQuery("#error_name").show();
    jQuery("#error_name").attr("data-bs-original-title", "Foo").tooltip("show");
    isValid = false;
  } else {
    if (name.length > 20) {
      message += "<p>El nombre no debe tener mas de 20 caracteres</p>";
      jQuery("#name").css("border-color", "#ba0c2f");
      jQuery("#error_name").show();
      jQuery("#error_name")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_name").tooltip("hide");
      jQuery("#error_name").hide();
      jQuery("#name").css("border-color", "#cccccc");
    }
  }
  if (last_name == "") {
    message += "<p>El apellido es requerido</p>";
    jQuery("#last_name").css("border-color", "#ba0c2f");
    jQuery("#error_last_name").show();
    jQuery("#error_last_name")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (last_name.length > 20) {
      message += "<p>El apellido no debe tener mas de 20 caracteres</p>";
      jQuery("#last_name").css("border-color", "#ba0c2f");
      jQuery("#error_last_name").show();
      jQuery("#error_last_name")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_last_name").tooltip("hide");
      jQuery("#error_last_name").hide();
      jQuery("#last_name").css("border-color", "#cccccc");
    }
  }
  if (position_spanish == "") {
    message += "<p>La posición en español es requerida</p>";
    jQuery("#position_spanish").css("border-color", "#ba0c2f");
    jQuery("#error_position_spanish").show();
    jQuery("#error_position_spanish")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (position_spanish.length > 50) {
      message +=
        "<p>La posición en español no debe tener mas de 50 caracteres</p>";
      jQuery("#position_spanish").css("border-color", "#ba0c2f");
      jQuery("#error_position_spanish").show();
      jQuery("#error_position_spanish")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_position_spanish").tooltip("hide");
      jQuery("#error_position_spanish").hide();
      jQuery("#position_spanish").css("border-color", "#cccccc");
    }
  }
  if (position_english == "") {
    message += "<p>La posición en ingles es requerida</p>";
    jQuery("#position_english").css("border-color", "#ba0c2f");
    jQuery("#error_position_english").show();
    jQuery("#error_position_english")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (position_english.length > 50) {
      message +=
        "<p>La posición en ingles no debe tener mas de 50 caracteres</p>";
      jQuery("#position_english").css("border-color", "#ba0c2f");
      jQuery("#error_position_english").show();
      jQuery("#error_position_english")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_position_english").tooltip("hide");
      jQuery("#error_position_english").hide();
      jQuery("#position_english").css("border-color", "#cccccc");
    }
  }
  if (country_code_landline == "") {
    message += "<p>El codigo de pais de la linea de telefono es requerido</p>";
    jQuery("#country_code_landline").css("border-color", "#ba0c2f");
    jQuery("#error_country_code_landline").show();
    jQuery("#error_country_code_landline")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_country_code_landline").tooltip("hide");
    jQuery("#error_country_code_landline").hide();
    jQuery("#country_code_landline").css("border-color", "#cccccc");
  }
  if (landline == "") {
    message += "<p>La linea de telefono es requerida</p>";
    jQuery("#landline").css("border-color", "#ba0c2f");
    jQuery("#error_landline").show();
    jQuery("#error_landline")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (landline.length > 20) {
      message +=
        "<p>La linea de telefono no debe tener mas de 20 caracteres</p>";
      jQuery("#landline").css("border-color", "#ba0c2f");
      jQuery("#error_landline").show();
      jQuery("#error_landline")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      if (!landline.match(/^[0-9]+$/)) {
        message += "<p>La linea de telefono no debe tener letras</p>";
        jQuery("#landline").css("border-color", "#ba0c2f");
        jQuery("#error_landline").show();
        jQuery("#error_landline")
          .attr("data-bs-original-title", "Foo")
          .tooltip("show");
        isValid = false;
      } else {
        jQuery("#error_landline").tooltip("hide");
        jQuery("#error_landline").hide();
        jQuery("#landline").css("border-color", "#cccccc");
      }
    }
  }
  if (country_code_mobile == "") {
    message += "<p>El codigo de pais de la celular es requerido</p>";
    jQuery("#country_code_mobile").css("border-color", "#ba0c2f");
    jQuery("#error_country_code_mobile").show();
    jQuery("#error_country_code_mobile")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    jQuery("#error_country_code_mobile").tooltip("hide");
    jQuery("#error_country_code_mobile").hide();
    jQuery("#country_code_mobile").css("border-color", "#cccccc");
  }
  if (mobile == "") {
    message += "<p>El celular es requerido</p>";
    jQuery("#mobile").css("border-color", "#ba0c2f");
    jQuery("#error_mobile").show();
    jQuery("#error_mobile")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (mobile.length > 20) {
      message += "<p>El celular no debe tener mas de 20 caracteres</p>";
      jQuery("#mobile").css("border-color", "#ba0c2f");
      jQuery("#error_mobile").show();
      jQuery("#error_mobile")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      if (!mobile.match(/^[0-9]+$/)) {
        message += "<p>El celular no debe tener letras</p>";
        jQuery("#mobile").css("border-color", "#ba0c2f");
        jQuery("#error_mobile").show();
        jQuery("#error_mobile")
          .attr("data-bs-original-title", "Foo")
          .tooltip("show");
        isValid = false;
      } else {
        jQuery("#error_mobile").tooltip("hide");
        jQuery("#error_mobile").hide();
        jQuery("#mobile").css("border-color", "#cccccc");
      }
    }
  }
  if (contact_email == "") {
    message += "<p>El correo electronico es requerido</p>";
    jQuery("#email").css("border-color", "#ba0c2f");
    jQuery("#error_email").show();
    jQuery("#error_email")
      .attr("data-bs-original-title", "Foo")
      .tooltip("show");
    isValid = false;
  } else {
    if (
      !contact_email.match(
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      )
    ) {
      message += "<p>El correo electronico no es valido</p>";
      jQuery("#email").css("border-color", "#ba0c2f");
      jQuery("#error_email").show();
      jQuery("#error_email")
        .attr("data-bs-original-title", "Foo")
        .tooltip("show");
      isValid = false;
    } else {
      jQuery("#error_email").tooltip("hide");
      jQuery("#error_email").hide();
      jQuery("#email").css("border-color", "#cccccc");
    }
  }

  return isValid;
}

/*
 * update data form 3 with nit
 *  - Send data and get nit of local storage
 */
function updateDataForm3() {
  if (validateForm3()) {
    jQuery("#loading").show();
    jQuery("#button").hide();
    var data = {
      name: jQuery("#name").val(),
      last_name: jQuery("#last_name").val(),
      position_english: jQuery("#position_english").val(),
      country_code_landline: jQuery("#country_code_landline").val(),
      landline: jQuery("#landline").val(),
      country_code_mobile: jQuery("#country_code_mobile").val(),
      mobile: jQuery("#mobile").val(),
      contact_email: jQuery("#email").val(),
      nit: localStorage.getItem("nit"),
    };
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    fetch("/register/updateDataForm3", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        if (response.status === 200) {
          //show alert success
          jQuery("#alert-success").show();
        } else {
          alert("Error al actualizar los datos");
        }
      })
      .catch(function (error) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        alert("Error al actualizar los datos");
      });
  }
}

// function to go to step 3
function goToMenu() {
  window.location.href = "url_menu"
}