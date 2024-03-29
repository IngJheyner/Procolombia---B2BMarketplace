/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    var production_chain_select;
    var departament_select;
    var select_cities;
    var modelo_de_negocio_select;
    var code_landline_select;
    var code_mobile_select;
    //initial config
    function init() {
        //show modal information
        $('#information').modal('show');
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

        getDataUser();
    }
    // open input file with button
    function openInputFile() {
        $("#logo").click();
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

    // remove logo file and hide image
    let isLogoRemove = false;
    function removeLogo() {
        $("#logo_img").hide();
        $("#logo_name").hide();
        $("#logo_img").attr("src", "");
        $("#logo_name").val("");
        $("#logo").val("");
        $("#prew").hide();
        $("#logo_sub").show();
        isLogoRemove = true;
    }

    //is url
    function isUrl(s) {
        var regexp =
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
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
            .catch(function (error ){
                // Display flex for alert-message-layout.
                $('#alert-message-layout').css('display', 'flex');
                // Show the button.
                $('#error-button').show();
                // Change button text.
                $('#error-button').text(Drupal.t('Contact Support'));
                // Animation for alert-message-layout.
                $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                // Change text of alert-message-layout tittle.
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of lert-message-layout message.
                $('#desc-error').text(Drupal.t("Error while getting cities"));
            })
    }


    /*
     *  Validate Form 1
     *  - logo is a image file and is required and is png and jpg and have size less than 2MB and dimension less than 200x200
     *  - business_name is required and is a string and have length less than 100
     *  - website is required and is url
     *  - productive_chain is required
     *  - description_business_spanish is required and is a string and have length less than 1000
     *  - description_business_english is required and is a string and have length less than 1000
     *  - production_chain is requerid
     *  - principal_code_ciiu is requerid
     *  - secondary_code_ciiu is optional
     *  - third_code_ciiu is optional
     *  - departament is requerid
     *  - ciudad is requerid
     */

    function validateForm1() {
        var logo = $("#logo").prop("files")[0];
        var business_name = $("#business_name").val();
        var website = $("#website").val();
        var description_business_spanish = $(
            "#description_business_spanish"
        ).val();
        var description_business_english = $(
            "#description_business_english"
        ).val();
        var production_chain = $("#production_chain").val();
        var principal_code_ciiu = $("#principal_code_ciiu").val();
        var secondary_code_ciiu = $("#secondary_code_ciiu").val();
        var departament = $("#departament").val();
        var ciudad = $("#ciudad").val();
        var modelo_de_negocio = $("#modelo_de_negocio").val();

        var message = "";
        var isValid = true;
        //check if logo is
        if (logo) {
            var file = logo.type;
            var fileSize = logo.size;
            var fileName = logo.name;
            var fileExtension = fileName.split(".").pop();
            if (fileExtension != "png" && fileExtension != "jpg") {
                message = Drupal.t("The logo is required to be an image file and must be png and jpg and less than 2MB in size and less than 200x200 in dimension");
                $("#logo_input").css("border-color", "#ba0c2f");
                $("#logo_name").css("border-color", "#ba0c2f");
                $("#error_logo_message").text(message)
                $("#error_logo").show();
                $("#error_logo")

                    ;
                isValid = false;
            } else {
                if (fileSize > 2000000) {
                    message = Drupal.t("The logo is required to be an image file and must be png and jpg and less than 2MB in size and less than 200x200 in dimension");
                    $("#logo_input").css("border-color", "#ba0c2f");
                    $("#logo_name").css("border-color", "#ba0c2f");
                    $("#error_logo_message").text(message)
                    $("#error_logo").show();
                    $("#error_logo")

                        ;
                    isValid = false;
                } else {
                    if (logo.width > 200 || logo.height > 200) {
                        message = Drupal.t("The logo is required to be an image file and must be png and jpg and less than 2MB in size and less than 200x200 in dimension");
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
        } else {
            if (isLogoRemove) {
                message = Drupal.t("The logo is required to be an image file and must be png and jpg and less than 2MB in size and less than 200x200 in dimension");
                $("#logo_input").css("border-color", "#ba0c2f");
                $("#logo_name").css("border-color", "#ba0c2f");
                $("#error_logo_message").text(message)
                $("#error_logo").show();
                $("#error_logo");
                isValid = false;
            }
        }

        if (business_name == "") {
            message = Drupal.t("Company name is required");
            $("#business_name").css("border-color", "#ba0c2f");
            $("#error_business_name_message").text(message)
            $("#error_business_name").show();
            $("#error_business_name")

                ;
            isValid = false;
        } else {
            if (business_name.length > 100) {
                message = Drupal.t("Company's name cannot be longer than 100 characters");
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
            message = Drupal.t("Website is required");
            $("#website").css("border-color", "#ba0c2f");
            $("#error_website_message").text(message)
            $("#error_website").show();
            $("#error_website")

                ;
            isValid = false;
        } else {
            if (!isUrl(website)) {
                message = Drupal.t("The website is not valid");
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

        if (description_business_spanish == "") {
            message = Drupal.t("Description in Spanish is required");
            $("#description_business_spanish").css("border-color", "#ba0c2f");
            $("#error_description_business_spanish_message").text(message)
            $("#error_description_business_spanish").show();
            isValid = false;
        } else {
            if (description_business_spanish.length > 1000) {
                message = Drupal.t("Spanish description must be less than 1000 characters.");
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
            message = Drupal.t("Description in English is required");
            $("#description_business_english").css("border-color", "#ba0c2f");
            $("#error_description_business_english_message").text(message)
            $("#error_description_business_english").show();
            isValid = false;
        } else {
            if (description_business_english.length > 1000) {
                message = Drupal.t("English description must be less than 1000 characters.");
                $("#description_business_english").css("border-color", "#ba0c2f");
                $("#error_description_business_english_message").text(message)
                $("#error_description_business_english").show();
                isValid = false;
            } else {
                $("#error_description_business_english").hide();
                $("#description_business_english").css("border-color", "#cccccc");
            }
        }

        if (production_chain == "") {
            message = Drupal.t("The production line is required");
            $("#production_chain_contain .ts-control").css("border-color", "#ba0c2f");
            $("#error_production_chain_message").text(message)
            $("#error_production_chain").show();
            isValid = false;
        } else {
            $("#error_production_chain").hide();
            $("#production_chain_contain .ts-control").css("border-color", "#cccccc");
        }
        if (principal_code_ciiu == "") {
            message = Drupal.t("The main CIIU code is required");
            $("#principal_code_ciiu").css("border-color", "#ba0c2f");
            $("#error_principal_code_ciiu").show();
            $("#error_principal_code_ciiu_message").text(message)

            isValid = false;
        } else {
            $("#error_principal_code_ciiu").hide();
            $("#principal_code_ciiu").css("border-color", "#cccccc");
        }

        if (departament == "") {
            message = Drupal.t("The department is required");
            $("#departament_contain .ts-control").css("border-color", "#ba0c2f");
            $("#error_departament_message").text(message)
            $("#error_departament").show();
            isValid = false;
        } else {
            $("#error_departament").hide();
            $("#departament_contain .ts-control").css("border-color", "#cccccc");
        }

        if (ciudad == "") {
            message = Drupal.t("The city is required");
            $("#ciudad_contain .ts-control").css("border-color", "#ba0c2f");
            $("#error_ciudad_message").text(message)
            $("#error_ciudad").show();
            isValid = false;
        } else {
            $("#error_ciudad").hide();
            $("#ciudad_contain .ts-control").css("border-color", "#cccccc");
        }

        if (modelo_de_negocio == "") {
            message = Drupal.t("The business model is required");
            $("#modelo_de_negocio_contain .ts-control").css("border-color", "#ba0c2f");
            $("#error_modelo_de_negocio_message").text(message)
            $("#error_modelo_de_negocio").show();
            isValid = false;
        } else {
            $("#error_modelo_de_negocio").hide();
            $("#modelo_de_negocio_contain .ts-control").css("border-color", "#cccccc");
        }

        return isValid;
    }

    /*
     *  Save user with fetch
     *  - Send data and update user
     */

    // variable to take the decision if is 0 not redirect if is 1 redirect
    var sw = 0

    function editForm1() {
        //start loading
        $("#loading_1").show();
        $("#save_1").hide();
        var data = {
            logo: $("#logo").prop("files")[0],
            business_name: $("#business_name").val(),
            website: $("#website").val(),
            description_business_spanish: $(
                "#description_business_spanish"
            ).val(),
            description_business_english: $(
                "#description_business_english"
            ).val(),
            production_chain: $("#production_chain").val(),
            principal_code_ciiu: $("#principal_code_ciiu").val(),
            secondary_code_ciiu: $("#secondary_code_ciiu").val(),
            departament: $("#departament").val(),
            ciudad: $("#ciudad").val(),
            modelo_de_negocio: $("#modelo_de_negocio").val(),
        };
        var formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }

        fetch("/editar/update_form1", {
            method: "POST",
            body: formData,
        })
            .then(function (response) {
                $("#loading_1").hide();
                $("#save_1").show();
                if (response.status == 200) {
                    //show question save
                    fetch("/mailing/send/change/data/col", {
                        method: "POST",
                    }).catch(function (error) {
                        // Display flex for alert-message-layout.
                        $('#alert-message-layout').css('display', 'flex');
                        // Show the button.
                        $('#error-button').show();
                        // Change button text.
                        $('#error-button').text(Drupal.t('Contact Support'));
                        // Animation for alert-message-layout.
                        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                        // Change text of alert-message-layout tittle.
                        $('#error-tittle').text(Drupal.t('Unexpected error'));
                        // Change text of lert-message-layout message.
                        $('#desc-error').text(Drupal.t("Cannot send e-mail for data change"));
                    });
                    successProcess();
                    setTimeout(() => {
                        if (sw == 0) {
                            //reload page
                            window.location.reload();
                        } else {
                            window.location.href = "/dashboard";
                        }
                    }, 2000);

                } else {
                    $("#question_modal").modal("hide");
                    // Display flex for alert-message-layout.
                    $('#alert-message-layout').css('display', 'flex');
                    // Show the button.
                    $('#error-button').show();
                    // Change button text.
                    $('#error-button').text(Drupal.t('Contact Support'));
                    // Animation for alert-message-layout.
                    $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                    // Change text of alert-message-layout tittle.
                    $('#error-tittle').text(Drupal.t('Unexpected error'));
                    // Change text of lert-message-layout message.
                    $('#desc-error').text(Drupal.t("Error while updating user's data"));
                }
            })
            .catch(function (error) {
                $("#loading_1").hide();
                $("#save_1").show();
                // Display flex for alert-message-layout.
                $('#alert-message-layout').css('display', 'flex');
                // Show the button.
                $('#error-button').show();
                // Change button text.
                $('#error-button').text(Drupal.t('Contact Support'));
                // Animation for alert-message-layout.
                $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                // Change text of alert-message-layout tittle.
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of lert-message-layout message.
                $('#desc-error').text(Drupal.t("Error while updating user's data"));
            });
    }

    //show question modal
    function showQuestionModal() {
        sw = 0
        $("#question_modal").modal("show");
    }

    //show question modal 1
    function showQuestionModal1() {
        sw = 1
        $("#question_modal").modal("show");
    }


    /*
     *  Validate Form 3
     *  - name is required and have max length of 20
     *  - last_name is required and have max length of 20
     *  - position_spanish is required and have max length of 50
     *  - country_code_landline is required
     *  - landline is required and is number and have max length of 20
     *  - country_code_mobile is required
     *  - mobile is required and is number and have max length of 20
     *  - contact_email is required and is email
     */
    function validateForm2() {
        var isValid = true;
        var message = "";
        var name = $("#name").val();
        var last_name = $("#last_name").val();
        var position_spanish = $("#position_spanish").val();
        var landline = $("#landline").val();
        var mobile = $("#mobile").val();
        var contact_email = $("#contact_email").val();

        if (name == "") {
            message = Drupal.t("Name is required");
            $("#name").css("border-color", "#ba0c2f");
            $("#error_name").show();
            $("#error_name_message").text(message)
            isValid = false;
        } else {
            if (name.length > 20) {
                message = Drupal.t("The name cannot be longer than 20 characters");
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
            message = Drupal.t("Last name is required");
            $("#last_name").css("border-color", "#ba0c2f");
            $("#error_last_name").show();
            $("#error_last_name_message").text(message)
            isValid = false;
        } else {
            if (last_name.length > 20) {
                message = Drupal.t("The last name cannot be longer than 20 characters");
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
            message = Drupal.t("Spanish position is required");
            $("#position_spanish").css("border-color", "#ba0c2f");
            $("#error_position_spanish_message").text(message)
            $("#error_position_spanish").show();
            isValid = false;
        } else {
            if (position_spanish.length > 50) {
                message = Drupal.t("The position in Spanish must be less than 1000 characters.");
                $("#position_spanish").css("border-color", "#ba0c2f");
                $("#error_position_spanish_message").text(message)
                $("#error_position_spanish").show();

                isValid = false;
            } else {
                $("#error_position_spanish").hide();
                $("#position_spanish").css("border-color", "#cccccc");
            }
        }
        if (landline == "") {
            message = Drupal.t("Phone line is required");
            $("#landline").css("border-color", "#ba0c2f");
            $("#error_landline").show();
            $("#error_landline_message").text(message)
            isValid = false;
        } else {
            if (landline.length > 20) {
                message = Drupal.t("Phone line must not be longer than 20 characters.");
                $("#landline").css("border-color", "#ba0c2f");
                $("#error_landline").show();
                $("#error_landline_message").text(message)

                isValid = false;
            } else {
                if (!landline.match(/^[0-9]+$/)) {
                    message = Drupal.t("The phone line should not have letters");
                    $("#landline").css("border-color", "#ba0c2f");
                    $("#error_landline").show();
                    $("#error_landline_message").text(message)

                    isValid = false;
                } else {
                    $("#error_landline").hide();
                    $("#landline").css("border-color", "#cccccc");
                }
            }
        }
        if (mobile == "") {
            message = Drupal.t("Cell phone is required");
            $("#mobile").css("border-color", "#ba0c2f");
            $("#error_mobile").show();
            $("#error_mobile_message").text(message)
            isValid = false;
        } else {
            if (mobile.length > 10) {
                message = Drupal.t("The cell phone must not have more than 10 digits");
                $("#mobile").css("border-color", "#ba0c2f");
                $("#error_mobile").show();
                $("#error_mobile_message").text(message)

                isValid = false;
            } else {
                if (!mobile.match(/^[0-9]+$/)) {
                    message = Drupal.t("The cell phone should not have letters");
                    $("#mobile").css("border-color", "#ba0c2f");
                    $("#error_mobile").show();
                    $("#error_mobile_message").text(message)

                    isValid = false;
                } else {
                    $("#error_mobile").hide();
                    $("#mobile").css("border-color", "#cccccc");
                }
            }
        }
        if (contact_email == "") {
            message = Drupal.t("Email is required and must be a valid email address");
            $("#contact_email").css("border-color", "#ba0c2f");
            $("#error_contact_email").show();
            $("#error_contact_email_message").text(message)
            isValid = false;
        } else {
            if (
                !contact_email.match(
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                )
            ) {
                message = Drupal.t("The email is invalid");
                $("#contact_email").css("border-color", "#ba0c2f");
                $("#error_contact_email").show();
                $("#error_contact_email_message").text(message)
                isValid = false;
            } else {

                $("#error_contact_email").hide();
                $("#contact_email").css("border-color", "#cccccc");
            }
        }

        return isValid;
    }

    /*
     * update data form 3 with nit
     *  - Send data and get nit of local storage
     */
    function updateForm2() {

        $("#loading_3").show();
        $("#save_3").hide();
        var data = {
            name: $("#name").val(),
            last_name: $("#last_name").val(),
            position_spanish: $("#position_spanish").val(),
            landline: $("#landline").val(),
            mobile: $("#mobile").val(),
            contact_email: $("#contact_email").val(),
            country_code_landline: code_landline_select.getSelectedCountryData().dialCode,
            country_code_mobile: code_mobile_select.getSelectedCountryData().dialCode,
        };
        var formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }

        fetch("/editar/update_form2", {
            method: "POST",
            body: formData,
        })
            .then(function (response) {
                if (response.status === 200) {
                    //show alert success
                    fetch("/mailing/send/change/data/col", {
                        method: "POST",
                    }).catch(function (error) {
                        // Display flex for alert-message-layout.
                        $('#alert-message-layout').css('display', 'flex');
                        // Show the button.
                        $('#error-button').show();
                        // Change button text.
                        $('#error-button').text(Drupal.t('Contact Support'));
                        // Animation for alert-message-layout.
                        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                        // Change text of alert-message-layout tittle.
                        $('#error-tittle').text(Drupal.t('Unexpected error'));
                        // Change text of lert-message-layout message.
                        $('#desc-error').text(Drupal.t("Cannot send e-mail for data change"));
                    });
                    successProcess();
                    setTimeout(() => {

                        window.location.reload();

                    }, 2000);
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
                    $('#error-tittle').text(Drupal.t('Unexpected error'));
                    // Change text of lert-message-layout message.
                    $('#desc-error').text(Drupal.t("Error while updating user's data"));
                }
                $("#question_modal2").modal("hide");
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
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of lert-message-layout message.
                $('#desc-error').text(Drupal.t("Error while updating user's data"));
            });

    }

    //show question modal 2
    function showQuestionModal2() {
        $("#question_modal2").modal("show");
    }
    /*
    * open modal to cancel process
    */
    function cancelProcess() {
        $("#cancel_modal").modal('show');
    }
    //show succes modal
    function successProcess() {
        $("#question_modal").modal("hide");

        $("#success_modal").modal('show');
    }

    /*
    * reload the page
    */
    function reloadPage() {
        window.location.reload();
    }
    /*
    * get data of user if not return 200 status code, use data_neo to fill form in other case fill form with data of user and show tab base in step + 1
    */
    function getDataUser() {
        fetch("/editar/get_logged_user", {
            method: "GET",
        }).then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    //show alert success
                    //redirect to pre-registro
                    //fill form with data of user
                    fillFormWithDataUser(data.data);
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
                    $('#error-tittle').text(Drupal.t('Unexpected error'));
                    // Change text of lert-message-layout message.
                    $('#desc-error').text(Drupal.t("Error while obtaining user data"));
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
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of lert-message-layout message.
                $('#desc-error').text(Drupal.t("Error while obtaining user data"));
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
        modelo_de_negocio_select.setValue(data.modelo_de_negocio);
        $("#principal_code_ciiu").val(data.principal_code_ciiu);
        $("#secondary_code_ciiu").val(data.secondary_code_ciiu);
        $("#third_code_ciiu").val(data.third_code_ciiu);
        $("#name").val(data.contact_name);
        $("#last_name").val(data.contact_lastname);
        $("#position_spanish").val(data.contact_position);
        $("#landline").val(data.contact_phone);
        $("#mobile").val(data.contact_cellphone);
        $("#contact_email").val(data.contact_email);

        //search country by dialCode
        var countryData = window.intlTelInputGlobals.getCountryData();
        let country_code_landline = countryData.filter(item => item.dialCode === data.country_code_landline)[0]
        const phoneInputField = document.querySelector("#country_code_landline");
        code_landline_select = window.intlTelInput(phoneInputField, {
            initialCountry: country_code_landline.iso2,
            separateDialCode: true,
        });

        let country_code_mobile = countryData.filter(item => item.dialCode === data.country_code_mobile)[0]
        console.log(country_code_mobile.iso2)
        const phoneInputField2 = document.querySelector("#country_code_mobile");
        code_mobile_select = window.intlTelInput(phoneInputField2, {
            initialCountry: country_code_mobile.iso2,
            separateDialCode: true,
        });

        //fill logo informatio
        var fileSize = data.company_logo_size / 1024;
        // show image
        $("#logo_img").attr("src", data.company_logo);
        $("#logo_img").show();
        $("#logo_name").val(data.company_logo_name + "(" + fileSize.toFixed(2) + "KB)");
        $("#logo_name").show();
        $("#prew").show();
        $("#logo_sub").hide();
    }


    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.edit_company_col = {
        attach: function (context, settings) {

            //if document is ready call init
            if (context === document && $("#production_chain").length > 0) {
                init();
            }
            //call function openInputFile
            $("#open_input_file", context).click(function () {
                openInputFile();
            });
            //call function onChangeLogo
            $("#logo", context).change(function () {
                onChangeLogo();
            });
            //call function removeLogo
            $("#remove_logo", context).click(function () {
                removeLogo();
            });
            //call function showQuestionModal
            $("#save_only", context).click(function () {
                if (validateForm1()) {
                    showQuestionModal(0);
                }
            });
            //call function showQuestionModal
            $("#save_1", context).click(function () {
                if (validateForm1()) {
                    showQuestionModal1();
                }
            });
            //call function saveUser
            $("#confirm_save", context).click(function () {
                editForm1(1);
            });

            //call function updateForm2
            $("#save_2", context).click(function () {
                if (validateForm2()) {
                    showQuestionModal2();
                }
            });
            $("#confirm_save2", context).click(function () {
                updateForm2();
            });
            //call function cancelProcess 1
            $("#cancel_process", context).click(function () {
                cancelProcess();
            });
            $("#cancel_process_1", context).click(function () {
                cancelProcess();
            });
            $("#cancel_process_2", context).click(function () {
                cancelProcess();
            });
            //call function hideCancelProcess
            $("#confirm_cancel", context).click(function () {
                reloadPage();
            });
            //call function getCities on input
            $("#departament", context).on("input", function () {
                getCities();
            });

            // remove display none toltip_content when description_business_spanish onInput  

            $("#description_business_spanish", context).on("input", function () {
                $("#notification_english").css("display", "block");
            });
        }
    };


}(jQuery, Drupal));