/*
 * Service for Register
 */

// open input file with button
(function ($, Drupal) {
  'use strict';
  //Global variables
  var production_chain_select;
  var departament_select;
  var select_cities;
  var modelo_de_negocio_select;
  var certificacion_de_empresa_select;
  //set NIT
  var NIT = localStorage.getItem("nit");
  //initial config
  function init() {
    // Initalize select2
    production_chain_select = new TomSelect("#production_chain", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });

    departament_select = new TomSelect("#departament", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });

    select_cities = new TomSelect("#ciudad", {
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

    modelo_de_negocio_select = new TomSelect("#modelo_de_negocio", {
      plugins: ['remove_button'],
      create: true,
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

    certificacion_de_empresa_select = new TomSelect("#certificacion_de_empresa", {
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
      },
    })

    document.getElementById("country_code_landline-ts-control").disabled = true;
    document.getElementById("country_code_mobile-ts-control").disabled = true;
    $("#country_code_landline-ts-control").attr('style', 'display: none !important');
    $("#country_code_mobile-ts-control").attr('style', 'display: none !important');


    $("#nit").val(NIT);
    //get data neo
    checkDataNeo();
    // call getDataUser function
    getDataUser();
  }
  // open input file with button
  function openInputFile() {
    $("#logo").click();
  }
  // open input file with button
  function openInputFileCertificate() {
    $("#certificateFile").click();
  }

  // onChangeFileCertificate Show name and size
  function onChangeCertificate() {
    var file = $("#certificateFile")[0].files[0];
    var fileName = file.name;
    $("#fileNameCertificate").text(fileName);
  }

  // onChangeFile Show Logo and name
  function onChangeLogo() {
    // get file
    var file = $("#logo")[0].files[0];
    // get file name
    var fileName = file.name;
    // get file size in kb
    var fileSize = file.size / 1024;
    // get url temp
    var url = URL.createObjectURL(file);
    // show image
    $("#logo_img").attr("src", url);
    $("#logo_img").show();
    $("#logo_name").val(fileName + "(" + fileSize.toFixed(2) + "KB)");
    $("#logo_name").show();
    $("#prew").show();
    $("#logo_sub").hide();
  }

  // close thumbnail 
  function closeThumbnail() {
    $(".yotube").hide();
  }

  // remove logo file and hide image
  function removeLogo() {
    $("#logo_img").hide();
    $("#logo_name").hide();
    $("#logo_img").attr("src", "");
    $("#logo_name").val("");
    $("#logo").val("");
    $("#prew").hide();
    $("#logo_sub").show();
  }

  // toggle password to text
  function passwordToText() {
    $("#password").attr("type", "text");
    $("#confirm_password").attr("type", "text");
    $("#pass_show").hide();
    $("#pass_show_confirm").hide();
    $("#pass_bloq").show();
    $("#pass_bloq_confirm").show();
  }

  // toggle password to text
  function textToPassword() {
    $("#password").attr("type", "password");
    $("#confirm_password").attr("type", "password");
    $("#pass_show").show();
    $("#pass_show_confirm").show();
    $("#pass_bloq").hide();
    $("#pass_bloq_confirm").hide();
  }

  // progress bar
  function valueProgressBar() {
    var password = $("#password").val();
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
    var url = $("#video").val();
    //validate is url youtube
    if (isUrlYoutube(url)) {
      let request_url = `https://youtube.com/oembed?url=${url}&format=json`;
      fetch(request_url)
        .then((response) => response.json())
        .then((data) => {
          $(".yotube").show();
          $("#thumbnail").attr("src", data.thumbnail_url);
          $("#title").text(data.title);
          $("#author_name").text(data.author_name);
        })
        .catch((error) => {
          let message = "No se reonoco el video";
          $("#error_video_message").text(message)
          $("#video").css("border-color", "#ba0c2f");
          $("#error_video").show();
          $("#error_video")

            ;
        });
    } else {
      //show video error
      let message = "Url no es una url de youtube";
      $("#video").css("border-color", "#ba0c2f");
      $("#error_video_message").text(message)
      $("#error_video").show();
      $("#error_video")

        ;
    }
  }

  //fetch cities when departament changed and put options in select cities
  function getCities(value = "") {
    //get departament
    var departament = $("#departament").val();
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
        alert(error);
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
    var logo = $("#logo").prop("files")[0];
    var business_name = $("#business_name").val();
    var website = $("#website").val();
    var video = $("#video").val();
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();
    var description_business_spanish = $(
      "#description_business_spanish"
    ).val();
    var description_business_english = $(
      "#description_business_english"
    ).val();

    var message = "";
    var isValid = true;
    if (logo == undefined) {
      message =
        "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
      $("#logo_input").css("border-color", "#ba0c2f");
      $("#logo_name").css("border-color", "#ba0c2f");
      $("#error_logo_message").text(message)
      $("#error_logo").show();
      $("#error_logo");
      isValid = false;
    } else {
      var file = logo.type;
      var fileSize = logo.size;
      var fileName = logo.name;
      var fileExtension = fileName.split(".").pop();
      if (fileExtension != "png" && fileExtension != "jpg") {
        message =
          "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
        $("#logo_input").css("border-color", "#ba0c2f");
        $("#logo_name").css("border-color", "#ba0c2f");
        $("#error_logo_message").text(message)
        $("#error_logo").show();
        $("#error_logo")

          ;
        isValid = false;
      } else {
        if (fileSize > 2000000) {
          message =
            "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
          $("#logo_input").css("border-color", "#ba0c2f");
          $("#logo_name").css("border-color", "#ba0c2f");
          $("#error_logo_message").text(message)
          $("#error_logo").show();
          $("#error_logo")

            ;
          isValid = false;
        } else {
          if (logo.width > 200 || logo.height > 200) {
            message =
              "Se requiere que el logotipo sea un archivo de imagen y que sea png y jpg y que tenga un tamaño inferior a 2MB y una dimensión inferior a 200x200\n";
            $("#logo_input").css("border-color", "#ba0c2f");
            $("#logo_name").css("border-color", "#ba0c2f");
            $("#error_logo_message").text(message)
            $("#error_logo").show();
            $("#error_logo")

              ;
            isValid = false;
          } else {
            $("#error_logo").hide();
            $("#logo_name").css("border-color", "#cccccc");
            $("#logo_input").css("border-color", "#cccccc");
          }
        }
      }
    }

    if (business_name == "") {
      message = "El nombre de la empresa es requerido";
      $("#business_name").css("border-color", "#ba0c2f");
      $("#error_business_name_message").text(message)
      $("#error_business_name").show();
      $("#error_business_name")

        ;
      isValid = false;
    } else {
      if (business_name.length > 100) {
        message =
          "El nombre de la empresa no puede tener mas de 100 caracteres";
        $("#business_name").css("border-color", "#ba0c2f");
        $("#error_business_name_message").text(message)
        $("#error_business_name").show();
        $("#error_business_name")

          ;
        isValid = false;
      } else {
        $("#error_business_name").hide();
        $("#business_name").css("border-color", "#cccccc");
      }
    }

    if (website == "") {
      message = "El website es requerido";
      $("#website").css("border-color", "#ba0c2f");
      $("#error_website_message").text(message)
      $("#error_website").show();
      $("#error_website")

        ;
      isValid = false;
    } else {
      if (!isUrl(website)) {
        message = "El website no es valido";
        $("#website").css("border-color", "#ba0c2f");
        $("#error_website_message").text(message)
        $("#error_website").show();
        $("#error_website")

          ;
        isValid = false;
      } else {
        $("#error_website").hide();
        $("#website").css("border-color", "#cccccc");
      }
    }

    if (video != "") {
      if (!isUrlYoutube(video)) {
        message = "El video es requerido y debe ser una url";
        $("#video").css("border-color", "#ba0c2f");
        $("#error_video").show();
        $("#error_video_message").text(message)
        isValid = false;
      } else {
        $("#error_video").hide();
        $("#video").css("border-color", "#cccccc");
      }
    } else {
      $("#error_video").hide();
      $("#video").css("border-color", "#cccccc");
    }

    if (password == "") {
      message = "El password es requerido";
      $("#password").css("border-color", "#ba0c2f");
      $("#error_password_message").text(message)
      $("#error_password").show();
      isValid = false;
    } else {
      if (password.length < 8) {
        message = "El password debe tener entre 8 y 15 caracteres";
        $("#password").css("border-color", "#ba0c2f");
        $("#error_password_message").text(message)
        $("#error_password").show();
        isValid = false;
      } else {
        if (!password.match(/[A-Z]/)) {
          message = "El password debe tener al menos una mayúscula";
          $("#password").css("border-color", "#ba0c2f");
          $("#error_password_message").text(message)
          $("#error_password").show();
          isValid = false;
        } else {
          if (!password.match(/[0-9]/)) {
            message = "El password debe tener al menos un número";
            $("#password").css("border-color", "#ba0c2f");
            $("#error_password_message").text(message)
            $("#error_password").show();
            $("#error_password")

              ;
            isValid = false;
          } else {
            if (!password.match(/[^a-zA-Z0-9]/)) {
              message =
                "El password debe tener al menos un caracter especial";
              $("#password").css("border-color", "#ba0c2f");
              $("#error_password_message").text(message)
              $("#error_password").show();
              $("#error_password")

                ;
              isValid = false;
            } else {
              $("#error_password").hide();
              $("#password").css("border-color", "#cccccc");
            }
          }
        }
      }
    }

    if (confirm_password == "") {
      message = "El campo verificar contraseña es requerido";
      $("#confirm_password").css("border-color", "#ba0c2f");
      $("#error_confirm_password_message").text(message)
      $("#error_confirm_password").show();
      isValid = false;
    } else {
      if (password != confirm_password) {
        message = "El campo verificar contraseña y Contraseña deben ser iguales";
        $("#confirm_password").css("border-color", "#ba0c2f");
        $("#error_confirm_password_message").text(message)
        $("#error_confirm_password").show();
        isValid = false;
      } else {
        $("#error_confirm_password").hide();
        $("#confirm_password").css("border-color", "#cccccc");
      }
    }

    if (description_business_spanish == "") {
      message = "La descripción en español es requerida";
      $("#description_business_spanish").css("border-color", "#ba0c2f");
      $("#error_description_business_spanish_message").text(message)
      $("#error_description_business_spanish").show();
      isValid = false;
    } else {
      if (description_business_spanish.length > 1000) {
        message =
          "La descripción en español debe tener menos de 1000 caracteres";
        $("#description_business_spanish").css("border-color", "#ba0c2f");
        $("#error_description_business_spanish_message").text(message)
        $("#error_description_business_spanish").show();
        isValid = false;
      } else {
        $("#error_description_business_spanish").hide();
        $("#description_business_spanish").css("border-color", "#cccccc");
      }
    }

    if (description_business_english == "") {
      message = "La descripción en inglés es requerida";
      $("#description_business_english").css("border-color", "#ba0c2f");
      $("#error_description_business_english_message").text(message)
      $("#error_description_business_english").show();
      isValid = false;
    } else {
      if (description_business_english.length > 1000) {
        message =
          "La descripción en inglés debe tener menos de 1000 caracteres";
        $("#description_business_english").css("border-color", "#ba0c2f");
        $("#error_description_business_english_message").text(message)
        $("#error_description_business_english").show();
        isValid = false;
      } else {
        $("#error_description_business_english").hide();
        $("#description_business_english").css("border-color", "#cccccc");
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
      $("#loading_1").show();
      $("#save_1").hide();
      var data = {
        logo: $("#logo").prop("files")[0],
        business_name: $("#business_name").val(),
        website: $("#website").val(),
        video: $("#video").val(),
        password: $("#password").val(),
        description_business_spanish: $(
          "#description_business_spanish"
        ).val(),
        description_business_english: $(
          "#description_business_english"
        ).val(),
        nit: localStorage.getItem("nit"),
        email: localStorage.getItem("email"),
      };
      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      fetch("/registro/create_step_1", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          $("#loading_1").hide();
          $("#save_1").show();
          if (response.status == 200) {
            $("#profile-tab").addClass("active");
            $("#profile-tab-pane").addClass("show active");
            $("#home-tab").removeClass("active");
            //Add class complete to tab 1
            $("#svg_home").hide();
            $("#home_title").hide();
            $("#check_home_tab").show();
            $("#profile_title").show();
            $("#validate_progresss").css("width", "66.66%");
            $("#home-tab").addClass("complete");
            $("#home-tab-pane").removeClass("show active");
          } else {
            alert("Error al crear el usuario" + error);
          }
        })
        .catch(function (error) {
          $("#loading_1").hide();
          $("#save_1").show();
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
    var production_chain = $("#production_chain").val();
    var principal_code_ciiu = $("#principal_code_ciiu").val();
    var secondary_code_ciiu = $("#secondary_code_ciiu").val();
    var third_code_ciiu = $("#third_code_ciiu").val();
    var departament = $("#departament").val();
    var ciudad = $("#ciudad").val();
    var modelo_de_negocio = $("#modelo_de_negocio").val();
    var certification_business = $("#certification_business").val();
    var certification_business_file = $("#certificateFile").prop(
      "files"
    )[0];

    if (production_chain == "") {
      message = "La cadena de producción es requerida";
      $("#production_chain_contain .ts-control").css("border-color", "#ba0c2f");
      $("#error_production_chain_message").text(message)
      $("#error_production_chain").show();
      isValid = false;
    } else {
      $("#error_production_chain").hide();
      $("#production_chain_contain .ts-control").css("border-color", "#cccccc");
    }
    if (principal_code_ciiu == "") {
      message = "El código CIIU principal es requerido";
      $("#principal_code_ciiu").css("border-color", "#ba0c2f");
      $("#error_principal_code_ciiu").show();
      $("#error_principal_code_ciiu_message").text(message)

      isValid = false;
    } else {
      $("#error_principal_code_ciiu").hide();
      $("#principal_code_ciiu").css("border-color", "#cccccc");
    }

    if (departament == "") {
      message = "El departamento es requerido";
      $("#departament_contain .ts-control").css("border-color", "#ba0c2f");
      $("#error_departament_message").text(message)
      $("#error_departament").show();
      isValid = false;
    } else {
      $("#error_departament").hide();
      $("#departament_contain .ts-control").css("border-color", "#cccccc");
    }

    if (ciudad == "") {
      message = "La ciudad es requerida";
      $("#ciudad_contain .ts-control").css("border-color", "#ba0c2f");
      $("#error_ciudad").show();
      isValid = false;
    } else {
      $("#error_ciudad").hide();
      $("#ciudad_contain .ts-control").css("border-color", "#cccccc");
    }

    if (modelo_de_negocio == "") {
      message = "El modelo de negocio es requerido";
      $("#modelo_de_negocio_contain .ts-control").css("border-color", "#ba0c2f");
      $("#error_modelo_de_negocio_message").text(message)
      $("#error_modelo_de_negocio").show();
      isValid = false;
    } else {
      $("#error_modelo_de_negocio").hide();
      $("#modelo_de_negocio_contain .ts-control").css("border-color", "#cccccc");
    }
    if (certification_business_file || certification_business != "") {
      //get size of certification_business_file

      if (certification_business != "" && !certification_business_file) {
        message = "El archivo de certificación es requerido";
        $("#certificateFile").css("border-color", "#ba0c2f");
        $("#error_certification_business_file").show();
        $("#error_certification_business_file_message").text(message)
        isValid = false;
      } else {
        if ((certification_business_file.size / 1024 / 1024) > 2) {
          message = "El archivo de certificación debe ser menor a 2mb";
          $("#certificateFile").css("border-color", "#ba0c2f");
          $("#error_certification_business_file").show();
          $("#error_certification_business_file_message").text(message)
          isValid = false;
        } else {
          //check is pdf
          if (certification_business_file.type != "application/pdf") {
            message = "El archivo de certificación debe ser un archivo PDF";
            $("#certificateFile").css("border-color", "#ba0c2f");
            $("#error_certification_business_file").show();
            $("#error_certification_business_file_message").text(message);
            isValid = false;
          } else {
            $("#error_certification_business_file").hide();
            $("#certificateFile").css("border-color", "#cccccc");
          }
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
      $("#loading_2").show();
      $("#save_2").hide();
      var formData = new FormData();
      formData.append("production_chain", $("#production_chain").val());
      formData.append(
        "principal_code_ciiu",
        $("#principal_code_ciiu").val()
      );
      formData.append(
        "secondary_code_ciiu",
        $("#secondary_code_ciiu").val()
      );
      formData.append("third_code_ciiu", $("#third_code_ciiu").val());
      formData.append("departament", $("#departament").val());
      formData.append("ciudad", $("#ciudad").val());
      formData.append("modelo_de_negocio", $("#modelo_de_negocio").val());
      formData.append(
        "certification_business",
        $("#certificacion_de_empresa").val()
      );
      formData.append(
        "certification_business_file",
        $("#certificateFile").prop("files")[0]
      );
      formData.append("nit", localStorage.getItem("nit"));
      //principal_advisor add
      formData.append("principal_advisor", $("#principal_advisor").val());
      fetch("/registro/update_step_2", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          $("#loading_2").hide();
          $("#save_2").show();
          if (response.status === 200) {
            //show alert information
            $("#check_information").modal('show');
          } else {
            alert("Error al actualizar los datos");
          }
        })
        .catch(function (error) {
          $("#loading_2").hide();
          $("#save_2").show();
          alert("Error al actualizar los datos");
        });
    }
  }

  // function to go to step 3
  function goToStep3() {
    $("#contact-tab").addClass("active");
    $("#contact-tab-pane").addClass("show active");
    $("#profile-tab").removeClass("active");
    $("#profile-tab").addClass("complete");
    $("#profile-tab-pane").removeClass("show active");
    $("#check_information").modal('hide');
    //Add class complete to tab 3
    $("#svg_profile").hide();
    $("#profile_title").hide();
    $("#check_profile_tab").show();
    $("#contact_title").show();
    $("#validate_progresss").css("width", "100%");

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
    var name = $("#name").val();
    var last_name = $("#last_name").val();
    var position_spanish = $("#position_spanish").val();
    var position_english = $("#position_english").val();
    var country_code_landline = $("#country_code_landline").val();
    var landline = $("#landline").val();
    var country_code_mobile = $("#country_code_mobile").val();
    var mobile = $("#mobile").val();
    var contact_email = $("#contact_email").val();

    if (name == "") {
      message = "El nombre es requerido";
      $("#name").css("border-color", "#ba0c2f");
      $("#error_name").show();
      $("#error_name_message").text(message)
      isValid = false;
    } else {
      if (name.length > 20) {
        message = "El nombre no debe tener mas de 20 caracteres";
        $("#name").css("border-color", "#ba0c2f");
        $("#error_name_message").text(message)
        $("#error_name").show();
        isValid = false;
      } else {
        $("#error_name").hide();
        $("#name").css("border-color", "#cccccc");
      }
    }
    if (last_name == "") {
      message = "El apellido es requerido";
      $("#last_name").css("border-color", "#ba0c2f");
      $("#error_last_name").show();
      $("#error_last_name_message").text(message)
      isValid = false;
    } else {
      if (last_name.length > 20) {
        message = "El apellido no debe tener mas de 20 caracteres";
        $("#last_name").css("border-color", "#ba0c2f");
        $("#error_last_name_message").text(message)
        $("#error_last_name").show();
        $("#error_last_name")

          ;
        isValid = false;
      } else {
        $("#error_last_name").hide();
        $("#last_name").css("border-color", "#cccccc");
      }
    }
    if (position_spanish == "") {
      message = "La posición en español es requerida";
      $("#position_spanish").css("border-color", "#ba0c2f");
      $("#error_position_spanish_message").text(message)
      $("#error_position_spanish").show();
      isValid = false;
    } else {
      if (position_spanish.length > 50) {
        message =
          "La posición en español no debe tener mas de 50 caracteres";
        $("#position_spanish").css("border-color", "#ba0c2f");
        $("#error_position_spanish_message").text(message)
        $("#error_position_spanish").show();

        isValid = false;
      } else {
        $("#error_position_spanish").hide();
        $("#position_spanish").css("border-color", "#cccccc");
      }
    }
    if (position_english == "") {
      message = "La posición en ingles es requerida";
      $("#position_english").css("border-color", "#ba0c2f");
      $("#error_position_english_message").text(message)
      $("#error_position_english").show();
      $("#error_position_english")

        ;
      isValid = false;
    } else {
      if (position_english.length > 50) {
        message =
          "La posición en ingles no debe tener mas de 50 caracteres";
        $("#position_english").css("border-color", "#ba0c2f");
        $("#error_position_english_message").text(message)
        $("#error_position_english").show();

        isValid = false;
      } else {
        $("#error_position_english").hide();
        $("#position_english").css("border-color", "#cccccc");
      }
    }
    if (country_code_landline == "") {
      message = "El codigo de pais de la linea de telefono es requerido";
      $("#country_code_landline").css("border-color", "#ba0c2f");
      $("#error_country_code_landline").show();
      $("#error_country_code_landline")

        ;
      isValid = false;
    } else {
      $("#error_country_code_landline").hide();
      $("#country_code_landline").css("border-color", "#cccccc");
    }
    if (landline == "") {
      message = "La linea de telefono es requerida";
      $("#landline").css("border-color", "#ba0c2f");
      $("#error_landline").show();
      $("#error_landline")

        ;
      isValid = false;
    } else {
      if (landline.length > 20) {
        message =
          "La linea de telefono no debe tener mas de 20 caracteres";
        $("#landline").css("border-color", "#ba0c2f");
        $("#error_landline").show();
        $("#error_landline")

          ;
        isValid = false;
      } else {
        if (!landline.match(/^[0-9]+$/)) {
          message = "La linea de telefono no debe tener letras";
          $("#landline").css("border-color", "#ba0c2f");
          $("#error_landline").show();
          $("#error_landline")

            ;
          isValid = false;
        } else {
          $("#error_landline").hide();
          $("#landline").css("border-color", "#cccccc");
        }
      }
    }
    if (country_code_mobile == "") {
      message = "El codigo de pais de la celular es requerido";
      $("#country_code_mobile").css("border-color", "#ba0c2f");
      $("#error_country_code_mobile").show();
      $("#error_country_code_mobile")

        ;
      isValid = false;
    } else {
      $("#error_country_code_mobile").hide();
      $("#country_code_mobile").css("border-color", "#cccccc");
    }
    if (mobile == "") {
      message = "El celular es requerido";
      $("#mobile").css("border-color", "#ba0c2f");
      $("#error_mobile").show();
      $("#error_mobile")

        ;
      isValid = false;
    } else {
      if (mobile.length > 20) {
        message = "El celular no debe tener mas de 20 caracteres";
        $("#mobile").css("border-color", "#ba0c2f");
        $("#error_mobile").show();
        $("#error_mobile")

          ;
        isValid = false;
      } else {
        if (!mobile.match(/^[0-9]+$/)) {
          message = "El celular no debe tener letras";
          $("#mobile").css("border-color", "#ba0c2f");
          $("#error_mobile").show();
          $("#error_mobile")

            ;
          isValid = false;
        } else {
          $("#error_mobile").hide();
          $("#mobile").css("border-color", "#cccccc");
        }
      }
    }
    if (contact_email == "") {
      message = "El correo electronico es requerido";
      $("#contact_email").css("border-color", "#ba0c2f");
      $("#error_email").show();
      $("#error_email");
      isValid = false;
    } else {
      if (
        !contact_email.match(
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        )
      ) {
        message = "El correo electronico no es valido";
        $("#contact_email").css("border-color", "#ba0c2f");
        $("#error_email").show();
        $("#error_email")

          ;
        isValid = false;
      } else {
        $("#error_email").hide();
        $("#contact_email").css("border-color", "#cccccc");
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
      $("#loading_3").show();
      $("#save_3").hide();
      var data = {
        name: $("#name").val(),
        last_name: $("#last_name").val(),
        position_spanish: $("#position_spanish").val(),
        position_english: $("#position_english").val(),
        country_code_landline: $("#country_code_landline").val(),
        landline: $("#landline").val(),
        country_code_mobile: $("#country_code_mobile").val(),
        mobile: $("#mobile").val(),
        contact_email: $("#contact_email").val(),
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
            $("#success_modal").modal('show');
            //clean local storage
            localStorage.clear();
          } else {
            alert("Error al actualizar los datos");
          }
        })
        .catch(function (error) {
          $("#loading_3").hide();
          $("#save_3").show();
          alert("Error al actualizar los datos");
        });
    }
  }

  // function to go to step 3
  function goToMenu() {
    window.location.href = "/user/login";
  }

  //Addtional functional methods

  /*
  * check step in local storage and change tab with cases switch
  */
  function goBackTab(step) {
    switch (step) {
      case 1:
        $("#profile-tab").removeClass("active");
        $("#profile-tab-pane").removeClass("show active");
        $("#home-tab").addClass("active");
        //Add class complete to tab 1
        $("#svg_home").show();
        $("#home_title").show();
        $("#check_home_tab").hide();
        $("#profile_title").hide();
        $("#validate_progresss").css("width", "33.33%");
        $("#home-tab").removeClass("complete");
        $("#home-tab-pane").addClass("show active");
        break;
      case 2:
        $("#contact-tab").removeClass("active");
        $("#contact-tab-pane").removeClass("show active");
        $("#profile-tab").addClass("active");
        //Add class complete to tab 1
        $("#svg_profile").show();
        $("#profile_title").show();
        $("#check_profile_tab").hide();
        $("#contact_title").hide();
        $("#validate_progresss").css("width", "66.66%");
        $("#profile-tab").removeClass("complete");
        $("#profile-tab-pane").addClass("show active");
        break;
    }
  }


  /*
  * open modal to cancel process
  */
  function cancelProcess() {
    $("#cancel_modal").modal('show');
  }
  function hideCancelProcess() {
    $("#cancel_modal").modal('hide');
  }

  /*
  * delete user by fecth /delete_user
  */

  function deleteUser() {
    $("#loading_3").show();
    $("#save_3").hide();
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
        $("#loading_3").hide();
        $("#save_3").show();
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
    $("#business_name").val(data.business_name);
    $("#empresa_popup").text(data.business_name);
    $("#website").val(data.website);
    $("#video").val(data.video);
    $("#description_business_spanish").val(data.description_spanish);
    $("#description_business_english").val(data.description_english);

    production_chain_select.setValue(data.production_chain);
    departament_select.setValue(data.departament);
    getCities(data.ciudad);
    modelo_de_negocio_select.setValue([data.modelo_de_negocio]);
    certificacion_de_empresa_select.setValue(data.certification_business);
    $("#principal_code_ciiu").val(data.principal_code_ciiu);
    $("#secondary_code_ciiu").val(data.secondary_code_ciiu);
    $("#third_code_ciiu").val(data.third_code_ciiu);
  }

  /*
  * fill form with data of neo
  */
  function fillFormWithDataNeo() {
    let data_neo = JSON.parse(localStorage.getItem("data_neo"));
    //fill nit and bussines_name and landline
    $("#nit").val(data_neo.nit);
    $("#business_name").val(data_neo.nombre);
    $("#empresa_popup").text(data_neo.nombre);
    $("#landline").val(data_neo.telefono);
    $("#contact_email").val(data_neo.correo);
  }

  /*
  * show tab base in step
  */
  function showTabBase(stepData) {
    let step = parseInt(stepData);
    switch (step) {
      case 1:
        $("#profile-tab").addClass("active");
        $("#profile-tab-pane").addClass("show active");
        $("#home-tab").removeClass("active");
        //Add class complete to tab 1
        $("#svg_home").hide();
        $("#home_title").hide();
        $("#check_home_tab").show();
        $("#profile_title").show();
        $("#validate_progresss").css("width", "66.66%");
        $("#home-tab").addClass("complete");
        $("#home-tab-pane").removeClass("show active");
        break;
      case 2:
        $("#contact-tab").addClass("active");
        $("#contact-tab-pane").addClass("show active");
        $("#home-tab").removeClass("active");
        //Add class complete to tab 1
        $("#svg_home").hide();
        $("#svg_profile").hide();
        $("#home_title").hide();
        $("#check_home_tab").show();
        $("#check_profile_tab").show();
        $("#contact_title").show();
        $("#validate_progresss").css("width", "100%");
        $("#home-tab").addClass("complete");
        $("#profile-tab").addClass("complete");
        $("#home-tab-pane").removeClass("show active");
        break;
    }

  }


  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_register = {
    attach: function (context, settings) {

      //if document is ready call init
      if (context === document) {
        init();
      }
      //call function openInputFile
      $("#open_input_file", context).click(function () {
        openInputFile();
      });
      //call function openInputFileCertificate
      $("#open_input_file_certificate", context).click(function () {
        openInputFileCertificate();
      });
      //call function onChangeCertificate
      $("#certificateFile", context).change(function () {
        onChangeCertificate();
      });
      //call function onChangeLogo
      $("#logo", context).change(function () {
        onChangeLogo();
      });
      //call function closeThumbnail
      $("#close_thumbnail", context).click(function () {
        closeThumbnail();
      });
      //call function removeLogo
      $("#remove_logo", context).click(function () {
        removeLogo();
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
      $("#pass_show_confirm", context).click(function () {
        passwordToText();
      });
      //call function textToPassword
      $("#pass_bloq_confirm", context).click(function () {
        textToPassword();
      });
      //call function valueProgressBar oninput
      $("#password", context).on("input", function () {
        valueProgressBar();
      });
      //call function createThumbnailYoutube
      $("#create_thumbnail_youtube", context).click(function () {
        createThumbnailYoutube();
      });
      //call function saveUser
      $("#save_1", context).click(function () {
        saveUser();
      });
      //call function updateForm2
      $("#save_2", context).click(function () {
        updateForm2();
      });
      //call function goToStep3
      $("#go_to_step_3", context).click(function () {
        goToStep3();
      });
      //call function updateDataForm3
      $("#save_3", context).click(function () {
        updateDataForm3();
      });
      //call function goToMenu
      $("#go_to_menu", context).click(function () {
        goToMenu();
      });
      //call function goBackTab step 1
      $("#go_back_tab_1", context).click(function () {
        goBackTab(1);
      });
      //call function goBackTab step 2
      $("#go_back_tab_2", context).click(function () {
        goBackTab(2);
      });
      //call function cancelProcess 1
      $("#cancel_process_1", context).click(function () {
        cancelProcess();
      });
      //call function cancelProcess 2
      $("#cancel_process_2", context).click(function () {
        cancelProcess();
      });
      //call function cancelProcess 3
      $("#cancel_process_3", context).click(function () {
        cancelProcess();
      });
      //call function hideCancelProcess
      $("#hide_cancel_process", context).click(function () {
        hideCancelProcess();
      });
      //call function deleteUser
      $("#delete_user", context).click(function () {
        deleteUser();
      });
      //call function getCities on input
      $("#departament", context).on("input", function () {
        getCities();
      });
    }
  };


}(jQuery, Drupal));