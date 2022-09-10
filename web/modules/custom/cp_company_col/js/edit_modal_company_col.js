/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';

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

    /*
    * Validate form edit contact company col
    * contact_email is required and must be a valid email address
    * password is required and have length less than 15 and more than 8 and have capital letter and number and special character
    * confirm_password is required and equal password
    */

    function validateForm() {
        var password = $("#password").val();
        var confirm_password = $("#confirm_password").val();
        var contact_email = $("#contact_email").val();
        var message = "";
        var isValid = true;

        if (password == "") {
            message = Drupal.t("Password is required");
            $("#password").css("border-color", "#ba0c2f");
            $("#error_password_message").text(message)
            $("#error_password").show();
            isValid = false;
        } else {
            if (password.length < 8 && password.length > 15) {
                message = Drupal.t("The password must be between 8 and 15 characters long");
                $("#password").css("border-color", "#ba0c2f");
                $("#error_password_message").text(message)
                $("#error_password").show();
                isValid = false;
            } else {
                if (!password.match(/[A-Z]/)) {
                    message = Drupal.t("The password must have at least one capital letter");
                    $("#password").css("border-color", "#ba0c2f");
                    $("#error_password_message").text(message)
                    $("#error_password").show();
                    isValid = false;
                } else {
                    if (!password.match(/[0-9]/)) {
                        message = Drupal.t("The password must have at least one number");
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
            message = Drupal.t("Verify password field is required");
            $("#confirm_password").css("border-color", "#ba0c2f");
            $("#error_confirm_password_message").text(message)
            $("#error_confirm_password").show();
            isValid = false;
        } else {
            if (password != confirm_password) {
                message = Drupal.t("The field verify password and Password must be the same");
                $("#confirm_password").css("border-color", "#ba0c2f");
                $("#error_confirm_password_message").text(message)
                $("#error_confirm_password").show();
                isValid = false;
            } else {
                $("#error_confirm_password").hide();
                $("#confirm_password").css("border-color", "#cccccc");
            }
        }

        if (contact_email == "") {
            message = Drupal.t("Email is required and must be a valid email addres");
            $("#contact_email").css("border-color", "#ba0c2f");
            $("#error_email").show();
            $("#error_email")

                ;
            isValid = false;
        } else {
            if (
                !contact_email.match(
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                )
            ) {
                message = Drupal.t("The email is invalid");
                $("#contact_email").css("border-color", "#ba0c2f");
                $("#error_email").show();
                $("#error_email")

                    ;
                isValid = false;
            } else {
                $("#error_email").hide();
                $("#email").css("border-color", "#cccccc");
            }
        }
        return isValid;
    }

    function updateData() {
        if (validateForm()) {
            $("#loading_3").show();
            $("#save_3").hide();
            var data = {
                password: $("#password").val(),
                confirm_password: $("#confirm_password").val(),
                contact_email: $("#contact_email").val(),
            };
            var formData = new FormData();
            for (var key in data) {
                formData.append(key, data[key]);
            }

            fetch("/dashboard/col/edit_email_password", {
                method: "POST",
                body: formData,
            })
                .then(function (response) {
                    if (response.status === 200) {
                        //reload page
                        window.location.reload();
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



    //
    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.edit_modal_company_col = {
        attach: function (context, settings) {
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

            //call function showQuestionModal
            $("#save_modal", context).click(function () {
                updateData();
            });
        }
    };


}(jQuery, Drupal));