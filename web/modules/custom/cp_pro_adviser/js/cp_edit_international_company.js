/*
 * Service for edit company international
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    var select_categories1;
    var select_categories2;
    var select_categories3;
    var select_subcategories1;
    var select_subcategories2;
    var select_subcategories3;
    var select_model1;
    var select_model2;
    var select_model3;
    var code_mobile_select;
    var country_select;
    var advisor;

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

    //is url
    function validateURL(s) {
        var regexp =
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
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

    function init() {
        new TomSelect('#langcode', {
            create: false,
            // use method disable()
            render: {
                option: function (data, escape) {
                    return `<div><img class="me-2 img-l" src="https://asesoftwaredevserver.evolutecc.com/sites/default/files/matchmaking/images/internal/Icono-Menu-Idioma-color.svg">${data.text}</div>`;
                },
                item: function (item, escape) {
                    return `<div><img class="me-2 img-l" src="https://asesoftwaredevserver.evolutecc.com/sites/default/files/matchmaking/images/internal/Icono-Menu-Idioma-color.svg">${item.text}</div>`;
                }
            },
        })

        select_categories1 = new TomSelect("#cat_interest_1", {
            create: false,
            sortField: {
                field: "text",
                direction: "asc"
            }
        });

        country_select = new TomSelect("#country", {
            create: false,
            sortField: {
                field: "text",
                direction: "asc"
            }
        });
        $("#information").modal('show');
        select_model1 = new TomSelect("#company_model", {
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


        //get data of user
        getDataUserInternational();
    }

    function validateForm() {
        var name = $("#name").val();
        var last_name = $("#last_name").val();
        var email = $("#email").val();
        var cellphone = $("#cellphone").val();
        var business_name = $("#business_name").val();
        var password = $("#password_buyer").val();
        var country = $("#country").val();
        var position = $("#position").val();
        var web_site = $("#web_site").val();
        var cat_interest_1 = $("#cat_interest_1").val();
        var subcat_interest_1 = $("#subcat_interest_1").val();
        var company_model = $("#company_model").val();
        var cat_interest_2 = $("#cat_interest_2").val();
        var subcat_interest_2 = $("#subcat_interest_2").val();
        var company_model_2 = $("#company_model_2").val();
        var cat_interest_3 = $("#cat_interest_3").val();
        var subcat_interest_3 = $("#subcat_interest_3").val();
        var company_model_3 = $("#company_model_3").val();
        var message = "";
        var isValid = true;

        if (name === "") {
            message = Drupal.t("Name is required\n");
            $("#name").css("border-color", "#ba0c2f");
            $("#error_name").show();
            $("#error_name_message").text(message)
            isValid = false;
        } else {
            if (name.length > 20) {
                message = Drupal.t("The name cannot be longer than 20 characters\n");
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
            message = Drupal.t("Lastname is required\n");
            $("#last_name").css("border-color", "#ba0c2f");
            $("#error_last_name").show();
            $("#error_last_name_message").text(message)
            isValid = false;
        } else {
            if (last_name.length > 20) {
                message = Drupal.t("The lastname cannot be longer than 20 characters\n");
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
            message = Drupal.t("Email is required and must be a valid email address.");
            $("#email").css("border-color", "#ba0c2f");
            $("#error_mail").show();
            $("#error_mail_message").text(message)
            isValid = false;
        } else {
            //check if mail server is valid
            if (email.indexOf("@gmail.com") > -1
                || email.indexOf("@yahoo.com") > -1
                || email.indexOf("@hotmail.com") > -1
                || email.indexOf("@outlook.com") > -1
                || email.indexOf("@live.com") > -1
                || email.indexOf("@msn.com") > -1) {
                message = Drupal.t("E-mail is invalid");
                $("#email").css("border-color", "#ba0c2f");
                $("#error_mail").show();
                $("#error_mail_message").text(message)
                isValid = false;
            } else {
                $('#error_mail').tooltip('hide')
                $("#error_mail").hide();
                $("#email").css("border-color", "#cccccc");
            }
        }

        if (cellphone === "") {
            message = Drupal.t("Cellphone is required\n");
            $("#cellphone").css("border-color", "#ba0c2f");
            $("#error_cellphone").show();
            $("#error_cellphone_message").text(message)
            isValid = false;
        } else {
            if (!isNumber(cellphone)) {
                message = Drupal.t("Cell phone must be a number");
                $("#cellphone").css("border-color", "#ba0c2f");
                $("#error_cellphone").show();
                $("#error_cellphone_message").text(message)
                isValid = false;
            } else {
                if (cellphone.length > 10) {
                    message = Drupal.t("Cell phone must not have more than 10 digits");
                    $("#cellphone").css("border-color", "#ba0c2f");
                    $("#error_cellphone").show();
                    $("#error_cellphone_message").text(message)
                    isValid = false;
                } else {
                    $("#cellphone").css("border-color", "#cccccc");
                    $("#error_cellphone").hide();
                }
            }
        }

        if (business_name === "") {
            message = Drupal.t("Company is required\n");
            $("#business_name").css("border-color", "#ba0c2f");
            $("#error_business_name").show();
            $("#error_business_name_message").text(message)
            isValid = false;
        } else {
            if (business_name.length > 100) {
                message = Drupal.t("The company name cannot be longer than 100 characters.\n");
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
            message = Drupal.t("Password is required");
            $("#password_buyer").css("border-color", "#ba0c2f");
            $("#error_password_buyer_message").text(message)
            $("#error_password_buyer").show();
            isValid = false;
        } else {
            if (password.length < 8 && password.length > 15) {
                message = Drupal.t("The password must be between 8 and 15 characters long");
                $("#password_buyer").css("border-color", "#ba0c2f");
                $("#error_password_buyer_message").text(message)
                $("#error_password_buyer").show();
                isValid = false;
            } else {
                if (!password.match(/[A-Z]/)) {
                    message = Drupal.t("The password must have at least one capital letter");
                    $("#password_buyer").css("border-color", "#ba0c2f");
                    $("#error_password_buyer_message").text(message)
                    $("#error_password_buyer").show();
                    isValid = false;
                } else {
                    if (!password.match(/[0-9]/)) {
                        message = Drupal.t("The password must have at least one number");
                        $("#password_buyer").css("border-color", "#ba0c2f");
                        $("#error_password_buyer_message").text(message)
                        $("#error_password_buyer").show();
                        $("#error_password_buyer")

                            ;
                        isValid = false;
                    } else {
                        if (!password.match(/[^a-zA-Z0-9]/)) {
                            message = Drupal.t("The password must have at least one special character");
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

        if (country == "") {
            message = Drupal.t("Please select a country");
            $("#country").css("border-color", "#ba0c2f");
            $("#error_country_message").text(message)
            $("#error_country").show();
            isValid = false;
        } else {
            $("#country").css("border-color", "#ccc");
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

        if (web_site != "") {
            if (!validateURL(web_site)) {
                message = Drupal.t("Please enter a valid website");
                $("#web_site").css("border-color", "#ba0c2f");
                $("#error_web_site_message").text(message)
                $("#error_web_site").show();
                isValid = false;
            } else {
                $("#web_site .ts-control").css("border-color", "#ccc");
                $("#error_web_site").hide();
            }
        }

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

    function updateUserBuyer() {
        if (validateForm()) {
            $("#loading_1").show();
            $("#save").hide();
            var name = $("#name").val();
            var last_name = $("#last_name").val();
            var email = $("#email").val();
            var cellphone = $("#cellphone").val();
            var business_name = $("#business_name").val();
            var password = $("#password_buyer").val();
            var country = $("#country").val();
            var position = $("#position").val();
            var web_site = $("#web_site").val();
            var cat_interest_1 = $("#cat_interest_1").val();
            var subcat_interest_1 = $("#subcat_interest_1").val();
            var company_model = $("#company_model").val();
            var cat_interest_2 = $("#cat_interest_2").val();
            var subcat_interest_2 = $("#subcat_interest_2").val();
            var company_model_2 = $("#company_model_2").val();
            var cat_interest_3 = $("#cat_interest_3").val();
            var subcat_interest_3 = $("#subcat_interest_3").val();
            var company_model_3 = $("#company_model_3").val();
            var advisor = $("#principal_advisor").val();


            var data = {
                name: name,
                last_name: last_name,
                email: email,
                cellphone: cellphone,
                business_name: business_name,
                password: password,
                country: country,
                position: position,
                web_site: web_site,
                cat_interest_1: cat_interest_1,
                subcat_interest_1: subcat_interest_1,
                company_model: company_model,
                cat_interest_2: cat_interest_2,
                subcat_interest_2: subcat_interest_2,
                company_model_2: company_model_2,
                cat_interest_3: cat_interest_3,
                subcat_interest_3: subcat_interest_3,
                company_model_3: company_model_3,
                advisor: advisor,
                country_code_mobile: code_mobile_select.getSelectedCountryData().dialCode,
            };

            var formData = new FormData();
            for (var key in data) {
                formData.append(key, data[key]);
            }

            fetch("/adviser/update/international", {
                method: "POST",
                body: formData,
            })
                .then(function (response) {
                    $("#loading_1").hide();
                    $("#save").show();
                    if (response.status == 200) {
                        $('#question_modal').modal('hide');
                        $('#success_modal').modal('show');
                        setTimeout(() => {
                            window.location.reload()
                        }, 2500);
                    } else {
                        alert(Drupal.t("Error while creating user") + " " + error);
                    }
                })
                .catch(function (error) {
                    $("#loading_1").hide();
                    $("#save").show();
                    alert(Drupal.t("Error while creating user") + " " + error);
                });

        }
    }

    //rejectUserBuyer
    function rejectUserBuyer() {
        $("#loading_2").show();
        $("#reject").hide();
        var email = $("#email").val();
        var data = {
            email: email,
        };
        let formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        fetch('/adviser/reject_user_international', {
            method: 'POST',
            body: formData,
        }).then(function (response) {
            $("#loading_2").hide();
            $("#reject").show();
            if (response.status == 200) {
                //send email reject
                fetch("/mailing/send/account/rejected/international",
                    {
                        method: "POST",
                        body: formData,
                    }
                ).catch(function (error) {
                    alert(error);
                });
                //return to dashboard
                window.location.href = '/dashboard/adviser/user/international';
            } else {
                alert(Drupal.t("Error rejecting user"));
            }
        }).catch(function (error) {
            $("#loading_2").hide();
            $("#reject").show();
            alert(Drupal.t("Error rejecting user"));
        });
    }

    //approveUserBuyer
    function approveUserBuyer() {
        $("#loading_3").show();
        $("#modal_aproved_user_buyer").hide();
        var email = $("#email").val();
        var data = {
            email: email,
        };
        let formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        fetch('/adviser/approve_user_international', {
            method: 'POST',
            body: formData,
        }).then(function (response) {
            $("#loading_3").hide();
            $("#modal_aproved_user_buyer").show();
            if (response.status == 200) {
                //send email approve
                fetch("/mailing/send/account/approved/international",
                    {
                        method: "POST",
                        body: formData,
                    }
                ).catch(function (error) {
                    alert(error);
                });
                //return to dashboard
                window.location.href = '/dashboard/adviser/user/international';
            } else {
                alert(Drupal.t("Error approving user"));
            }
        }).catch(function (error) {
            $("#loading_3").hide();
            $("#modal_aproved_user_buyer").show();
            alert(Drupal.t("Error approving user"));
        });
    }




    /*
    * get data of user if not return 200 status code, use data_neo to fill form in other case fill form with data of user and show tab base in step + 1
    */
    function getDataUserInternational() {
        //get email in query params
        var urlParams = new URLSearchParams(window.location.search);
        var email = urlParams.get('email');
        let formData = new FormData();
        formData.append("email", email);
        fetch("/adviser/get_international_user", {
            method: "POST",
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    //show alert success
                    //redirect to pre-registro
                    //fill form with data of user
                    fillFormWithDataUserInternational(data.data);
                    //show tab base in step
                }
            })
            .catch(function (error) {
                alert(error);
            });
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

    /*
    * fill form with data of user
    */
    function fillFormWithDataUserInternational(data) {
        //fill data of user
        $("#name").val(data.name);
        $("#last_name").val(data.lastname);
        $("#cellphone").val(data.cellphone);
        $("#business_name").val(data.business_name);
        $("#position").val(data.position);
        $("#email").val(data.email);
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
        country_select.setValue(data.country);
        advisor.setValue(data.advisor);


        var countryData = window.intlTelInputGlobals.getCountryData();

        let country_code_mobile = countryData.filter(item => item.dialCode === data.country_code_mobile)[0]
        console.log(country_code_mobile.iso2)
        const phoneInputField2 = document.querySelector("#country_code_mobile");
        code_mobile_select = window.intlTelInput(phoneInputField2, {
            initialCountry: country_code_mobile.iso2,
            separateDialCode: true,
        });
    }


    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.cp_edit_international_company = {
        attach: function (context, settings) {

            //if document is ready call init
            if (context === document && $("#cat_interest_1").length > 0) {
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



            //Open MOdal reject user
            $("#modal_reject_user_buyer", context).click(function () {
                if (validateForm()) {
                    $('#question_modal_3').modal('show');
                }
            });
            //Open MOdal approved user
            $("#modal_aproved_user_buyer", context).click(function () {
                if (validateForm()) {
                    $('#question_modal_2').modal('show');
                }
            });
            //Open MOdal confirm buyer
            $("#modal_confirm_save_buyer", context).click(function () {
                if (validateForm()) {
                    $('#question_modal').modal('show');
                }
            });
            $("#cancel_process", context).click(function () {
                $('#cancel_modal').modal('show');

            });
            // Cancel Process
            $("#confirm_cancel", context).click(function () {
                window.location.reload();

            });
            //update Data user
            $("#confirm_save_buyer", context).click(function () {
                updateUserBuyer();
            });
            //reject user
            $("#reject_user_buyer", context).click(function () {
                rejectUserBuyer();
            });
            //aproved user
            $("#aproved_user_buyer", context).click(function () {
                approveUserBuyer();
            });


        }
    };


}(jQuery, Drupal));