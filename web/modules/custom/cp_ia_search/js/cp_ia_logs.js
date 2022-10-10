/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    let log_auditory;
    var filterLog = false;
    function init() {
        //init daterangepicker
        $('#update_date_log').daterangepicker({
            "locale": {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "applyLabel": "Aplicar",
                "cancelLabel": "Cancelar",
                "fromLabel": "Desde",
                "toLabel": "Hasta",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": [
                    "Do",
                    "Lu",
                    "Ma",
                    "Mi",
                    "Ju",
                    "Vi",
                    "Sa"
                ],
                "monthNames": [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                "firstDay": 1
            },
            "opens": "center"
        });

        log_auditory = $('#log_auditory').DataTable({
            "processing": true,
            "serverSide": true,
            "responsive": true,
            "scrollX": true,
            "stripe": false,
            "ajax": {
                "url": "/search/logs/get",
                "type": "POST",
                "data": function (d) {
                    if (filterLog) {
                        d.company_name = $('#nit_search').val();
                        d.country = $('#country').val();
                        d.update_date = $('#update_date_log').val();
                    }
                }
            },
            columns: [
                { data: 'created_at', title: 'Fecha' },
                { data: 'time', title: 'Hora' },
                { data: 'query', title: 'Query' },
                { data: 'company_name', title: 'Nombre de la empresa' },
                { data: 'country', title: 'País de origen' },
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
                            <button class="btn btn_download d-flex align-items-center" id="btn_download_report_log"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/carpeta.svg" class="me-2" style="width:24px"> Descargar Reporte</button>
                        </div>
                    </div>
                `);
            }
        });

    }

    //filter data form and refresh table with the new data
    function filter_log() {
        let company_name = $('#nit_search').val();
        let country = $('#country').val();
        let update_date = $('#update_date_log').val();
        filterLog = true;

        let data = {
            company_name: company_name,
            country: country,
            update_date: update_date
        }
        var formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        //load data with post ajax and insert in data table
        $.ajax({
            url: '/search/logs/get',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                log_auditory.clear().draw();
                log_auditory.rows.add(data).draw();
            }
        });
    }

    //download csv of actual page
    function download_csv_log() {
        console.log("ENTRO");
        var log = [];
        //get all log in the page
        var log = log_auditory.rows().data();
        //create csv
        var csv = 'Fecha,Hora,Query,Nombre de la empresa,País de origen \r \n';
        for (var i = 0; i < log.length; i++) {
            csv += log[i].created_at + ',' + log[i].time + ',' + log[i].query + ',' + log[i].company_name + ',' + log[i].country + '\r \n';
        }
        //download csv
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'log.csv';
        hiddenElement.click();
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

            setTimeout(function () {
                //call download csv
                $('#btn_download_report_log', context).click(function () {
                    download_csv_log();
                });
            }, 1000);

            $('#check-all-log', context).on('click', function () {
                if ($(this).is(':checked')) {
                    $('.log-checkbox').prop('checked', true);
                } else {
                    $('.log-checkbox').prop('checked', false);
                }
            });

            $('#clean-log', context).click(function () {
                window.location.reload();
            });

            //filter data buyer
            $('#filter-log', context).click(function () {
                filter_log();
            })

            //redirect back
            $('#back_table', context).click(function () {
                window.location.href = '/';
            }
            );
        }
    };


}(jQuery, Drupal));