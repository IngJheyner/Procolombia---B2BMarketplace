/*
 * Service for Check NIT
 */
// open input file with button
function openInputFile() {
  jQuery("#logo").click();
}
// open input file with button
function openInputFileCertificate() {
  jQuery("#certificateFile").click();
}

// onChangeFileCertificate Show name and size
function onChangeCertificate() {
  var file = jQuery("#certificateFile")[0].files[0];
  var fileName = file.name;
  jQuery("#fileNameCertificate").html(fileName);
}

// Declaracion de Slect Especiales

var production_chain_select = new TomSelect("#production_chain", {
  create: false,
  sortField: {
    field: "text",
    direction: "asc"
  }
});

var departament_select = new TomSelect("#departament", {
  create: false,
  sortField: {
    field: "text",
    direction: "asc"
  }
});
var select_cities = new TomSelect("#ciudad", {
  valueField: 'id',
  labelField: 'title',
  searchField: 'title',
  options: [
    { id: 1, title: 'Seleccione una opción' },
  ],
  sortField: {
    field: "text",
    direction: "asc"
  },
  create: false
});
var modelo_de_negocio_select = new TomSelect("#modelo_de_negocio", {
  plugins: ['remove_button'],
  create: true,
  onItemAdd: function () {
    this.setTextboxValue('');
    this.refreshOptions();
  },
  render: {
    item: function (data, escape) {
      console.log(data)
      return '<div>' + escape(data.text) + '</div>';
    }
  }
});
var certificacion_de_empresa_select = new TomSelect("#certificacion_de_empresa", {
  plugins: ['remove_button'],
  create: true,
  create: false,
  onItemAdd: function () {
    this.setTextboxValue('');
    this.refreshOptions();
  },
  render: {
    item: function (data, escape) {
      return '<div>' + escape(data.text) + '</div>';
    }
  }
});
new TomSelect('#country_code_landline', {
  create: false,
  // use method disable()
  render: {
    option: function (data, escape) {
      return `<div><img class="me-2" src="${data.src}">${data.text}</div>`;
    },
    item: function (item, escape) {
      return `<div><img class="me-2" src="${item.src}">${item.text}</div>`;
    }
  }
})

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
  }
})
//
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
  jQuery("#logo_sub").hide();
}

// remove logo file and hide image
function removeLogo() {
  jQuery("#logo_img").hide();
  jQuery("#logo_name").hide();
  jQuery("#logo_img").attr("src", "");
  jQuery("#logo_name").val("");
  jQuery("#logo").val("");
  jQuery("#prew").hide();
  jQuery("#logo_sub").show();
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
    jQuery("#progressbar").css("background", "#ba0c2f");
    jQuery("#error_mensaje_pass").text("Debil");
  } else {
    if (progress === 50) {
      jQuery("#progressbar").css("background", "#fdca00");
      jQuery("#error_mensaje_pass").text("Normal");
    } else {
      if (progress === 75) {
        jQuery("#progressbar").css("background", "#0085ca");
        jQuery("#error_mensaje_pass").text("Buena");
      } else {
        if (progress === 100) {
          jQuery("#error_mensaje_pass").text("Fuerte");
          jQuery("#progressbar").css("background", "#31d394");
        }
      }
    }
  }
  jQuery("#progressbar").css("width", progress + "%");
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

//create tumbnail youtube
function createThumbnailYoutube() {
  //get video url
  var url = jQuery("#video").val();
  //validate is url youtube
  console.log(url)
  if (isUrlYoutube(url)) {
    let request_url = `https://youtube.com/oembed?url=${url}&format=json`;
    fetch(request_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        jQuery(".yotube").show();
        jQuery("#thumbnail").attr("src", data.thumbnail_url);
        jQuery("#title").text(data.title);
        jQuery("#author_name").text(data.author_name);
      })
      .catch((error) => {
        let message = "No se reonoco el video";
        jQuery("#error_video_message").text(message)
        jQuery("#video").css("border-color", "#ba0c2f");
        jQuery("#error_video").show();
        jQuery("#error_video")

          ;
      });
  } else {
    //show video error
    let message = "Url no es una url de youtube";
    jQuery("#video").css("border-color", "#ba0c2f");
    jQuery("#error_video_message").text(message)
    jQuery("#error_video").show();
    jQuery("#error_video")

      ;
  }
}

