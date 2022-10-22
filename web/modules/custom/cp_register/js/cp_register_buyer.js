/*
 * Service for Register
 */

// open input file with button
(function ($, Drupal) {
  'use strict';

  var select_categories1;
  var select_categories2;
  var select_categories3;
  var select_subcategories1;
  var select_subcategories2;
  var select_subcategories3;
  var select_model1;
  var select_model2;
  var select_model3;
  var advisor;
  var country;
  function init() {
    $('#info_modal').modal("show");

    select_categories1 = new TomSelect("#cat_interest_1", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    select_model1 = new TomSelect("#company_model", {
      plugins: ['remove_button'],
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
        { id: 1, title: Drupal.t("Select an option") },
      ],
      sortField: {
        field: "text",
        direction: "asc"
      },
      create: false
    });

    select_categories2 = new TomSelect("#cat_interest_2", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    select_model2 = new TomSelect("#company_model_2", {
      plugins: ['remove_button'],
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
        { id: 1, title: Drupal.t("Select an option") },
      ],
      sortField: {
        field: "text",
        direction: "asc"
      },
      create: false
    });

    select_categories3 = new TomSelect("#cat_interest_3", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
    select_model3 = new TomSelect("#company_model_3", {
      plugins: ['remove_button'],
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
        { id: 1, title: Drupal.t("Select an option") },
      ],
      sortField: {
        field: "text",
        direction: "asc"
      },
      create: false
    });

    advisor = new TomSelect("#principal_advisor", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });

    country = new TomSelect("#country", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
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
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t("Unexpected error"));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while obtaining subcategories"));

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
      .catch(function(error){
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t("Unexpected error"));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while obtaining subcategories"));
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
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t("Unexpected error"));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while obtaining subcategories"));
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
    var position = $("#position").val();
    var web_site = $("#web_site").val();
    var advisor = $("#principal_advisor").val();
    let isValid = true;
    let message = ""
    if (country == "") {
      message = Drupal.t("Please select a country");
      $("#country_contain").find("div.ts-control").css("border-color", "#ba0c2f");
      $("#error_country_message").text(message)
      $("#error_country").show();
      isValid = false;
    } else {
      $("#country_contain").find("div.ts-control").css("border-color", "#ccc");
      $("#error_country").hide();
    }

    if (position == "") {
      message = Drupal.t("Please select a position");
      $("#position").css("border-color", "#ba0c2f");
      $("#error_position_message").text(message)
      $("#error_position").show();
      isValid = false;
    } else {
      $("#position").css("border-color", "#ccc");
      $("#error_position").hide();
    }

    if (web_site == "") {
      message = Drupal.t("Please enter a web site");
      $("#web_site").css("border-color", "#ba0c2f");
      $("#error_web_site_message").text(message)
      $("#error_web_site").show();
      isValid = false;
    }
    else if (web_site != "") {
      if (!validateURL(web_site)) {
        message = Drupal.t("Please enter a valid website");
        $("#web_site").css("border-color", "#ba0c2f");
        $("#error_web_site_message").text(message)
        $("#error_web_site").show();
        isValid = false;
      } else {
        $("#web_site").css("border-color", "#ccc");
        $("#error_web_site").hide();
      }
      
    }

    if (advisor == "") {
      message = Drupal.t("Select the ProColombia advisor with whom your company has a defined work plan.");
      $("#principal_advisor_contain").find("div.ts-control").css("border-color", "#ba0c2f");
      $("#error_principal_advisor_message").text(message)
      $("#error_principal_advisor").show();
      isValid = false;
    } else {
      $("#principal_advisor_contain").find("div.ts-control").css("border-color", "#ccc");
      $("#error_principal_advisor").hide();
    }

    return isValid;
  }

  /**
   * save data step 2
   */
  function saveDataStep2() {
    if (validateFormStep2()) {
      $("#loading_international_2").show();
      $("#save_buyer_1").hide();
      var country = $("#country").val();
      var position = $("#position").val();
      var web_site = $("#web_site").val();
      var formData = new FormData();
      formData.append("country", country);
      formData.append("position", position);
      formData.append("web_site", web_site);
      formData.append("principal_advisor", $("#principal_advisor").val());
      formData.append("email", localStorage.getItem("email_buyer"));
      fetch("/registro/usuario/comprador/create_step_2", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          $("#loading_international_2").hide();
          $("#save_buyer_1").show();
          if (response.status == 200) {
            $("#step_3_tab").addClass("active");
            $("#step_3").addClass("show active");
            $("#step_2").removeClass("active");
            //Add class complete to tab 1
            $("#step_2_svg").hide();
            $("#step_2_title").hide();
            $("#check_step_2").show();
            $("#step_3_title").show();
            $("#validate_progresss").css("width", "33%");
            $("#step_2").removeClass("show active");
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t("Unexpected error"));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating user in step 2: Profile Settings."));
          }
        })
        .catch(function (error) {
          $("#loading_international_2").hide();
          $("#save_buyer_1").show();
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating user in step 2: Profile Settings."));
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
      message = Drupal.t("Please select a category");
      $("#cat_interest_1_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_1_message").text(message)
      $("#error_cat_interest_1").show();
      isValid = false;
    } else {
      $("#cat_interest_1_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_1").hide();
    }

    if (subcat_interest_1 == "") {
      message = Drupal.t("Please select a subcategory");
      $("#subcat_interest_1_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_1_message").text(message)
      $("#error_subcat_interest_1").show();
      isValid = false;
    } else {
      $("#subcat_interest_1_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_1").hide();
    }

    if (company_model == "") {
      message = Drupal.t("Please select a business model");
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
      $("#save_buyer_2").hide();
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
          $("#save_buyer_2").show();
          if (response.status == 200) {
            $("#step_4_tab").addClass("active");
            $("#step_4").addClass("show active");
            $("#step_3").removeClass("active");
            //Add class complete to tab 1
            $("#step_3_svg").hide();
            $("#step_3_title").hide();
            $("#check_step_3").show();
            $("#step_4_title").show();
            $("#validate_progresss").css("width", "53%");
            $("#step_3").removeClass("show active");
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t("Unexpected error"));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating user in step 3: Products of interest #1."));
          }
        })
        .catch(function (error) {
          $("#loading_international_3").hide();
          $("#save_buyer_2").show();
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating user in step 3: Products of interest #1."));
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
      message = Drupal.t("Please select a category");
      $("#cat_interest_2_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_2_message").text(message)
      $("#error_cat_interest_2").show();
      isValid = false;
    } else {
      $("#cat_interest_2_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_2").hide();
    }

    if (subcat_interest_2 == "") {
      message = Drupal.t("Please select a subcategory");
      $("#subcat_interest_2_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_2_message").text(message)
      $("#error_subcat_interest_2").show();
      isValid = false;
    } else {
      $("#subcat_interest_2_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_2").hide();
    }

    if (company_model_2 == "") {
      message = Drupal.t("Please select a business model");
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
      $("#save_buyer_3").hide();
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
          $("#save_buyer_3").show();
          if (response.status == 200) {
            $("#step_5_tab").addClass("active");
            $("#step_5").addClass("show active");
            $("#step_4").removeClass("active");
            //Add class complete to tab 1
            $("#step_4_svg").hide();
            $("#step_4_title").hide();
            $("#check_step_4").show();
            $("#step_5_title").show();
            $("#validate_progresss").css("width", "73%");
            $("#step_4").removeClass("show active");
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t("Unexpected error"));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating user in step 4: Products of interest #2."));
          }
        })
        .catch(function (error) {
          $("#loading_international_4").hide();
          $("#save_buyer_3").show();
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating user in step 4: Products of interest #2."));
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
      message = Drupal.t("Please select a category");
      $("#cat_interest_3_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_cat_interest_3_message").text(message)
      $("#error_cat_interest_3").show();
      isValid = false;
    } else {
      $("#cat_interest_3_cont .ts-control").css("border-color", "#ccc");
      $("#error_cat_interest_3").hide();
    }

    if (subcat_interest_3 == "") {
      message = Drupal.t("Please select a subcategory");
      $("#subcat_interest_3_cont .ts-control").css("border-color", "#ba0c2f");
      $("#error_subcat_interest_3_message").text(message)
      $("#error_subcat_interest_3").show();
      isValid = false;
    } else {
      $("#subcat_interest_3_cont .ts-control").css("border-color", "#ccc");
      $("#error_subcat_interest_3").hide();
    }

    if (company_model_3 == "") {
      message = Drupal.t("Please select a business model");
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
      $("#save_buyer_4").hide();
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
          $("#save_buyer_4").show();
          if (response.status == 200) {
            //show success modal
            let email_data_form = new FormData();
            email_data_form.append("email", localStorage.getItem("email_buyer"));
            fetch("/mailing/send/success/registration/international",
              {
                method: "POST",
                body: formData,
              }
            ).catch(function (error) {
              // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t("Unexpected error"));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating user in step 5: Products of interest #3."));
            });
            $("#success_modal_international").modal("show");
            //set name of company empresa_popup
            $("#empresa_popup").text(localStorage.getItem("company_name"));
            localStorage.clear();
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t("Unexpected error"));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating user in step 5: Products of interest #3."));
          }
        })
        .catch(function (error) {
          $("#loading_international_5").hide();
          $("#save_buyer_4").show();
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating user in step 5: Products of interest #3."));
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
        } else {
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while getting user data."));
        }
      })
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t("Unexpected error"));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while getting user data."));
      });
  }

  // function to go to step 3
  function goToMenuBuyer() {
    window.location.href = "/";
  }

  //Addtional functional methods

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
      email: localStorage.getItem("email_buyer"),
    };
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    fetch("/delete_user/buyer", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        if (response.status === 200) {
          //show alert success
          //redirect to pre-registro
          localStorage.clear();
          window.location.href = "/pre-registro";
        } else {
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t("Unexpected error"));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while deleting user."));
        }
      })
      .catch(function (error) {
        $("#loading_3").hide();
        $("#save_3").show();
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t("Unexpected error"));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while deleting user."));
      });
  }

  /*
  * fill form with data of user
  */
  function fillFormWithDataUserInternational(data) {
    //fill data of user

    $("#position").val(data.position);
    $("#web_site").val(data.web_site);
    select_categories1.setValue(data.cat_interest_1);
    select_categories2.setValue(data.cat_interest_2);
    select_categories3.setValue(data.cat_interest_3);
    getSubcategories1(data.subcat_interest_1);
    getSubcategories2(data.subcat_interest_2);
    getSubcategories3(data.subcat_interest_3);
    select_model1.setValue(data.company_model);
    select_model2.setValue(data.company_model_2);
    select_model3.setValue(data.company_model_3);
    country.setValue(data.country);
    console.log(data);
    advisor.setValue(data.adviser);
  }

  /*
  * show tab base in step
  */
  function showTabBaseInternational(stepData) {
    let step = parseInt(stepData);
    switch (step) {
      case 2:
        $("#step_3_tab").addClass("active");
        $("#step_3").addClass("show active");
        $("#step_2").removeClass("active");
        $("#step_4").removeClass("active");
        //Add class complete to tab 1
        $("#step_2_svg").hide();
        $("#step_2_title").hide();
        $("#check_step_2").show();
        $("#step_3_title").show();
        $("#validate_progresss").css("width", "33%");
        $("#step_2").removeClass("show active");

        break;
      case 3:
        $("#step_4_tab").addClass("active");
        $("#step_4").addClass("show active");
        $("#step_3").removeClass("active");
        //Add class complete to tab 1
        $("#step_3_svg").hide();
        $("#step_3_title").hide();
        $("#check_step_3").show();
        $("#check_step_2").show();
        $("#step_2_svg").hide();
        $("#step_4_title").show();
        $("#validate_progresss").css("width", "53%");
        $("#step_3").removeClass("show active");
        $("#step_2").removeClass("show active");
        break;

      case 4:
        $("#step_5_tab").addClass("active");
        $("#step_5").addClass("show active");
        $("#step_4").removeClass("active");
        //Add class complete to tab 1
        $("#step_4_svg").hide();
        $("#step_4_title").hide();
        $("#check_step_4").show();
        $("#check_step_2").show();
        $("#step_2_svg").hide();
        $("#check_step_3").show();
        $("#step_3_svg").hide();
        $("#step_5_title").show();
        $("#validate_progresss").css("width", "73%");
        $("#step_4").removeClass("show active");
        $("#step_2").removeClass("show active");
        break;
      case 5:
        window.location.href = "/";
    }
  }

  /*
  * goback
  */
  function goBackInternational(step) {
    switch (step) {
      case 2:
        $("#step_2_tab").addClass("active");
        $("#step_2").addClass("show active");
        $("#step_3_tab").removeClass("active");
        //Add class complete to tab 1
        $("#step_2_svg").show();
        $("#step_2_title").show();
        $("#check_step_2").hide();
        $("#step_2_title").hide();
        $("#validate_progresss").css("width", "13%");
        $("#step_3").removeClass("show active");

        break;
      case 3:
        $("#step_3_tab").addClass("active");
        $("#step_3").addClass("show active");
        $("#step_4_tab").removeClass("active");
        //Add class complete to tab 1
        $("#step_3_svg").show();
        $("#step_3_title").show();
        $("#check_step_3").hide();
        $("#step_3_title").hide();
        $("#validate_progresss").css("width", "33%");
        $("#step_4").removeClass("show active");
        break;

      case 4:
        $("#step_4_tab").addClass("active");
        $("#step_4").addClass("show active");
        $("#step_5_tab").removeClass("active");
        //Add class complete to tab 1
        $("#step_4_svg").show();
        $("#step_4_title").show();
        $("#check_step_4").hide();
        $("#step_4_title").hide();
        $("#validate_progresss").css("width", "53%");
        $("#step_5").removeClass("show active");
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

      //call goback step 3
      $("#goback_buyer_3", context).click(function () {
        goBackInternational(2);
      });
      //call goback step 4
      $("#goback_buyer_4", context).click(function () {
        goBackInternational(3);
      });
      //call goback step 5
      $("#goback_buyer_5", context).click(function () {
        goBackInternational(4);
      });

      //call cancel proccess 2
      $("#cancel_buyer_2", context).click(function () {
        cancelProcessInternational();
      });
      //call cancel proccess 3
      $("#cancel_buyer_3", context).click(function () {
        cancelProcessInternational();
      });
      //call cancel proccess 4
      $("#cancel_buyer_4", context).click(function () {
        cancelProcessInternational();
      });
      //call cancel proccess 5
      $("#cancel_buyer_5", context).click(function () {
        cancelProcessInternational();
      });
      //hide cancel
      $("#hide_cancel_process_buyer", context).click(function () {
        hideCancelProcessInternational();
      });
      // delete user
      $("#delete_user_buyer", context).click(function () {
        deleteUserInternational();
      });
      //go to login
      $("#go_to_menu_buyer", context).click(function () {
        goToMenuBuyer();
      });
    }
  };


}(jQuery, Drupal));