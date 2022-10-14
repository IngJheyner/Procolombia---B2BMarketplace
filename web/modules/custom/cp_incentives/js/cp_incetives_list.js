/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    let incentives_list;
    var filterLog = false;
    function init() {

        incentives_list = $('#incentives-list').DataTable({
            "processing": true,
            "serverSide": true,
            "responsive": true,
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
                        return '<input id="buyer-checkbox-' + row.id + '" type="checkbox" class="buyer-checkbox" value="' + row.id + '">';
                    },
                    "title": '<input type="checkbox" id="check-all-buyer">'
                },
                {
                    "data": "characteristic",
                    "title": "Variables/Características"
                },
                {
                    "data": "description",
                    "title": "Descripción"
                },
                {
                    "data": "business_rules",
                    "render": function (data, type, row, meta) {
                        let html = '';
                        row.business_rules.map(function (item) {
                            if (item.min_measure && item.max_measure) {
                                html += `
                                <div class="business-rule">
                                    ${item.min_measure} - ${item.max_measure} ${row.measurement_unit}
                                </div>
                            `;
                            } else {
                                if (item.max_measure) {
                                    html += `
                                        <div class="business-rule">
                                            ${item.max_measure} ${row.measurement_unit}
                                        </div>
                                    `;
                                } else {
                                    html += `
                                        <div class="business-rule">
                                            N/A
                                        </div>
                                    `;
                                }
                            }
                        });
                        return html;
                    },
                    "title": "Instrucción"
                },
                {
                    "data": "business_rules",
                    "render": function (data, type, row, meta) {
                        let html = '';
                        row.business_rules.map(function (item) {
                            if (item.min_measure || item.max_measure) {
                                html += `
                                    <div class="business-rule">
                                        ${item.given_points} Puntos
                                    </div>
                                `;
                            }

                        });
                        return html;
                    },
                    "title": "Ditribución de puntos"
                },
                {
                    "data": "business_rules",
                    "render": function (data, type, row, meta) {
                        //get max given_points
                        let max_given_points = 0;
                        row.business_rules.map(function (item) {
                            if (item.given_points > max_given_points) {
                                max_given_points = item.given_points;
                            }
                        }
                        );
                        return `<div class="business-rule"> ${max_given_points} Puntos</div>`;
                    },
                    "title": "Puntos totales"
                },
                {
                    "data": "expiration_days",
                    "title": "Tiempo de expiración"
                },
                {
                    "data": "state",
                    "render": function (data, type, row, meta) {
                        //checked
                        if (row.state == 1) {
                            return '<input id="state-checkbox-' + row.id + '" type="checkbox" class="state-checkbox" value="' + row.id + '" checked>';
                        }
                        //unchecked
                        else {
                            return '<input id="state-checkbox-' + row.id + '" type="checkbox" class="state-checkbox" value="' + row.id + '">';
                        }
                    },
                    "title": "Estado"
                },
                {
                    //editar
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        //get array of id business rules
                        return `<button onclick='openModalEdit(${JSON.stringify(row)})'>Editar</button>`;
                    },
                    "title": "Editar"
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
                "info": "Total records: <span class='num_table'>_MAX_</span>",
                "paginate": {
                    "first": "First",
                    "last": "Last",
                    "next": "Next",
                    "previous": "Previous"
                }
            },
            //remove search box
            "searching": false,
        });

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

            window.openModalEdit = function (row) {
                console.log(row);
                if (row.business_rules.length == 1) {
                    //no has business rules only update total_points
                    console.log("No tiene reglas de negocio");
                } else {
                    //more than one business rule
                    console.log("Tiene reglas de negocio");
                }
            }
        }
    };


}(jQuery, Drupal));