//fetch cities when departament changed and put options in select cities
function getCities(value = "") {
  //get departament
  var departament = jQuery("#departament").val();
  //put in form data
  var formData = new FormData();
  //put message of loading cities
  select_cities.clear();
  select_cities.clearOptions();
  formData.append("departament", departament);
  //fetch cities
  fetch("/get_cities", {
    method: "POST",
    body: formData,
  }).then((response) => response.json())
    .then((data) => {
      //put options in select cities
      select_cities.clearOptions();
      data.ciudades.map((ciudad) => {
        //create option inside select cities
        select_cities.addOption({
          id: ciudad.ID,
          title: ciudad.Name,
        });
      });
      if (value !== "")
        select_cities.setValue(value);
    })
    .catch((error) => {
      console.log(error);
    })
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
  var description_business_english = jQuery(
    "#description_business_english"
  ).val();

  var message = "";
  var isValid = true;
  if (logo == undefined) {
    message =
      "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
    jQuery("#logo_input").css("border-color", "#ba0c2f");
    jQuery("#logo_name").css("border-color", "#ba0c2f");
    jQuery("#error_logo_message").text(message)
    jQuery("#error_logo").show();
    jQuery("#error_logo");
    isValid = false;
  } else {
    var file = logo.type;
    var fileSize = logo.size;
    var fileName = logo.name;
    var fileExtension = fileName.split(".").pop();
    if (fileExtension != "png" && fileExtension != "jpg") {
      message =
        "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
      jQuery("#logo_input").css("border-color", "#ba0c2f");
      jQuery("#logo_name").css("border-color", "#ba0c2f");
      jQuery("#error_logo_message").text(message)
      jQuery("#error_logo").show();
      jQuery("#error_logo")

        ;
      isValid = false;
    } else {
      if (fileSize > 2000000) {
        message =
          "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
        jQuery("#logo_input").css("border-color", "#ba0c2f");
        jQuery("#logo_name").css("border-color", "#ba0c2f");
        jQuery("#error_logo_message").text(message)
        jQuery("#error_logo").show();
        jQuery("#error_logo")

          ;
        isValid = false;
      } else {
        if (logo.width > 200 || logo.height > 200) {
          message =
            "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
          jQuery("#logo_input").css("border-color", "#ba0c2f");
          jQuery("#logo_name").css("border-color", "#ba0c2f");
          jQuery("#error_logo_message").text(message)
          jQuery("#error_logo").show();
          jQuery("#error_logo")

            ;
          isValid = false;
        } else {
          jQuery("#error_logo").hide();
          jQuery("#logo_name").css("border-color", "#cccccc");
          jQuery("#logo_input").css("border-color", "#cccccc");
        }
      }
    }
  }

  if (business_name == "") {
    message = "El nombre de la empresa es requerido";
    jQuery("#business_name").css("border-color", "#ba0c2f");
    jQuery("#error_business_name_message").text(message)
    jQuery("#error_business_name").show();
    jQuery("#error_business_name")

      ;
    isValid = false;
  } else {
    if (business_name.length > 100) {
      message =
        "El nombre de la empresa no puede tener mas de 100 caracteres";
      jQuery("#business_name").css("border-color", "#ba0c2f");
      jQuery("#error_business_name_message").text(message)
      jQuery("#error_business_name").show();
      jQuery("#error_business_name")

        ;
      isValid = false;
    } else {
      jQuery("#error_business_name").hide();
      jQuery("#business_name").css("border-color", "#cccccc");
    }
  }

  if (website == "") {
    message = "El website es requerido";
    jQuery("#website").css("border-color", "#ba0c2f");
    jQuery("#error_website_message").text(message)
    jQuery("#error_website").show();
    jQuery("#error_website")

      ;
    isValid = false;
  } else {
    if (!isUrl(website)) {
      message = "El website no es valido";
      jQuery("#website").css("border-color", "#ba0c2f");
      jQuery("#error_website_message").text(message)
      jQuery("#error_website").show();
      jQuery("#error_website")

        ;
      isValid = false;
    } else {
      jQuery("#error_website").hide();
      jQuery("#website").css("border-color", "#cccccc");
    }
  }

  if (video != "") {
    if (!isUrlYoutube(video)) {
      message = "El video es requerido y debe ser una url";
      jQuery("#video").css("border-color", "#ba0c2f");
      jQuery("#error_video").show();
      jQuery("#error_video_message").text(message)
      isValid = false;
    } else {
      jQuery("#error_video").hide();
      jQuery("#video").css("border-color", "#cccccc");
    }
  } else {
    jQuery("#error_video").hide();
    jQuery("#video").css("border-color", "#cccccc");
  }

  if (password == "") {
    message = "El password es requerido";
    jQuery("#password").css("border-color", "#ba0c2f");
    jQuery("#error_password_message").text(message)
    jQuery("#error_password").show();
    isValid = false;
  } else {
    if (password.length < 8) {
      message = "El password debe tener entre 8 y 15 caracteres";
      jQuery("#password").css("border-color", "#ba0c2f");
      jQuery("#error_password_message").text(message)
      jQuery("#error_password").show();
      isValid = false;
    } else {
      if (!password.match(/[A-Z]/)) {
        message = "El password debe tener al menos una mayúscula";
        jQuery("#password").css("border-color", "#ba0c2f");
        jQuery("#error_password_message").text(message)
        jQuery("#error_password").show();
        isValid = false;
      } else {
        if (!password.match(/[0-9]/)) {
          message = "El password debe tener al menos un número";
          jQuery("#password").css("border-color", "#ba0c2f");
          jQuery("#error_password_message").text(message)
          jQuery("#error_password").show();
          jQuery("#error_password")

            ;
          isValid = false;
        } else {
          if (!password.match(/[^a-zA-Z0-9]/)) {
            message =
              "El password debe tener al menos un caracter especial";
            jQuery("#password").css("border-color", "#ba0c2f");
            jQuery("#error_password_message").text(message)
            jQuery("#error_password").show();
            jQuery("#error_password")

              ;
            isValid = false;
          } else {
            jQuery("#error_password").hide();
            jQuery("#password").css("border-color", "#cccccc");
          }
        }
      }
    }
  }

  if (confirm_password == "") {
    message = "El campo verificar contraseña es requerido";
    jQuery("#confirm_password").css("border-color", "#ba0c2f");
    jQuery("#error_confirm_password_message").text(message)
    jQuery("#error_confirm_password").show();
    isValid = false;
  } else {
    if (password != confirm_password) {
      console.log(password, confirm_password);
      message = "El campo verificar contraseña y Contraseña deben ser iguales";
      jQuery("#confirm_password").css("border-color", "#ba0c2f");
      jQuery("#error_confirm_password_message").text(message)
      jQuery("#error_confirm_password").show();
      isValid = false;
    } else {
      jQuery("#error_confirm_password").hide();
      jQuery("#confirm_password").css("border-color", "#cccccc");
    }
  }

  if (description_business_spanish == "") {
    message = "La descripción en español es requerida";
    jQuery("#description_business_spanish").css("border-color", "#ba0c2f");
    jQuery("#description_business_spanish_message").text(message)
    jQuery("#error_description_business_spanish").show();
    isValid = false;
  } else {
    if (description_business_spanish.length > 1000) {
      message =
        "La descripción en español debe tener menos de 1000 caracteres";
      jQuery("#description_business_spanish").css("border-color", "#ba0c2f");
      jQuery("#description_business_spanish_message").text(message)
      jQuery("#error_description_business_spanish").show();
      isValid = false;
    } else {
      jQuery("#error_description_business_spanish").hide();
      jQuery("#description_business_spanish").css("border-color", "#cccccc");
    }
  }

  if (description_business_english == "") {
    message = "La descripción en inglés es requerida";
    jQuery("#description_business_english").css("border-color", "#ba0c2f");
    jQuery("#description_business_english_message").text(message)
    jQuery("#error_description_business_english").show();
    isValid = false;
  } else {
    if (description_business_english.length > 1000) {
      message =
        "La descripción en inglés debe tener menos de 1000 caracteres";
      jQuery("#description_business_english").css("border-color", "#ba0c2f");
      jQuery("#description_business_english_message").text(message)
      jQuery("#error_description_business_english").show();
      isValid = false;
    } else {
      console.log(description_business_english)
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
          jQuery("#profile-tab").addClass("active");
          jQuery("#profile-tab-pane").addClass("show active");
          jQuery("#home-tab").removeClass("active");
          //Add class complete to tab 1
          jQuery("#svg_home").hide();
          jQuery("#home_title").hide();
          jQuery("#check_home_tab").show();
          jQuery("#profile_title").show();
          jQuery("#validate_progresss").css("width", "66.66%");
          jQuery("#home-tab").addClass("complete");
          jQuery("#home-tab-pane").removeClass("show active");
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
 *  - ciudad is requerid
 *  - modelo_de_negocio is requerid
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
  var ciudad = jQuery("#ciudad").val();
  var modelo_de_negocio = jQuery("#modelo_de_negocio").val();
  var certification_business = jQuery("#certification_business").val();
  var certification_business_file = jQuery("#certificateFile").prop(
    "files"
  )[0];

  if (production_chain == "") {
    console.log("hola");
    message = "La cadena de producción es requerida";
    jQuery("#production_chain_contain .ts-control").css("border-color", "#ba0c2f");
    jQuery("#error_production_chain_message").text(message)
    jQuery("#error_production_chain").show();
    isValid = false;
  } else {
    jQuery("#error_production_chain").hide();
    jQuery("#production_chain_contain .ts-control").css("border-color", "#cccccc");
  }
  if (principal_code_ciiu == "") {
    message = "El código CIIU principal es requerido";
    jQuery("#principal_code_ciiu").css("border-color", "#ba0c2f");
    jQuery("#error_principal_code_ciiu").show();
    jQuery("#error_principal_code_ciiu_message").text(message)

    isValid = false;
  } else {
    jQuery("#error_principal_code_ciiu").hide();
    jQuery("#principal_code_ciiu").css("border-color", "#cccccc");
  }

  if (departament == "") {
    message = "El departamento es requerido";
    jQuery("#departament_contain .ts-control").css("border-color", "#ba0c2f");
    jQuery("#error_departament_message").text(message)
    jQuery("#error_departament").show();
    isValid = false;
  } else {
    jQuery("#error_departament").hide();
    jQuery("#departament_contain .ts-control").css("border-color", "#cccccc");
  }

  if (ciudad == "") {
    message = "La ciudad es requerida";
    jQuery("#ciudad_contain .ts-control").css("border-color", "#ba0c2f");
    jQuery("#error_ciudad").show();
    isValid = false;
  } else {
    jQuery("#error_ciudad").hide();
    jQuery("#ciudad_contain .ts-control").css("border-color", "#cccccc");
  }

  if (modelo_de_negocio == "") {
    message = "El modelo de negocio es requerido";
    jQuery("#modelo_de_negocio_contain .ts-control").css("border-color", "#ba0c2f");
    jQuery("#error_modelo_de_negocio_message").text(message)
    jQuery("#error_modelo_de_negocio").show();
    isValid = false;
  } else {
    jQuery("#error_modelo_de_negocio").hide();
    jQuery("#modelo_de_negocio_contain .ts-control").css("border-color", "#cccccc");
  }
  if (certification_business != "") {
    if ((certification_business_file.size / 1024 / 1024) > 2) {
      message = "El archivo de certificación debe ser menor a 2mb";
      jQuery("#certificateFile").css("border-color", "#ba0c2f");
      jQuery("#error_certification_business_file").show();
      jQuery("#error_certification_business_file")

        ;
      isValid = false;
    } else {
      //check is pdf
      if (certification_business_file.type != "application/pdf") {
        message = "El archivo de certificación debe ser un archivo PDF";
        jQuery("#certificateFile").css("border-color", "#ba0c2f");
        jQuery("#error_certification_business_file").show();
        jQuery("#error_certification_business_file").text(message);
        isValid = false;
      } else {
        jQuery("#error_certification_business_file").hide();
        jQuery("#certificateFile").css("border-color", "#cccccc");
      }
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
    formData.append("ciudad", jQuery("#ciudad").val());
    formData.append("modelo_de_negocio", jQuery("#modelo_de_negocio").val());
    formData.append(
      "certification_business",
      jQuery("#certificacion_de_empresa").val()
    );
    formData.append(
      "certification_business_file",
      jQuery("#certificateFile").prop("files")[0]
    );
    formData.append("nit", localStorage.getItem("nit"));
    //principal_advisor add
    formData.append("principal_advisor", jQuery("#principal_advisor").val());
    fetch("/registro/update_step_2", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        jQuery("#loading").hide();
        jQuery("#button").show();
        if (response.status === 200) {
          //show alert information
          jQuery("#check_information").modal('show');
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
  jQuery("#contact-tab").addClass("active");
  jQuery("#contact-tab-pane").addClass("show active");
  jQuery("#profile-tab").removeClass("active");
  jQuery("#profile-tab").addClass("complete");
  jQuery("#profile-tab-pane").removeClass("show active");
  jQuery("#check_information").modal('hide');
  //Add class complete to tab 3
  jQuery("#svg_profile").hide();
  jQuery("#profile_title").hide();
  jQuery("#check_profile_tab").show();
  jQuery("#contact_title").show();
  jQuery("#validate_progresss").css("width", "100%");

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
    message = "El nombre es requerido";
    jQuery("#name").css("border-color", "#ba0c2f");
    jQuery("#error_name").show();
    jQuery("#error_name_message").text(message)
    isValid = false;
  } else {
    if (name.length > 20) {
      message = "El nombre no debe tener mas de 20 caracteres";
      jQuery("#name").css("border-color", "#ba0c2f");
      jQuery("#error_name_message").text(message)
      jQuery("#error_name").show();
      isValid = false;
    } else {
      jQuery("#error_name").hide();
      jQuery("#name").css("border-color", "#cccccc");
    }
  }
  if (last_name == "") {
    message = "El apellido es requerido";
    jQuery("#last_name").css("border-color", "#ba0c2f");
    jQuery("#error_last_name").show();
    jQuery("#error_last_name_message").text(message)
    isValid = false;
  } else {
    if (last_name.length > 20) {
      message = "El apellido no debe tener mas de 20 caracteres";
      jQuery("#last_name").css("border-color", "#ba0c2f");
      jQuery("#error_last_name_message").text(message)
      jQuery("#error_last_name").show();
      jQuery("#error_last_name")

        ;
      isValid = false;
    } else {
      jQuery("#error_last_name").hide();
      jQuery("#last_name").css("border-color", "#cccccc");
    }
  }
  if (position_spanish == "") {
    message = "La posición en español es requerida";
    jQuery("#position_spanish").css("border-color", "#ba0c2f");
    jQuery("#error_position_spanish_message").text(message)
    jQuery("#error_position_spanish").show();
    isValid = false;
  } else {
    if (position_spanish.length > 50) {
      message =
        "La posición en español no debe tener mas de 50 caracteres";
      jQuery("#position_spanish").css("border-color", "#ba0c2f");
      jQuery("#error_position_spanish_message").text(message)
      jQuery("#error_position_spanish").show();

      isValid = false;
    } else {
      jQuery("#error_position_spanish").hide();
      jQuery("#position_spanish").css("border-color", "#cccccc");
    }
  }
  if (position_english == "") {
    message = "La posición en ingles es requerida";
    jQuery("#position_english").css("border-color", "#ba0c2f");
    jQuery("#error_position_english_message").text(message)
    jQuery("#error_position_english").show();
    jQuery("#error_position_english")

      ;
    isValid = false;
  } else {
    if (position_english.length > 50) {
      message =
        "La posición en ingles no debe tener mas de 50 caracteres";
      jQuery("#position_english").css("border-color", "#ba0c2f");
      jQuery("#error_position_english_message").text(message)
      jQuery("#error_position_english").show();

      isValid = false;
    } else {
      jQuery("#error_position_english").hide();
      jQuery("#position_english").css("border-color", "#cccccc");
    }
  }
  if (country_code_landline == "") {
    message = "El codigo de pais de la linea de telefono es requerido";
    jQuery("#country_code_landline").css("border-color", "#ba0c2f");
    jQuery("#error_country_code_landline").show();
    jQuery("#error_country_code_landline")

      ;
    isValid = false;
  } else {
    jQuery("#error_country_code_landline").hide();
    jQuery("#country_code_landline").css("border-color", "#cccccc");
  }
  if (landline == "") {
    message = "La linea de telefono es requerida";
    jQuery("#landline").css("border-color", "#ba0c2f");
    jQuery("#error_landline").show();
    jQuery("#error_landline")

      ;
    isValid = false;
  } else {
    if (landline.length > 20) {
      message =
        "La linea de telefono no debe tener mas de 20 caracteres";
      jQuery("#landline").css("border-color", "#ba0c2f");
      jQuery("#error_landline").show();
      jQuery("#error_landline")

        ;
      isValid = false;
    } else {
      if (!landline.match(/^[0-9]+$/)) {
        message = "La linea de telefono no debe tener letras";
        jQuery("#landline").css("border-color", "#ba0c2f");
        jQuery("#error_landline").show();
        jQuery("#error_landline")

          ;
        isValid = false;
      } else {
        jQuery("#error_landline").hide();
        jQuery("#landline").css("border-color", "#cccccc");
      }
    }
  }
  if (country_code_mobile == "") {
    message = "El codigo de pais de la celular es requerido";
    jQuery("#country_code_mobile").css("border-color", "#ba0c2f");
    jQuery("#error_country_code_mobile").show();
    jQuery("#error_country_code_mobile")

      ;
    isValid = false;
  } else {
    jQuery("#error_country_code_mobile").hide();
    jQuery("#country_code_mobile").css("border-color", "#cccccc");
  }
  if (mobile == "") {
    message = "El celular es requerido";
    jQuery("#mobile").css("border-color", "#ba0c2f");
    jQuery("#error_mobile").show();
    jQuery("#error_mobile")

      ;
    isValid = false;
  } else {
    if (mobile.length > 20) {
      message = "El celular no debe tener mas de 20 caracteres";
      jQuery("#mobile").css("border-color", "#ba0c2f");
      jQuery("#error_mobile").show();
      jQuery("#error_mobile")

        ;
      isValid = false;
    } else {
      if (!mobile.match(/^[0-9]+$/)) {
        message = "El celular no debe tener letras";
        jQuery("#mobile").css("border-color", "#ba0c2f");
        jQuery("#error_mobile").show();
        jQuery("#error_mobile")

          ;
        isValid = false;
      } else {
        jQuery("#error_mobile").hide();
        jQuery("#mobile").css("border-color", "#cccccc");
      }
    }
  }
  if (contact_email == "") {
    message = "El correo electronico es requerido";
    jQuery("#email").css("border-color", "#ba0c2f");
    jQuery("#error_email").show();
    jQuery("#error_email")

      ;
    isValid = false;
  } else {
    if (
      !contact_email.match(
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      )
    ) {
      message = "El correo electronico no es valido";
      jQuery("#email").css("border-color", "#ba0c2f");
      jQuery("#error_email").show();
      jQuery("#error_email")

        ;
      isValid = false;
    } else {
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
      position_spanish: jQuery("#position_spanish").val(),
      position_english: jQuery("#position_english").val(),
      country_code_landline: jQuery("#country_code_landline").val(),
      landline: jQuery("#landline").val(),
      country_code_mobile: jQuery("#country_code_mobile").val(),
      mobile: jQuery("#mobile").val(),
      contact_email: jQuery("#contact_email").val(),
      nit: localStorage.getItem("nit"),
    };
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    fetch("/registro/update_step_3", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        if (response.status === 200) {
          //show alert success
          jQuery("#success_modal").modal('show');
          //clean local storage
          localStorage.clear();
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
  window.location.href = "/dashboard/col/user"
}

//Addtional functional methods

/*
* check step in local storage and change tab with cases switch
*/
function goBackTab(step) {
  switch (step) {
    case 1:
      jQuery("#profile-tab").removeClass("active");
      jQuery("#profile-tab-pane").removeClass("show active");
      jQuery("#home-tab").addClass("active");
      //Add class complete to tab 1
      jQuery("#svg_home").show();
      jQuery("#home_title").show();
      jQuery("#check_home_tab").hide();
      jQuery("#profile_title").hide();
      jQuery("#validate_progresss").css("width", "33.33%");
      jQuery("#home-tab").removeClass("complete");
      jQuery("#home-tab-pane").addClass("show active");
      break;
    case 2:
      jQuery("#contact-tab").removeClass("active");
      jQuery("#contact-tab-pane").removeClass("show active");
      jQuery("#profile-tab").addClass("active");
      //Add class complete to tab 1
      jQuery("#svg_profile").show();
      jQuery("#profile_title").show();
      jQuery("#check_profile_tab").hide();
      jQuery("#contact_title").hide();
      jQuery("#validate_progresss").css("width", "66.66%");
      jQuery("#profile-tab").removeClass("complete");
      jQuery("#profile-tab-pane").addClass("show active");
      break;
  }
}


/*
* open modal to cancel process
*/
function cancelProcess() {
  jQuery("#cancel_modal").modal('show');
}
function hideCancelProcess() {
  jQuery("#cancel_modal").modal('hide');
}

/*
* delete user by fecth /delete_user
*/

function deleteUser() {
  jQuery("#loading").show();
  jQuery("#button").hide();
  var data = {
    nit: localStorage.getItem("nit"),
  };
  var formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }

  fetch("/delete_user", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      if (response.status === 200) {
        //show alert success
        //redirect to pre-registro
        window.location.href = "/pre-registro";
      } else {
        alert("Error al eliminar el usuario");
      }
    })
    .catch(function (error) {
      jQuery("#loading").hide();
      jQuery("#button").show();
      alert("Error al eliminar el usuario");
    });
}

/*
* check if nit and email and data_neo is set in local storage and if not redirect to pre-registro
*/
function checkDataNeo() {
  if (localStorage.getItem("nit") == null || localStorage.getItem("email") == null || localStorage.getItem("data_neo") == null) {
    window.location.href = "/pre-registro";
  }
}
checkDataNeo();

/*
* get data of user if not return 200 status code, use data_neo to fill form in other case fill form with data of user and show tab base in step + 1
*/
function getDataUser() {
  var data = {
    nit: localStorage.getItem("nit"),
  };
  var formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }

  fetch("/get_user", {
    method: "POST",
    body: formData,
  }).then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        //show alert success
        //redirect to pre-registro
        //fill form with data of user
        fillFormWithDataUser(data.data);
        //show tab base in step
        showTabBase(data.data.step);
      } else {
        //fill form with data_neo
        fillFormWithDataNeo();
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

/*
* fill form with data of user
*/
function fillFormWithDataUser(data) {
  jQuery("#business_name").val(data.business_name);
  jQuery("#empresa_popup").text(data.business_name);
  jQuery("#website").val(data.website);
  jQuery("#video").val(data.video);
  jQuery("#description_business_spanish").val(data.description_spanish);
  jQuery("#description_business_english").val(data.description_english);

  production_chain_select.setValue(data.production_chain);
  departament_select.setValue(data.departament);
  getCities(data.ciudad); 
  modelo_de_negocio_select.setValue([data.modelo_de_negocio]);
  certificacion_de_empresa_select.setValue(data.certification_business);
  jQuery("#principal_code_ciiu").val(data.principal_code_ciiu);
  jQuery("#secondary_code_ciiu").val(data.secondary_code_ciiu);
  jQuery("#third_code_ciiu").val(data.third_code_ciiu);
}

/*
* fill form with data of neo
*/
function fillFormWithDataNeo() {
  console.log("loggin with neo");
  let data_neo = JSON.parse(localStorage.getItem("data_neo"));
  //fill nit and bussines_name and landline
  jQuery("#nit").val(data_neo.nit);
  jQuery("#business_name").val(data_neo.nombre);
  jQuery("#empresa_popup").text(data_neo.nombre);
  jQuery("#landline").val(data_neo.telefono);
  jQuery("#contact_email").val(data_neo.correo);
}


/*
* show tab base in step
*/
function showTabBase(stepData) {
  console.log(": " + stepData);
  let step = parseInt(stepData);
  switch (step) {
    case 1:
      jQuery("#profile-tab").addClass("active");
      jQuery("#profile-tab-pane").addClass("show active");
      jQuery("#home-tab").removeClass("active");
      //Add class complete to tab 1
      jQuery("#svg_home").hide();
      jQuery("#home_title").hide();
      jQuery("#check_home_tab").show();
      jQuery("#profile_title").show();
      jQuery("#validate_progresss").css("width", "66.66%");
      jQuery("#home-tab").addClass("complete");
      jQuery("#home-tab-pane").removeClass("show active");
      break;
    case 2:
      jQuery("#contact-tab").addClass("active");
      jQuery("#contact-tab-pane").addClass("show active");
      jQuery("#home-tab").removeClass("active");
      //Add class complete to tab 1
      jQuery("#svg_home").hide();
      jQuery("#svg_profile").hide();
      jQuery("#home_title").hide();
      jQuery("#check_home_tab").show();
      jQuery("#check_profile_tab").show();
      jQuery("#contact_title").show();
      jQuery("#validate_progresss").css("width", "100%");
      jQuery("#home-tab").addClass("complete");
      jQuery("#profile-tab").addClass("complete");
      jQuery("#home-tab-pane").removeClass("show active");
      break;
  }

}

// call getDataUser function
getDataUser();