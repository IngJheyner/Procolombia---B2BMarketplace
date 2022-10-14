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
                            <input type="checkbox" value="${row.id}" id="rel-state-6" checked="">
                            <span class="check"></span>
                        </label>
                        `;
                    },
                    "title": `
                    <label class="tick">
                        <input type="checkbox" id="rel-state-6" checked="">
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
                    "title": "Variables/Características"
                },
                {
                    "data": "description",
                    "render": function (data, type, row, meta) {
                        return '<div class="description">' + row.description + '</div>';
                    },
                    "title": "Descripción",
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
                                    <p style="width:50%"> ${item.min_measure} - ${item.max_measure} ${row.measurement_unit}</p>
                                    <p style="width:50%"> ${item.given_points} Puntos</p>
                                </div>
                            `;
                            } else {
                                if (item.max_measure) {
                                    html += `
                                        <div class="business-td d-flex justify-content-between">
                                            <p style="width:50%">${item.max_measure} ${row.measurement_unit}</p>
                                            <p style="width:50%">${item.given_points} Puntos</p>
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
                            <p>Reglas de negocio</p>
                        </div>
                        <div class="business-rule-content d-flex justify-content-between">
                            <p style="width:50%" >Instrucción</p>
                            <p style="width:50%">Distribución de puntos</p>
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
                    "title": "Tiempo de expiración",
                    "render": function (data, type, row, meta) {
                        return '<div class="">' + row.expiration_days + ' Dia(s) </div>';
                    },
                    "className": 'width-expiration-days',
                },
                {
                    "data": "state",
                    "render": function (data, type, row, meta) {
                        //checked
                        if (row.state == 1) {
                            return `
                            <div class="swicher text-align-center mb-2">
                                <input id="input-${row.id} " name="input-${row.id} " checked type="checkbox"/>
                                <label for="input-${row.id}" class="label-default"></label>
                           </div>
                           <p class="text-na text-align-center m-0" style="color:#A1A5AA">Activo</p>
                            `;
                        }
                        //unchecked
                        else {
                            return `
                            <div class="swicher text-align-center mb-2">
                                <input id="input-${row.id}" name="input-${row.id}" checked type="checkbox"/>
                                <label for="input-${row.id}" class="label-default"></label>
                           </div>
                           <p class="text-na text-align-center m-0" style="color:#A1A5AA">Inactivo</p>
                           `;
                        }
                    },
                    "title": "Estado"
                },
                {
                    //editar
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        //get array of id business rules
                        incentives_list.push(row);
                        return `
                        <button onclick="openModalEdit(${incentives_list.length-1})">
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
                    "title": "Editar",
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

            window.openModalEdit = function (index) {
                console.log(index);
                console.log(incentives_list[index]);
                let row = incentives_list[index];
                if (row.business_rules.length == 1) {
                    //no has business rules only update total_points
                    console.log("No tiene reglas de negocio");
                    $('#modal-edit-no-bussines').modal('show');
                } else {
                    //more than one business rule
                    console.log("Tiene reglas de negocio");
                    $('#modal-edit-bussines').modal('show');
                }
            }
        }
    };


}(jQuery, Drupal));