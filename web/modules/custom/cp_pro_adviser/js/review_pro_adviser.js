/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    let log_auditory;
    function init() {
        //fill table with json log_auditory
        let data = {
            id: 1,
            advisor_name: 'test',
            advisor_email: 'test@test.com',
            company_name: 'test',
            update_date: '2019/01/01 - 17:00',
            status: 'Active',
        }
        log_auditory = $('#log_auditory').DataTable({
            data: [data],
            columns: [
                {
                    "data": "id",
                    "render": function (data, type, row, meta) {
                        return '<input type="checkbox" class="buyer-checkbox" value="' + row.id + '">';
                    },
                    "title": '<input type="checkbox" id="check-all-buyer">',
                },
                { data: 'advisor_name', title: 'Advisor Name' },
                { data: 'advisor_email', title: 'Advisor Email' },
                { data: 'company_name', title: 'Company Name' },
                { data: 'update_date', title: 'Update Date' },
                { data: 'status', title: 'Status' },
                {
                    data: null,
                    defaultContent: '<button class="btn btn-primary btn-sm" id="btn_edit">Edit</button>',
                    title: 'Edit'
                },
            ],
            "columnDefs": [
                {
                    "targets": [4],
                    "visible": false,
                    "searchable": false

                }
            ],
            "pageLength": 10,
            "lengthMenu": [10, 25, 50, 75, 100],
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
            //add header before table
            "initComplete": function (settings, json) {
                //add two buttons with justify-content between "Audit log history" and "Download Report"
                $('#log_auditory_length').after(`
                    <div>
                        <div class="d-flex justify-content-between align-items-center nav_table">
                            <button class="btn btn_audit" id="btn-audit-log-exportador"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/icono-historialLog.svg" class="me-2"> Historial Log de auditoría</button>
                            <button class="btn btn_download" id="btn_download_report_exportador"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/carpeta.svg" class="me-2"> Descargar Reporte</button>
                        </div>
                        <div class="text_result">
                            Se encontraron <span id="filter_total_exportador"></span> resultados asociados a tu búsqueda:
                        </div>
                    </div>
                `);
            }
        });

    }

    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.review_pro_adviser = {
        attach: function (context, settings) {

            //init
            if (context == document) {
                init();
            }
        }
    };


}(jQuery, Drupal));