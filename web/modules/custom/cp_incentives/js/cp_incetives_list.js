/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    let incentives_list = [];
    let incentives_list_table;
    var filterLog = false;
    function init() {
        var msg ="";
        incentives_list_table = $('#incentives-list').DataTable({
            "processing": true,
            "serverSide": true,
            "responsive": true,
            "autoWidth": false,
            "scrollX": true,
            "stripe": false,
            "ajax": {
                "url": "/incentives/get_incentives",
                "type": "POST",
            },
            columns: [
                //put checkbox for check all columns in the first column
                {
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        return `
                        <label class="tick">
                            <input type="checkbox" value="${row.id}" id="rel-state-6">
                            <span class="check"></span>
                        </label>
                        `;
                    },
                    "title": `
                    <label class="tick">
                        <input type="checkbox" id="rel-state-6">
                        <span class="check"></span>
                    </label>
                    `,
                    "orderable": false,
                    "searchable": false,
                    //important min-width for checkbox column
                    "className": 'width-check',
                },
                {
                    "data": "characteristic",
                    "render": function (data, type, row, meta) {
                        if (window.location.href.indexOf("/en/") > -1) {
                            return row.characteristic;
                        } else {
                            return row.characteristic_spanish;
                        }
                        
                    },
                    "title": Drupal.t("Variables / Characteristics"),
                },
                {
                    "data": "description",
                    "render": function (data, type, row, meta) {
                        if (window.location.href.indexOf("/en/") > -1) {
                            return row.description;
                        } else {
                            return row.description_spanish;
                        }
                        
                    },
                    
                    "title": Drupal.t("Description"),
                    "className": 'width-description',
                },
                {
                    "data": "business_rules",
                    "render": function (data, type, row, meta) {
                        let html = '';
                        row.business_rules.map(function (item) {
                            if (item.min_measure && item.max_measure) {
                                html += `
                                <div class="business-td d-flex justify-content-between">
                                    <p style="width:50%">
                                        ${item.min_measure} - ${item.max_measure}
                                        ${window.location.href.indexOf("/en/") > -1 ?
                                            row.measurement_unit :
                                            row.measurement_unit == 'Hours'? 
                                                'Horas' :
                                                row.measurement_unit         
                                        }
                                    
                                    </p>
                                    <p style="width:50%"> ${item.given_points} ${Drupal.t("points")}</p>
                                </div>
                            `;
                            } else {
                                if (item.max_measure) {
                                    html += `
                                        <div class="business-td d-flex justify-content-between">
                                            <p style="width:50%">
                                            ${item.max_measure}
                                            ${window.location.href.indexOf("/en/") > -1 ?
                                                row.measurement_unit :
                                                row.measurement_unit == 'Views'?
                                                    'Vistas' :
                                                    row.measurement_unit == 'Stars'?
                                                        'Estrellas' :
                                                        row.measurement_unit
                                            }
                                            </p>
                                            <p style="width:50%">${item.given_points} ${Drupal.t("points")}</p>
                                        </div>
                                    `;
                                } else {
                                    html += `
                                        <div class="text-na text-align-center">
                                            N/A
                                        </div>
                                    `;
                                }
                            }
                        });
                        return html;
                    },
                    //blue background for this title
                    "title": `
                    <div class="business-rule-title">
                        <div class="business-num text-align-center">
                            <p>${Drupal.t("Business Rules")}</p>
                        </div>
                        <div class="business-rule-content d-flex justify-content-between">
                            <p style="width:50%" >${Drupal.t("Instruction")}</p>
                            <p style="width:50%">${Drupal.t("Points distribution")}</p>
                        </div>
                    </div>
                    `,
                    "className": 'width-business-rule',
                },
                {
                    "data": "business_rules",
                    "render": function (data, type, row, meta) {
                        //get max given_points
                        let max_given_points = 0;
                        row.business_rules.map(function (item) {
                            if (parseInt(item.given_points) > max_given_points) {
                                max_given_points = item.given_points;
                            }
                        }
                        );
                        return `<div class="business-rule"> ${max_given_points} ${Drupal.t("Points")}</div>`;
                    },
                    "title": Drupal.t("Total points"),
                },
                {
                    "data": "expiration_days",
                    "title": Drupal.t("Expiration time"),
                    "render": function (data, type, row, meta) {
                        return '<div class="">' + (row.expiration_days || 'N/A') + Drupal.t("Day(s)") + '</div>';
                    },
                    "className": 'width-expiration-days',
                },
                {
                    "data": "state",
                    "render": function (data, type, row, meta) {
                        //checked
                        var active = '';
                        var inactive = '';
                        if (window.location.href.indexOf("/en/") > -1) {
                            active = 'Active';
                            inactive = 'Inactive';
                        } else {
                            active = 'Activo';
                            inactive = 'Inactivo';
                        }

                        if (row.state == 1) {
                            return `
                            <div onclick="updateStatusRow(${row.id}, ${row.state})" class="swicher text-align-center mb-2">
                                <input id="input-${row.id}" name="input-${row.id}" checked type="checkbox"/>
                                <label for="input-${row.id}" class="label-default"></label>
                           </div>
                           <p class="text-na text-align-center m-0" style="color:#A1A5AA">${active}</p>
                            `;
                        }
                        //unchecked
                        else {
                            return `
                            <div onclick="updateStatusRow(${row.id}, ${row.state})" class="swicher text-align-center mb-2">
                                <input id="input-${row.id}" name="input-${row.id}" type="checkbox"/>
                                <label for="input-${row.id}" class="label-default"></label>
                           </div>
                           <p class="text-na text-align-center m-0" style="color:#A1A5AA">${inactive}</p>
                           `;
                        }
                    },
                    "title": Drupal.t("State"),
                },
                {
                    //editar
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        //get array of id business rules
                        incentives_list.push(row);
                        return `
                        <button onclick="openModalEdit(${incentives_list.length - 1})">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
                            <defs>
                                <linearGradient id="pen" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                                <stop offset="0" stop-color="#005ca4"/>
                                <stop offset="1" stop-color="#008cce"/>
                                </linearGradient>
                                <linearGradient id="box" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                                <stop offset="0" stop-color="#d88d00"/>
                                <stop offset="1" stop-color="#edc500"/>
                                </linearGradient>
                            </defs>
                            <g id="Grupo_2425" data-name="Grupo 2425" transform="translate(-2081 -244)">
                                <rect id="Rectángulo_2984" data-name="Rectángulo 2984" width="32" height="32" transform="translate(2081 244)" fill="none"/>
                                <g id="Grupo_1447" data-name="Grupo 1447" transform="translate(2088 250)">
                                <path id="Trazado_119" data-name="Trazado 119" d="M619.529,455.877l-.268.268-.005,0a1.263,1.263,0,0,1-1.76.022l-1.63-1.63a.632.632,0,1,1,.894-.894l1.376,1.375h0a.316.316,0,0,0,.447,0s.008,0,.012,0l.038-.038a1.263,1.263,0,0,0,0-1.787l-1.116-1.118a1.265,1.265,0,0,0-1.788,0l-1.45,1.451a2.52,2.52,0,0,1-1.763.717H602.88a1.58,1.58,0,0,0-1.58,1.58v12.007a1.58,1.58,0,0,0,1.58,1.58h12.007a1.581,1.581,0,0,0,1.58-1.58v-8.127a.316.316,0,0,0-.539-.223s0,0,0,0l-3.51,3.51a2.514,2.514,0,0,1-1.344.7,1.279,1.279,0,0,1-.292.037h-.1c-.038,0-.074,0-.113,0h-2.319a1.264,1.264,0,0,1-1.264-1.264v-2.319c0-.038,0-.075,0-.113v-.1a1.279,1.279,0,0,1,.037-.292,2.515,2.515,0,0,1,.7-1.344l1.343-1.342,0,0a.631.631,0,1,1,.855.925l-1.308,1.308a1.257,1.257,0,0,0-.359,1c0,.018-.005.035-.005.053v.948a1.264,1.264,0,0,0,1.264,1.264h.948c.018,0,.035,0,.052-.005a1.256,1.256,0,0,0,1-.359l4.06-4.06a1.226,1.226,0,0,1,.886-.315,1.264,1.264,0,0,1,1.264,1.264v9.163a2.527,2.527,0,0,1-2.528,2.528H602.564a2.528,2.528,0,0,1-2.528-2.528V455.511a2.529,2.529,0,0,1,2.528-2.528h9.953a1.255,1.255,0,0,0,.883-.361l1.438-1.438a2.528,2.528,0,0,1,3.575,0l1.118,1.118a2.528,2.528,0,0,1,0,3.575" transform="translate(-600.036 -450.445)" fill-rule="evenodd" fill="url(#pen)"/>
                                <path id="Trazado_120" data-name="Trazado 120" d="M632.984,464.382a.948.948,0,1,1-.948.948.949.949,0,0,1,.948-.948" transform="translate(-621.925 -459.978)" fill-rule="evenodd" fill="url(#box)"/>
                                </g>
                            </g>
                        </svg>                        
                        </button>`;
                    },
                    "title": Drupal.t("Edit"),
                    "className": 'width-edit',
                },
            ],
            "pageLength": 10,
            "lengthChange": false,
            "language": {
                "lengthMenu": "_MENU_ result",
                "zeroRecords": "Nothing found - sorry",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total records)",
                //total records
                "info": `${Drupal.t("Total records: ")}<span class='num_table'>_MAX_</span>`,
                "paginate": {
                    "first": "First",
                    "last": "Last",
                    "next": Drupal.t("Next "),
                    "previous": Drupal.t("Previous")
                }
            },
            //remove search box
            "searching": false,
        });

    }

    //update status
    function updateStatus(id, state) {
        let formData = new FormData();
        formData.append('id_criteria', id);
        if (state == 1) {
            formData.append('state', 0);
        } else {
            formData.append('state', 1);
        }

        fetch('/adviser/incentives/update/status', {
            method: 'POST',
            body: formData
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.status == 200) {
                //reload table
                incentives_list_table.ajax.reload();
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
                $('#desc-error').text(Drupal.t("Failed while updating status. Please try again later or contact support."));
            }
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
            $('#desc-error').text(Drupal.t("Failed while updating status. Please try again later or contact support."));
        });
    }

    const renderDoubleRuleModal = (criteria) => {
        console.log(criteria);
        //change text of id
        if (window.location.href.indexOf("/en/") > -1) {
            $('#title_1').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic));
            $('#characteristic_1').text(Drupal.t(criteria.characteristic));
            $('#description_1').text(Drupal.t(criteria.description));
        } else {
            $('#title_1').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic_spanish));
            $('#characteristic_1').text(Drupal.t(criteria.characteristic_spanish));
            $('#description_1').text(Drupal.t(criteria.description_spanish));
        }

        

        //update values of inputs
        $('#state_1').val(criteria.state);
        $('#expiration_days_1').val(criteria.expiration_days);
        let max = -1;
        criteria.business_rules.map((rule, index) => {
            console.log("rule", rule);
            console.log("index", index);
            $('#id_rule_' + index).val(rule.id);
            $('#min_measure_' + index).val(rule.min_measure);
            console.log('#max_measure_' + index, rule.max_measure);
            $('#max_measure_' + index).val(rule.max_measure);
            $('#given_points_' + index).val(rule.given_points);
            if (parseInt(rule.given_points) > max) {
                max = rule.given_points;
            }
        });
        $('#max_measure_1_1').val(max);
        //change onclick function
        $('#save_criteria_1').attr('onclick', 'updateRow(' + criteria.id + ', 1)');
        $('#modal_double_rule').modal('show');
    }

    const renderSingleRuleModal = (criteria) => {
        console.log(criteria);
        //change text of id
        if (window.location.href.indexOf("/en/") > -1) {
            $('#title_2').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic));
            $('#characteristic_2').text(Drupal.t(criteria.characteristic));
            $('#description_2').text(Drupal.t(criteria.description));
        } else {
            $('#title_2').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic_spanish));
            $('#characteristic_2').text(Drupal.t(criteria.characteristic_spanish));
            $('#description_2').text(Drupal.t(criteria.description_spanish));
        }
        


        //change text of .unit_measure class
        if (window.location.href.indexOf("/en/") > -1) {
            $('.unit_measure').text(Drupal.t(criteria.measurement_unit));
        } else {
            if (criteria.measurement_unit == 'Hours') {
                $('.unit_measure').text('Horas');
            }
            else if (criteria.measurement_unit == 'Stars') {
                $('.unit_measure').text('Estrellas');
            }
            else if (criteria.measurement_unit == 'Views') {
                $('.unit_measure').text('Vistas');
            } else {
                $('.unit_measure').text(Drupal.t(criteria.measurement_unit));
            }
        };

        //update values of inputs
        $('#state_2').val(criteria.state);
        $('#expiration_days_2').val(criteria.expiration_days);
        let max = -1;
        criteria.business_rules.map((rule, index) => {
            $('#id_rule_2_' + index).val(rule.id);
            $('#max_measure_2_' + index).val(rule.max_measure);
            $('#given_points_2_' + index).val(rule.given_points);
            if (parseInt(rule.given_points) > max) {
                max = rule.given_points;
            }
        });
        $('#max_measure_2_1_1').val(max);
        //change onclick function
        $('#save_criteria_2').attr('onclick', 'updateRow(' + criteria.id + ', 2)');
        $('#modal_simple_rule').modal('show');
    }

    const noRuleModal = (criteria) => {
        console.log(criteria);
        //change text of id
        
        if (window.location.href.indexOf("/en/") > -1) {
            $('#title_3').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic));
            $('#characteristic_3').text(Drupal.t(criteria.characteristic));
            $('#description_3').text(Drupal.t(criteria.description));
        } else {
            $('#title_3').text(Drupal.t("Criteria edition") + " " + Drupal.t(criteria.characteristic_spanish));
            $('#characteristic_3').text(Drupal.t(criteria.characteristic_spanish));
            $('#description_3').text(Drupal.t(criteria.description_spanish));
        }

        //update values of inputs
        $('#state_3').val(criteria.state);
        $('#expiration_days_3').val(criteria.expiration_days);
        criteria.business_rules.map((rule, index) => {
            $('#id_rule_3_' + index).val(rule.id);
            $('#given_points_3_' + index).val(rule.given_points);
        });
        //change onclick function
        $('#save_criteria_3').attr('onclick', 'updateRow(' + criteria.id + ', 3)');
        $('#modal_no_rule').modal('show');
    }

    //check if is number 
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0;;
    }

    const validateForm = (type) => {
        var isValid = true;
        var message = "";

        let state;
        let expiration_days;

        if (type == 1) {
            state = $('#state_1').val();
            expiration_days = $('#expiration_days_1').val();
        } else {
            if (type == 2) {
                state = $('#state_2').val();
                expiration_days = $('#expiration_days_2').val();
            } else {
                state = $('#state_3').val();
                expiration_days = $('#expiration_days_3').val();
            }
        }

        if (state == "") {
            isValid = false;
            message = Drupal.t("State is required");
            console.log(message);
            if (type == 1) {
                $('#state_1').css('border-color', 'rgb(186, 12, 47)');
                $("#error_state_1").show();
                $("#error_state_1_message").text(message);

            } else {
                if (type == 2) {
                    $('#state_2').css('border-color', 'rgb(186, 12, 47)');
                    $("#error_state_2").show();
                    $("#error_state_2_message").text(message)
                }else{
                    $('#state_3').css('border-color', 'rgb(186, 12, 47)');
                    $("#error_state_3").show();
                    $("#error_state_3_message").text(message)
                }
            }
        } else {
            if (type == 1) {
                $('#state_1').css('border-color', '#ced4da');
                $("#error_state_1").hide();
            } else {
                if (type == 2) {
                    $('#state_2').css('border-color', '#ced4da');
                    $("#error_state_2").hide();
                }else{
                    $('#state_3').css('border-color', '#ced4da');
                    $("#error_state_3").hide();
                }
            }
        }

        if (expiration_days == "") {
            isValid = false;
            message = Drupal.t("Expiration days are required");
            console.log(message);
            console.log(type);
            if (type == 1) {
                $('#expiration_days_1').css('border-color', 'rgb(186, 12, 47)');
                $("#error_expiration_days_1").show();
                $("#error_expiration_days_1_message").text(message);
                $('#expiration_days_1').next("span").css('border-color', 'rgb(186, 12, 47)');
            } else {
                if (type == 2) {
                    $('#expiration_days_2').css('border-color', 'rgb(186, 12, 47)');
                    $("#error_expiration_days_2").show();
                    $("#error_expiration_days_2_message").text(message);
                    $('#expiration_days_2').next("span").css('border-color', 'rgb(186, 12, 47)');
                }else{
                    $('#expiration_days_3').css('border-color', 'rgb(186, 12, 47)');
                    $("#error_expiration_days_3").show();
                    $("#error_expiration_days_3_message").text(message);
                    $('#expiration_days_3').next("span").css('border-color', 'rgb(186, 12, 47)');
                }
            }
        } else {
            if (!isNumber(expiration_days)) {
                isValid = false;
                message = Drupal.t("Expiration days must be a number");
                console.log(message);
                if (type == 1) {
                    $('#expiration_days_1').css('border-color', 'rgb(186, 12, 47)');
                    $("#error_expiration_days_1").show();
                    $("#error_expiration_days_1_message").text(message);
                    $('#expiration_days_1').next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (type == 2) {
                        $('#expiration_days_2').css('border-color', 'rgb(186, 12, 47)');
                        $("#error_expiration_days_2").show();
                        $("#error_expiration_days_2_message").text(message);
                        $('#expiration_days_2').next("span").css('border-color', 'rgb(186, 12, 47)');
                    }else{
                        $('#expiration_days_3').css('border-color', 'rgb(186, 12, 47)');
                        $("#error_expiration_days_3").show();
                        $("#error_expiration_days_3_message").text(message);
                        $('#expiration_days_3').next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            } else {
                if (type == 1) {
                    $('#expiration_days_1').css('border-color', '#ced4da');
                    $("#error_expiration_days_1").hide();
                    $('#expiration_days_1').next("span").css('border-color', '#ced4da');
                } else {
                    if (type == 2) {
                        $('#expiration_days_2').css('border-color', '#ced4da');
                        $("#error_expiration_days_2").hide();
                        $('#expiration_days_2').next("span").css('border-color', '#ced4da');
                    }else{
                        $('#expiration_days_3').css('border-color', '#ced4da');
                        $("#error_expiration_days_3").hide();
                        $('#expiration_days_3').next("span").css('border-color', '#ced4da');
                    }
                }
            }
        }

        if (type == 1) {
            //get values of inputs
            let min_measure_arr = [];
            let max_measure_arr = [];
            let given_points_arr = [];
            let index = 0;
            for (index; index < 3; index++) {

                let min_measure = $('#min_measure_' + index).val();
                let max_measure = $('#max_measure_' + index).val();
                let given_points = $('#given_points_' + index).val();

                if (min_measure == "") {
                    isValid = false;
                    message = Drupal.t("Minimum value is required");
                    $("#min_measure_" + index).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_min_measure_" + index).show();
                    $("#error_min_measure_" + index + "_message").text(message);
                    $('#min_measure_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (!isNumber(min_measure)) {
                        isValid = false;
                        message = Drupal.t("Minimum value must be a number");
                        $('#min_measure_' + index).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_min_measure_" + index).show();
                        $("#error_min_measure_" + index + "_message").text(message)
                        $('#min_measure_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                    } else {
                        $("#error_measure_" + index).hide();
                        $('#min_measure_' + index).css("border-color", "#ced4da");
                        $('#min_measure_' + index).next("span").css('border-color', '#ced4da');
                    }
                }

                if (max_measure == "") {
                    isValid = false;
                    message = Drupal.t("Maximum value is required");
                    console.log(message);
                    $('#max_measure_' + index).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_max_measure_" + index).show();
                    $("#error_max_measure_" + index + "_message").text(message);
                    $('#max_measure_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (!isNumber(max_measure)) {
                        isValid = false;
                        message = Drupal.t("Maximum value must be a number");
                        console.log(message);
                        $('#max_measure_' + index).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_max_measure_" + index).show();
                        $("#error_max_measure_" + index + "_message").text(message);
                        $('#max_measure_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                    } else {
                        $("#error_max_measure_" + index).hide();
                        $("#max_measure_" + index).css("border-color", "#ced4da");
                        $('#max_measure_' + index).next("span").css('border-color', '#ced4da');
                    }
                }

                if (given_points == "") {
                    isValid = false;
                    message = Drupal.t("Given points are required");
                    console.log(message);
                    $('#given_points_' + index).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_given_points_" + index).show();
                    $("#error_given_points_" + index + "_message").text(message);
                    $('#given_points_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (!isNumber(given_points)) {
                        isValid = false;
                        message = Drupal.t("Given points must be a number");
                        console.log(message);
                        $('#given_points_' + index).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_given_points_" + index).show();
                        $("#error_given_points_" + index + "_message").text(message);
                        $('#given_points_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                    } else {
                        $("#error_given_points_" + index).hide();
                        $("#given_points_" + index).css("border-color", "#ced4da");
                        $('#given_points_' + index).next("span").css('border-color', '#ced4da');
                    }
                }

                min_measure_arr.push(min_measure);
                max_measure_arr.push(max_measure);
                given_points_arr.push(given_points);
            }

            //check if array is ascending
            for (let index = 0; index < min_measure_arr.length; index++) {
                if (index != 0) {
                    if (parseInt(min_measure_arr[index]) < parseInt(min_measure_arr[index - 1])) {
                        isValid = false;
                        message = Drupal.t("Minimum values must be greater than the previous one");
                        console.log(message);
                        $('#min_measure_' + (index - 1)).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_min_measure_" + (index - 1)).show();
                        $("#error_min_measure_" + (index - 1) + "_message").text(message);
                        $('#min_measure_' + (index - 1)).next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            }

            //check if array is ascending
            for (let index = 0; index < max_measure_arr.length; index++) {
                if (index != 0) {
                    if (parseInt(max_measure_arr[index]) < parseInt(max_measure_arr[index - 1])) {
                        isValid = false;
                        message = Drupal.t("Maximum values must be greater than the previous one");
                        console.log(message);
                        $('#max_measure_' + (index - 1)).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_max_measure_" + (index - 1)).show();
                        $("#error_max_measure_" + (index - 1) + "_message").text(message);
                        $('#max_measure_' + (index - 1)).next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            }

            //check if array is descending
            console.log(given_points_arr);
            for (let index = 0; index < given_points_arr.length; index++) {
                if (index != 0) {
                    if (parseInt(given_points_arr[index]) > parseInt(given_points_arr[index - 1])) {
                        isValid = false;
                        message = Drupal.t("Given points must be higher than the previous one");
                        console.log(message);
                        $('#given_points_' + (index - 1)).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_given_points_" + (index - 1)).show();
                        $("#error_given_points_" + (index - 1) + "_message").text(message);
                        $('#given_points_' + (index - 1)).next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            }
        } else if (type == 2) {
            //get values of inputs
            let max_measure_arr = [];
            let given_points_arr = [];
            for (let index = 0; index < 3; index++) {

                let max_measure = $('#max_measure_2_' + index).val();
                let given_points = $('#given_points_2_' + index).val();

                if (max_measure == "") {
                    isValid = false;
                    message = Drupal.t("Maximum value is required");
                    console.log(message);
                    $('#max_measure_2_' + index).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_max_measure_2_" + index).show();
                    $("#error_max_measure_2_" + index + "_message").text(message)
                    $('#max_measure_2_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (!isNumber(max_measure)) {
                        isValid = false;
                        message = Drupal.t("Maximum value must be a number");
                        console.log(message);
                        $('#max_measure_2_' + index).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_max_measure_2_" + index).show();
                        $("#error_max_measure_2_" + index + "_message").text(message);
                        $('#max_measure_2_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                    } else {
                        $("#error_max_measure_2_" + index).hide();
                        $("#max_measure_2_" + index).css("border-color", "#ced4da");
                        $('#max_measure_2_' + index).next("span").css('border-color', '#ced4da');
                    }
                }

                if (given_points == "") {
                    isValid = false;
                    message = Drupal.t("Given points are required");
                    console.log(message);
                    $('#given_points_2_' + index).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_given_points_2_" + index).show();
                    $("#error_given_points_2_" + index + "_message").text(message);
                    $('#given_points_2_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                } else {
                    if (!isNumber(given_points)) {
                        isValid = false;
                        message = Drupal.t("Given points must be a number");
                        console.log(message);
                        $('#given_points_2_' + index).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_given_points_2_" + index).show();
                        $("#error_given_points_2_" + index + "_message").text(message);
                        $('#given_points_2_' + index).next("span").css('border-color', 'rgb(186, 12, 47)');
                    } else {
                        $("#error_given_points_2_" + index).hide();
                        $("#given_points_2_" + index).css("border-color", "#ced4da");
                        $('#given_points_2_' + index).next("span").css('border-color', '#ced4da');
                    }
                }

                max_measure_arr.push(max_measure);
                given_points_arr.push(given_points);
            }

            //check if array is descending
            for (let index = 0; index < max_measure_arr.length; index++) {
                if (index != 0) {
                    if (parseInt(max_measure_arr[index]) > parseInt(max_measure_arr[index - 1])) {
                        isValid = false;
                        message = Drupal.t("The maximum values must be greater than the previous one");
                        console.log(message);
                        $('#max_measure_2_' + (index - 1)).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_max_measure_2_" + (index - 1)).show();
                        $("#error_max_measure_2_" + (index - 1) + "_message").text(message);
                        $('#max_measure_2_' + (index - 1)).next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            }

            //check if array is descending
            for (let index = 0; index < given_points_arr.length; index++) {
                if (index != 0) {
                    if (parseInt(given_points_arr[index]) > parseInt(given_points_arr[index - 1])) {
                        isValid = false;
                        message = Drupal.t("Given points must be higher than the previous one");
                        console.log(message);
                        $('#given_points_2_' + (index - 1)).css('border-color', 'rgb(186, 12, 47)');
                        $("#error_given_points_2_" + (index - 1)).show();
                        $("#error_given_points_2_" + (index - 1) + "_message").text(message);
                        $('#given_points_2_' + (index - 1)).next("span").css('border-color', 'rgb(186, 12, 47)');
                    }
                }
            }
        } else {
            let given_points = $('#given_points_3_' + 0).val();
            if (given_points == "") {
                isValid = false;
                message = Drupal.t("Given points are required");
                console.log(message);
                $('#given_points_3_' + 0).css('border-color', 'rgb(186, 12, 47)');
                $("#error_given_points_3_" + 0).show();
                $("#error_given_points_3_" + 0 + "_message").text(message);
                $('#given_points_3_' + 0).next("span").css('border-color', 'rgb(186, 12, 47)');
            } else {
                if (!isNumber(given_points)) {
                    isValid = false;
                    message = Drupal.t("Given points must be a number");
                    console.log(message);
                    $('#given_points_3_' + 0).css('border-color', 'rgb(186, 12, 47)');
                    $("#error_given_points_3_" + 0).show();
                    $("#error_given_points_3_" + 0 + "_message").text(message);
                    $('#given_points_3_' + 0).next("span").css('border-color', 'rgb(186, 12, 47)');
                }else{
                    $("#error_given_points_3_" + 0).hide();
                    $("#given_points_3_" + 0).css("border-color", "#ced4da");
                    $('#given_points_3_' + 0).next("span").css('border-color', '#ced4da');
                }
            }
        }

        return isValid;
    }

    const updateCriteria = (id, type) => {
        if (validateForm(type)) {
            //get values of inputs
            if (type == 1) {
                $('#save_criteria_1').hide();
                $('#loading_1').show();
            } else if (type == 2) {
                $('#save_criteria_2').hide();
                $('#loading_2').show();
            } else {
                $('#save_criteria_3').hide();
                $('#loading_3').show();
            }
            let state;
            let expiration_days;
            if (type == 1) {
                state = $('#state_1').val();
                expiration_days = $('#expiration_days_1').val();
            } else {
                if (type == 2) {
                    state = $('#state_2').val();
                    expiration_days = $('#expiration_days_2').val();
                } else {
                    state = $('#state_3').val();
                    expiration_days = $('#expiration_days_3').val();
                }
            }
            let formData = new FormData();
            formData.append('id_criteria', id);
            formData.append('state', state);
            formData.append('expiration_days', expiration_days);
            formData.append('has_rule', type == 3 ? "false" : "true");
            let business_rules = [];
            if (type == 1) {
                //get values of inputs
                for (let index = 0; index < 3; index++) {
                    let rule = {
                        "id": $('#id_rule_' + index).val(),
                        'min_measure': $('#min_measure_' + index).val(),
                        'max_measure': $('#max_measure_' + index).val(),
                        'given_points': $('#given_points_' + index).val(),
                    }
                    business_rules.push(rule);
                }
            } else if (type == 2) {
                //get values of inputs
                for (let index = 0; index < 3; index++) {
                    let rule = {
                        "id": $('#id_rule_2_' + index).val(),
                        'min_measure': null,
                        'max_measure': $('#max_measure_2_' + index).val(),
                        'given_points': $('#given_points_2_' + index).val(),
                    }
                    business_rules.push(rule);
                }
            } else {
                business_rules = {
                    "id": $('#id_rule_3_' + 0).val(),
                    'min_measure': null,
                    'max_measure': null,
                    'given_points': $('#given_points_3_' + 0).val(),
                }
            }
            formData.append('business_rules', JSON.stringify(business_rules));
            fetch('/adviser/incentives/update', {
                method: 'POST',
                body: formData
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data.status == 200) {
                    //reload table
                    incentives_list_table.ajax.reload();
                    $('#modal_double_rule').modal('hide');
                    $('#modal_simple_rule').modal('hide');
                    $('#modal_no_rule').modal('hide');
                } else {
                    $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                    $("#alert-message-layout").show();
                    console.log(data.message);
                }
                if (type == 1) {
                    $('#save_criteria_1').show();
                    $('#loading_1').hide();
                } else if (type == 2) {
                    $('#save_criteria_2').show();
                    $('#loading_2').hide();
                } else {
                    $('#save_criteria_3').show();
                    $('#loading_3').hide();
                }
            }).catch(function (error) {
                if (type == 1) {
                    $('#save_criteria_1').show();
                    $('#loading_1').hide();
                } else if (type == 2) {
                    $('#save_criteria_2').show();
                    $('#loading_2').hide();
                } else {
                    $('#save_criteria_3').show();
                    $('#loading_3').hide();
                }
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
                $('#desc-error').text(Drupal.t("Failed while updating criteria and business rules. Please try again later or contact support."));
                });
        }
    }
    function cleanInputsRules () {
        
        // Hide all <i> tags with error
        $(".input_error input").css("border-color", "#ced4da");
        $(".input_error i").hide();
        $(".input_error span").css("border-color", "#ced4da");

        
    }
    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.cp_ia_logs = {
        attach: function (context, settings) {

            //init
            if (context == document) {
                init();
            }

            window.openModalEdit = function (index) {
                console.log(index);
                console.log(incentives_list[index]);
                let row = incentives_list[index];
                if (row.business_rules.length == 1) {
                    //no has business rules only update total_points
                    console.log("No tiene reglas de negocio");
                    noRuleModal(row);
                } else {
                    //more than one business rule
                    if (row.business_rules[0].min_measure) {
                        console.log("Tiene reglas de negocio doble");
                        renderDoubleRuleModal(row);
                    } else {
                        console.log("Tiene reglas de negocio simple");
                        renderSingleRuleModal(row);
                    }
                }
            }

            window.updateStatusRow = function (index, state) {
                updateStatus(index, state);
            }

            window.updateRow = function (id, type) {
                console.log(id);
                updateCriteria(id, type);
            }

            //detect given_points_0 change
            $('#given_points_0').on('input', function () {
                let value = $(this).val();
                $('#max_measure_1_1').val(value);
            });

            
 
            $("#close-modal-edit-business-rule").click(function () {
                cleanInputsRules();
            });
            $("#close-modal-edit-business-rule-2").click(function () {
                cleanInputsRules();
            });
            $("#close-modal-edit-business-rule-3").click(function () {
                cleanInputsRules();
            });
            $("#cancel_process_1").click(function () {
                cleanInputsRules();
            });
            $('#given_points_2_0').on('input', function () {
                let value = $(this).val();
                $('#max_measure_2_1_1').val(value);
            });
        }
    };


}(jQuery, Drupal));