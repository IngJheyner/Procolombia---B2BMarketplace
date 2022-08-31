/*
 * Service for Register
 */

// open input file with button
(function ($, Drupal) {
  'use strict';

  var select_subcategories1;
  var select_subcategories2;
  var select_subcategories3;

  function init() {
    new TomSelect("#cat_interest_1", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    new TomSelect("#company_model", {
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
    select_subcategories1 = new TomSelect("#subcat_interest_1", {
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

    new TomSelect("#cat_interest_2", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    new TomSelect("#company_model_2", {
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
    select_subcategories2 = new TomSelect("#subcat_interest_2", {
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

    new TomSelect("#cat_interest_3", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    new TomSelect("#company_model_3", {
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
    select_subcategories3 = new TomSelect("#subcat_interest_3", {
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

    //get data of user
    getDataUserInternational();
  }

  //is url
  function validateURL(s) {
    var regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  //fecth subcategories 1
  function getSubcategories1(value = "") {
    //get departament
    var cat_interest_1 = $("#cat_interest_1").val();
    //put in form data
    var formData = new FormData();
    //put message of loading cities
    select_subcategories1.clear();
    select_subcategories1.clearOptions();
    formData.append("cat_interest", cat_interest_1);
    //fetch cities
    fetch("/get_subcategories", {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        //put options in select cities
        console.log(data)
        select_subcategories1.clearOptions();
        data.subcategories.map((subcategory) => {
          //create option inside select cities
          select_subcategories1.addOption({
            id: subcategory.ID,
            title: subcategory.Name,
          });
        });
        if (value !== "")
          select_subcategories1.setValue(value);
      })
      .catch((error) => {
        alert(error);
      })
  }

  //fecth subcategories 2
  function getSubcategories2(value = "") {
    //get departament
    var cat_interest_2 = $("#cat_interest_2").val();
    //put in form data
    var formData = new FormData();
    //put message of loading cities
    select_subcategories2.clear();
    select_subcategories2.clearOptions();
    formData.append("cat_interest", cat_interest_2);
    //fetch cities
    fetch("/get_subcategories", {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        //put options in select cities
        console.log(data)
        select_subcategories2.clearOptions();
        data.subcategories.map((subcategory) => {
          //create option inside select cities
          select_subcategories2.addOption({
            id: subcategory.ID,
            title: subcategory.Name,
          });
        });
        if (value !== "")
          select_subcategories2.setValue(value);
      })
      .catch((error) => {
        alert(error);
      })
  }

  //fecth subcategories 3
  function getSubcategories3(value = "") {
    //get departament
    var cat_interest_3 = $("#cat_interest_3").val();
    //put in form data
    var formData = new FormData();
    //put message of loading cities
    select_subcategories3.clear();
    select_subcategories3.clearOptions();
    formData.append("cat_interest", cat_interest_3);
    //fetch cities
    fetch("/get_subcategories", {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        //put options in select cities
        console.log(data)
        select_subcategories3.clearOptions();
        data.subcategories.map((subcategory) => {
          //create option inside select cities
          select_subcategories3.addOption({
            id: subcategory.ID,
            title: subcategory.Name,
          });
        });
        if (value !== "")
          select_subcategories3.setValue(value);
      })
      .catch((error) => {
        alert(error);
      })
  }

  /**
   * Validate form step 2
   * - country is required
   * - city is required
   * - position is required
   * - web_site is required and is url
   */
  function validateFormStep2() {
    var country = $("#country").val();
    var city = $("#city").val();
    var position = $("#position").val();
    var web_site = $("#web_site").val();
    let isValid = true;
    let message = ""
    if (country == "") {
      message = "Por favor seleccione un país";
      $("#country").css("border-color", "#ba0c2f");
      $("#error_country_message").text(message)
      $("#error_country").show();
      isValid = false;
    } else {
      $("#country").css("border-color", "#ccc");
      $("#error_country").hide();
    }

    if (city == "") {
      message = "Por favor seleccione una ciudad";
      $("#city").css("border-color", "#ba0c2f");
      $("#error_city_message").text(message)
      $("#error_city").show();
      isValid = false;
    } else {
      $("#city").css("border-color", "#ccc");
      $("#error_city").hide();
    }

    if (position == "") {
      message = "Por favor seleccione una posición";
      $("#position").css("border-color", "#ba0c2f");
      $("#error_position_message").text(message)
      $("#error_position").show();
      isValid = false;
    } else {
      $("#position").css("border-color", "#ccc");
      $("#error_position").hide();
    }

    if (web_site == "") {
      message = "Por favor ingrese una web";
      $("#web_site").css("border-color", "#ba0c2f");
      $("#error_web_site_message").text(message)
      $("#error_web_site").show();
      isValid = false;
    } else {
      if (!validateURL(web_site)) {
        message = "Por favor ingrese una web válida";
        $("#web_site").css("border-color", "#ba0c2f");
        $("#error_web_site_message").text(message)
        $("#error_web_site").show();
        isValid = false;
      } else {
        $("#web_site .ts-control").css("border-color", "#ccc");
        $("#error_web_site").hide();
      }
    }

    return isValid;
  }

  /**
   * save data step 2
   */
  function saveDataStep2() {
    if (validateFormStep2()) {
      $("#loading_international_2").show();
      $("#save_international_2").hide();
      var country = $("#country").val();
      var city = $("#city").val();
      var position = $("#position").val();
      var web_site = $("#web_site").val();
      var formData = new FormData();
      formData.append("country", country);
      formData.append("city", city);
      formData.append("position", position);
      formData.append("web_site", web_site);
      formData.append("email", localStorage.getItem("email_buyer"));
      fetch("/registro/usuario/comprador/create_step_2", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          $("#loading_international_2").hide();
          $("#save_international_2").show();
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
          $("#loading_international_2").hide();
          $("#save_international_2").show();
          alert("Error al crear el usuario" + error);
        });
    }
  }

  /**
   * Validate form step 3
   * - cat_interest_1 is required
   * - subcat_interest_1 is required
   * - company_model is required
   */

  function validateFormStep3() {
    var cat_interest_1 = $("#cat_interest_1").val();
    var subcat_interest_1 = $("#subcat_interest_1").val();
    var company_model = $("#company_model").val();
    let isValid = true;
    let message = ""
    if (cat_interest_1 == "") {
      message = "Por favor seleccione una categoría";
      $("#cat_interest_1_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_1_message").text(message)
      $("#error_cat_interest_1").show();
      isValid = false;
    } else {
      $("#cat_interest_1_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_1").hide();
    }

    if (subcat_interest_1 == "") {
      message = "Por favor seleccione una subcategoría";
      $("#subcat_interest_1_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_1_message").text(message)
      $("#error_subcat_interest_1").show();
      isValid = false;
    } else {
      $("#subcat_interest_1_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_1").hide();
    }

    if (company_model == "") {
      message = "Por favor seleccione un modelo de empresa";
      $("#company_model_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_company_model_message").text(message)
      $("#error_company_model").show();
      isValid = false;
    } else {
      $("#company_model_cont .ts-control").css("border-color", "#ccc");
      $("#error_company_model").hide();
    }

    return isValid;
  }

  /**
   * save data step 3
   */
  function saveDataStep3() {
    if (validateFormStep3()) {
      $("#loading_international_3").show();
      $("#save_international_3").hide();
      var cat_interest_1 = $("#cat_interest_1").val();
      var subcat_interest_1 = $("#subcat_interest_1").val();
      var company_model = $("#company_model").val();
      var formData = new FormData();
      formData.append("cat_interest_1", cat_interest_1);
      formData.append("subcat_interest_1", subcat_interest_1);
      formData.append("company_model", company_model);
      formData.append("email", localStorage.getItem("email_buyer"));
      fetch("/registro/usuario/comprador/create_step_3", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          $("#loading_international_3").hide();
          $("#save_international_3").show();
          if (response.status == 200) {
            $("#profile-tab").addClass("active");
            $("#profile-tab-pane").addClass("show active");
            $("#home-tab").removeClass("active");
            //Add class complete to tab 1
            $("#svg_home").hide();
            $("#home_title").hide();
            $("#check_home_tab").show();
            $("#profile_title").show();
            $("#validate_progresss").css("width", "100%");
            $("#home-tab").addClass("complete");
            $("#home-tab-pane").removeClass("show active");
          } else {
            alert("Error al crear el usuario" + error);
          }
        })
        .catch(function (error) {
          $("#loading_international_3").hide();
          $("#save_international_3").show();
          alert("Error al crear el usuario" + error);
        });
    }
  }

  /**
   * Validate form step 4
   * - cat_interest_2 is required
   * - subcat_interest_2 is required
   * - company_model_2 is required
   */

  function validateFormStep4() {
    var cat_interest_2 = $("#cat_interest_2").val();
    var subcat_interest_2 = $("#subcat_interest_2").val();
    var company_model_2 = $("#company_model_2").val();

    let isValid = true;
    let message = ""
    if (cat_interest_2 == "") {
      message = "Por favor seleccione una categoría";
      $("#cat_interest_2_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_2_message").text(message)
      $("#error_cat_interest_2").show();
      isValid = false;
    } else {
      $("#cat_interest_2_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_2").hide();
    }

    if (subcat_interest_2 == "") {
      message = "Por favor seleccione una subcategoría";
      $("#subcat_interest_2_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_2_message").text(message)
      $("#error_subcat_interest_2").show();
      isValid = false;
    } else {
      $("#subcat_interest_2_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_2").hide();
    }

    if (company_model_2 == "") {
      message = "Por favor seleccione un modelo de empresa";
      $("#company_model_2_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_company_model_2_message").text(message)
      $("#error_company_model_2").show();
      isValid = false;
    } else {
      $("#company_model_2_cont .ts-control").css("border-color", "#ccc");
      $("#error_company_model_2").hide();
    }

    return isValid;
  }

  /**
   * save data step 4
   */
  function saveDataStep4() {
    if (validateFormStep4()) {
      $("#loading_international_4").show();
      $("#save_international_4").hide();
      var cat_interest_2 = $("#cat_interest_2").val();
      var subcat_interest_2 = $("#subcat_interest_2").val();
      var company_model_2 = $("#company_model_2").val();
      var formData = new FormData();
      formData.append("cat_interest_2", cat_interest_2);
      formData.append("subcat_interest_2", subcat_interest_2);
      formData.append("company_model_2", company_model_2);
      formData.append("email", localStorage.getItem("email_buyer"));
      fetch("/registro/usuario/comprador/create_step_4", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          $("#loading_international_4").hide();
          $("#save_international_4").show();
          if (response.status == 200) {
            $("#profile-tab").addClass("active");
            $("#profile-tab-pane").addClass("show active");
            $("#home-tab").removeClass("active");
            //Add class complete to tab 1
            $("#svg_home").hide();
            $("#home_title").hide();
            $("#check_home_tab").show();
            $("#profile_title").show();
            $("#validate_progresss").css("width", "100%");
            $("#home-tab").addClass("complete");
            $("#home-tab-pane").removeClass("show active");
          } else {
            alert("Error al crear el usuario" + error);
          }
        })
        .catch(function (error) {
          $("#loading_international_4").hide();
          $("#save_international_4").show();
          alert("Error al crear el usuario" + error);
        });
    }
  }

  /**
   * Validate form step 5
   * - cat_interest_3 is required
   * - subcat_interest_3 is required
   * - company_model_3 is required
   */

  function validateFormStep5() {
    var cat_interest_3 = $("#cat_interest_3").val();
    var subcat_interest_3 = $("#subcat_interest_3").val();
    var company_model_3 = $("#company_model_3").val();

    let isValid = true;
    let message = ""
    if (cat_interest_3 == "") {
      message = "Por favor seleccione una categoría";
      $("#cat_interest_3_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_3_message").text(message)
      $("#error_cat_interest_3").show();
      isValid = false;
    } else {
      $("#cat_interest_3_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_3").hide();
    }

    if (subcat_interest_3 == "") {
      message = "Por favor seleccione una subcategoría";
      $("#subcat_interest_3_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_3_message").text(message)
      $("#error_subcat_interest_3").show();
      isValid = false;
    } else {
      $("#subcat_interest_3_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_3").hide();
    }

    if (company_model_3 == "") {
      message = "Por favor seleccione un modelo de empresa";
      $("#company_model_3_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_company_model_3_message").text(message)
      $("#error_company_model_3").show();
      isValid = false;
    } else {
      $("#company_model_3_cont .ts-control").css("border-color", "#ccc");
      $("#error_company_model_3").hide();
    }

    return isValid;
  }

  /**
   * save data step 5
   */
  function saveDataStep5() {
    if (validateFormStep5()) {
      $("#loading_international_5").show();
      $("#save_international_5").hide();
      var cat_interest_3 = $("#cat_interest_3").val();
      var subcat_interest_3 = $("#subcat_interest_3").val();
      var company_model_3 = $("#company_model_3").val();
      var formData = new FormData();
      formData.append("cat_interest_3", cat_interest_3);
      formData.append("subcat_interest_3", subcat_interest_3);
      formData.append("company_model_3", company_model_3);
      formData.append("email", localStorage.getItem("email_buyer"));
      fetch("/registro/usuario/comprador/create_step_5", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          $("#loading_international_5").hide();
          $("#save_international_5").show();
          if (response.status == 200) {
            $("#profile-tab").addClass("active");
            $("#profile-tab-pane").addClass("show active");
            $("#home-tab").removeClass("active");
            //Add class complete to tab 1
            $("#svg_home").hide();
            $("#home_title").hide();
            $("#check_home_tab").show();
            $("#profile_title").show();
            $("#validate_progresss").css("width", "100%");
            $("#home-tab").addClass("complete");
            $("#home-tab-pane").removeClass("show active");
          } else {
            alert("Error al crear el usuario" + error);
          }
        })
        .catch(function (error) {
          $("#loading_international_5").hide();
          $("#save_international_5").show();
          alert("Error al crear el usuario" + error);
        });
    }
  }

  /*
  * get data of user if not return 200 status code, use data_neo to fill form in other case fill form with data of user and show tab base in step + 1
  */
  function getDataUserInternational() {
    var data = {
      email_buyer: localStorage.getItem("email_buyer"),
    };
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    fetch("/get_user/buyer", {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          //show alert success
          //redirect to pre-registro
          //fill form with data of user
          console.log(data);
          fillFormWithDataUserInternational(data.data);
          //show tab base in step
          showTabBaseInternational(data.data.step);
        }
      })
      .catch(function (error) {
        alert(error);
      });
  }

  // function to go to step 3
  function goToMenu() {
    window.location.href = "/user/login";
  }

  //Addtional functional methods


  // function to go to step 3
  function goToStep3International() {
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
  * open modal to cancel process
  */
  function cancelProcessInternational() {
    $("#cancel_modal").modal('show');
  }
  function hideCancelProcessInternational() {
    $("#cancel_modal").modal('hide');
  }

  /*
  * delete user by fecth /delete_user
  */

  function deleteUserInternational() {
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
  * fill form with data of user
  */
  function fillFormWithDataUserInternational(data) {
    //fill data of user
    $("position").val(data.position);
    $("#web_site").val(data.web_site);
    $("#cat_interest_1").val(data.cat_interest_1);
    $("#cat_interest_2").val(data.cat_interest_2);
    $("#cat_interest_3").val(data.cat_interest_3);
    $("#subcat_interest_1").val(data.subcat_interest_1);
    $("#subcat_interest_2").val(data.subcat_interest_2);
    $("#subcat_interest_3").val(data.subcat_interest_3);
    $("#company_model").val(data.company_model);
    $("#company_model_2").val(data.company_model_2);
    $("#company_model_3").val(data.company_model_3);
  }

  /*
  * show tab base in step
  */
  function showTabBaseInternational(stepData) {
    let step = parseInt(stepData);
    switch (step) {
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
      case 3:
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

      case 4:
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
  Drupal.behaviors.cp_register_buyer = {
    attach: function (context, settings) {
      //if document is ready call init and check if production_chain is in dom
      if (context === document && $("#cat_interest_1").length > 0) {
        init();
      }
      //call subcategory of selected category
      $("#cat_interest_1", context).on("input", function () {
        getSubcategories1();
      });
      $("#cat_interest_2", context).on("input", function () {
        getSubcategories2();
      });
      $("#cat_interest_3", context).on("input", function () {
        getSubcategories3();
      });
      //call save step 2 
      $("#save_buyer_1", context).click(function () {
        saveDataStep2();
      });
      //call save step 3
      $("#save_buyer_2", context).click(function () {
        saveDataStep3();
      });
      //call save step 4
      $("#save_buyer_3", context).click(function () {
        saveDataStep4();
      });
      //call save step 5
      $("#save_buyer_4", context).click(function () {
        saveDataStep5();
      });
    }
  };


}(jQuery, Drupal));