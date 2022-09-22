/*
 * Service for edit company col
 */

// open input file with button
(function ($, Drupal) {
    'use strict';
    //Global variables
    var tableBuyer;
    var tableExportadores;
    var filterExportadores = false;
    var filterBuyer = false;
    function init() {
        /*create datatable for buyers list
        * -- This table has paginate with send to endpoint /adviser/get_all_buyer_by_page and the data is in array buyers
        *///


        if ($('#buyers-list').length > 0) {
            tableBuyer = $('#buyers-list').DataTable({
                "processing": true,
                "serverSide": true,
                "responsive": true,
                "scrollX": true,
                "stripe": false,
                "ajax": {
                    "url": "/adviser/get_all_buyer_by_page",
                    "type": "POST",
                    "data": function (d) {
                        if (filterBuyer) {
                            d.company_name = $('#company_name_buyer').val();
                            d.category = $('#category').val();
                            d.subcat_interest_1 = $('#subcat_interest_1').val();
                            d.status = $('#status').val();
                            d.update_date = $('#update_date').val();
                        }
                    }
                },
                "columns": [
                    //put checkbox for check all columns in the first column
                    {
                        "data": "id",
                        "render": function (data, type, row, meta) {
                            return '<input id="buyer-checkbox-' + row.id + '" type="checkbox" class="buyer-checkbox" value="' + row.id + '">';
                        },
                        "title": '<input type="checkbox" id="check-all-buyer">'
                    },
                    //company name
                    {
                        "data": "company_name",
                        "title": "Company Name"
                    },
                    //email
                    {
                        "data": "email",
                        "title": "Email"
                    },
                    //lang
                    {
                        "data": "lang",
                        "title": "Language"
                    },
                    //country
                    {
                        "data": "country",
                        "title": "Country"
                    },
                    //subcategory
                    {
                        "data": "subcategory",
                        "title": "Subcategory"
                    },
                    //update date
                    {
                        "data": "update_date",
                        "title": "Update Date"
                    },
                    //status
                    {
                        "data": "status",
                        "title": "Status"
                    },
                    //action
                    {
                        "data": "id",
                        "render": function (data, type, row, meta) {
                            return '<a href="/asesor/editar/internacional?email=' + row.email + '" class=""><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/Editar.svg"></a>';
                        },
                        "title": "Action",
                        "className": "text-center"
                    }
                ],
                "columnDefs": [
                    //hide sort icon in the first column
                    {
                        "targets": 0,
                        "orderable": false,
                        "searchable": false,
                        "sortable": false,
                    },
                    //status column put class for color
                    /*
                    * Activo->green
                    * Inactivo->red
                    */
                    {
                        "targets": 7,
                        "render": function (data, type, row, meta) {
                            if (row.status == 'Aprobado') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle approved fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                            else if (row.status == 'Rechazado') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle declined fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                            else if (row.status == 'En-Espera') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle standby fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            } else {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle answer fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                        }
                    },
                    {
                        "targets": 8,
                        "data": null,
                        "render": function (data, type, row, meta) {
                            return '<a href="/adviser/buyer/' + row.id + '" class="btn btn-primary"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/Editar.svg"></a>';
                        },
                        "orderable": false,
                        "searchable": false,
                        "sortable": false,
                    }
                ],
                "pageLength": 20,
                "lengthMenu": [20, 50, 75, 100],
                "language": {
                    "lengthMenu": "_MENU_ result",
                    "zeroRecords": "Nothing found - sorry",
                    "infoEmpty": "No records available",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    //total records
                    "info": "Total records: <span id='total_number_exportador' class='num_table'>_MAX_</span>",
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
                    $('#buyers-list_length').after(`
                <div>
                    <div class="d-flex justify-content-between align-items-center nav_table">
                        <button class="btn btn_audit" id="btn-audit-log"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/icono-historialLog.svg" class="me-2"> Historial Log de auditoría</button>
                        <button class="btn btn_download" id="btn_download_report_buyer"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/carpeta.svg" class="me-2"> Descargar Reporte</button>
                    </div>
                    <div class="text_result">
                        {{ "Found "|t }}<span id="filter_total_buyer"></span> resultados asociados a tu búsqueda:
                    </div>
                </div>
                   
                `);
                }

            })
        } else {
            tableExportadores = $('#exportadores-list').DataTable({
                "processing": true,
                "serverSide": true,
                "responsive": true,
                //scrolleable in X at the top of rows
                "scrollX": true,
                "stripe": false,
                "ajax": {
                    "url": "/adviser/get_all_exportador_by_page",
                    "type": "POST",
                    "data": function (d) {
                        if (filterExportadores) {
                            d.nit = $('#nit_search').val();
                            d.company_name = $('#company_name').val();
                            d.status = $('#status').val();
                            d.published = $('#published').val();
                            d.productive_chain = $('#productive_chain').val();
                            d.deparment = $('#deparment').val();
                            d.advisor = $('#advisor').val();
                        }
                    }
                },
                "columns": [
                    //put checkbox for check all columns in the first column
                    {
                        "data": "id",
                        "render": function (data, type, row, meta) {
                            return '<input id="exportador-checkbox-' + row.id + '" type="checkbox" class="exportadores-checkbox" value="' + row.id + '">';
                        },
                        "title": '<input type="checkbox" id="check-all-exportadores">',
                    },
                    //NIT Empresa
                    {
                        "data": "nit",
                        "title": "NIT Empresa",
                    },
                    //Email empresa hidden
                    {
                        "data": "email",
                        "title": "Email",
                        "visible": false,
                    },
                    //company_name
                    {
                        "data": "company_name",
                        "title": "Company Name",
                    },
                    //lang
                    {
                        "data": "lang",
                        "title": "Language",
                    },
                    //company_logo is image
                    {
                        "data": "company_logo",
                        "title": "Company Logo",
                        "render": function (data, type, row, meta) {
                            return '<img src="' + row.company_logo + '" width="100px" height="100px">';
                        }
                    },
                    //company_deparment
                    {
                        "data": "company_deparment",
                        "title": "Company Department"
                    },
                    //company_city
                    {
                        "data": "company_city",
                        "title": "Company City"
                    },
                    //productive_chain
                    {
                        "data": "productive_chain",
                        "title": "Productive Chain",

                    },
                    //update_date
                    {
                        "data": "update_date",
                        "title": "Update Date"
                    },
                    //add See products as url that have string See products
                    {
                        "data": "id",
                        "render": function (data, type, row, meta) {
                            return '<a href="/adviser/exportador' + row.id + '" class="see_btn">See products</a>';
                        },
                        "title": "See products"
                    },
                    //published as string
                    {
                        "data": "id",
                        "title": "Published",
                        "render": function (data, type, row, meta) {
                            return 'Yes';
                        },
                    },
                    //status
                    {
                        "data": "status",
                        "title": "Status"
                    },
                    //views
                    {
                        "data": "id",
                        "title": "Views",
                        "className": "text-center",
                        "render": function (data, type, row, meta) {
                            return '<div class="toltip_i"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/Ojo_gris.svg" alt="" srcset="" class="img-views img-table" /><span class="tooltip-table">180</span></div>';
                        }
                    },
                    //incentives
                    {
                        "data": "id",
                        "title": "Incentives",
                        "className": "text-center",
                        "render": function (data, type, row, meta) {
                            return '<div class="toltip_i"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/gold.svg" alt="" srcset="" class="img-status" /><span class="tooltip-table">180</span></div>';
                        }
                    },
                    //action
                    {
                        "data": "id",
                        "render": function (data, type, row, meta) {
                            return '<a href="/asesor/editar/col?email=' + row.email + '" class=""><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/Editar.svg"></a>';
                        },
                        "title": "Action",
                        "className": "text-center"
                    }

                ],
                "columnDefs": [
                    //hide sort icon in the first column
                    {
                        "targets": 0,
                        "orderable": false,
                        "searchable": false,
                        "sortable": false,
                    },
                    //status column put class for color
                    /*
                    • Sin Respuesta – Color: Rojo
                    • En espera de Aprobación – Color: Amarillo
                    • Aprobado – Color: Verde
                    • Rechazado – Color: Morado
                    */
                    {
                        "targets": 12,
                        "render": function (data, type, row, meta) {
                            if (row.status == 'Aprobado') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle approved fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                            else if (row.status == 'Rechazado') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle declined fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                            else if (row.status == 'En-Espera') {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle standby fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            } else {
                                return '<div class="toltip_i text-center"><i class="bx bxs-circle circle answer fs-4 py-2"></i><span class="tooltip-table">' + row.status + '</span></div>';
                            }
                        }
                    },
                ],
                "pageLength": 20,
                "lengthMenu": [20, 50, 75, 100],
                "language": {
                    "lengthMenu": "_MENU_ result",
                    "zeroRecords": "Nothing found - sorry",
                    "infoEmpty": "No records available",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    //total records
                    "info": "Total records: <span id='total_number_exportador' class='num_table'>_MAX_</span>",
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
                    $('#exportadores-list_length').after(`
                    <div>
                        <div class="d-flex justify-content-between align-items-center nav_table">
                            <button class="btn btn_download" id="btn_download_report_exportador"><img src="http://52.201.168.42/sites/default/files/matchmaking/images/internal/carpeta.svg" class="me-2"> Descargar Reporte</button>
                        </div>
                        <div class="text_result">
                        {{ "Found "|t }}<span id="filter_total_exportador"></span> resultados asociados a tu búsqueda:
                        </div>
                    </div>
                `);
                }

            })
        }
        //end datatable
    }

    //download csv of actual page
    function download_csv_buyer() {
        console.log("ENTRO");
        var buyers = [];
        //get all buyers in the page
        var buyers = tableBuyer.rows().data();
        //create csv
        var csv = 'Company Name,Email,Language,Country,Subcategory,Update Date,Status' + '\r\n';
        for (var i = 0; i < buyers.length; i++) {
            //only concat if column 0 is checked
            if ($('#buyer-checkbox-' + buyers[i].id).is(':checked')) {
                csv += buyers[i].company_name + ',' + buyers[i].email + ',' + buyers[i].lang + ',' + buyers[i].country + ',' + buyers[i].subcategory + ',' + buyers[i].update_date + ',' + buyers[i].status + '\n';
            }
        }
        //download csv
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'buyers.csv';
        hiddenElement.click();
    }

    //download csv of actual page tablaExportadores
    function download_csv_exportador() {
        console.log("ENTRO");
        var exportadores = [];
        //get all buyers in the page
        var exportadores = tableExportadores.rows().data();
        //create csv
        var csv = 'Nit,Company Name,Language,Deparment,City,Productive Chain,Update Date,Status' + '\r\n';
        for (var i = 0; i < exportadores.length; i++) {
            //only concat if column 0 is checked
            if ($('#exportador-checkbox-' + exportadores[i].id).is(':checked')) {
                csv += exportadores[i].nit + ',' + exportadores[i].company_name + ',' + exportadores[i].lang + ',' + exportadores[i].company_deparment + ',' + exportadores[i].company_city + ',' + exportadores[i].productive_chain + ',' + exportadores[i].update_date + ',' + exportadores[i].status + '\n';
            }
        }
        //download csv
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'exportadores.csv';
        hiddenElement.click();
    }

    //filter data form and refresh table with the new data
    function filter_data_exportador() {
        //get data from form
        console.log("ENTRO");
        var nit = $('#nit_search').val();
        var company_name = $('#company_name').val();
        var status = $('#status').val();
        var published = $('#published').val();
        var productive_chain = $('#productive_chain').val();
        var deparment = $('#deparment').val();
        var advisor = $('#advisor').val();
        filterExportadores = true;

        let data = {
            'nit': nit,
            'company_name': company_name,
            'status': status,
            'published': published,
            'productive_chain': productive_chain,
            'deparment': deparment,
            'advisor': advisor
        }
        var formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        //load data with post ajax and insert in data table
        $.ajax({
            url: '/adviser/get_all_exportador_by_page',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                //refresh table with new data
                tableExportadores.clear().draw();
                tableExportadores.rows.add(data).draw();
                //set total filter_total_exportador
                $('#filter_total_exportador').text(data.recordsTotal);
            }
        });
    }

    //fecth subcategories 
    function getSubcategories(value = "") {
        //get departament
        var cat_interest_1 = $("#category").val();
        //put in form data
        var formData = new FormData();
        //put message of loading cities
        formData.append("cat_interest", cat_interest_1);
        //fetch cities
        fetch("/get_subcategories", {
            method: "POST",
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                //put options in select cities
                data.subcategories.map((subcategory) => {
                    //create option inside select cities
                    $("#subcat_interest_1").append(
                        `<option value="${subcategory.ID}">${subcategory.Name}</option>`
                    );
                });
            })
            .catch((error) => {
                alert(error);
            })
    }

    //filter data form and refresh table with the new data
    function filter_data_buyer() {
        //get data from form
        console.log("ENTRO");
        var company_name = $('#company_name_buyer').val();
        var category = $('#category').val();
        var subcat_interest_1 = $('#subcat_interest_1').val();
        var status = $('#status_buyer').val();
        var update_date = $('#update_date').val();

        filterBuyer = true;

        let data = {
            'company_name': company_name,
            'category': category,
            'subcat_interest_1': subcat_interest_1,
            'status': status,
            'update_date': update_date
        }
        var formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        //load data with post ajax and insert in data table
        $.ajax({
            url: '/adviser/get_all_buyer_by_page',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                //refresh table with new data
                tableBuyer.clear().draw();
                tableBuyer.rows.add(data).draw();
                //set total filter_total_buyer
                $('#filter_total_buyer').text(data.recordsTotal);
            }
        });
    }

    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.cp_pro_adviser = {
        attach: function (context, settings) {
            //call init
            if (context === document) {
                init();
            }
            //check all checkbox
            $('#check-all-buyer', context).on('click', function () {
                if ($(this).is(':checked')) {
                    $('.buyer-checkbox').prop('checked', true);
                } else {
                    $('.buyer-checkbox').prop('checked', false);
                }
            });
            $('#check-all-exportadores', context).on('click', function () {
                if ($(this).is(':checked')) {
                    $('.exportadores-checkbox').prop('checked', true);
                } else {
                    $('.exportadores-checkbox').prop('checked', false);
                }
            });
            //wait to button btn_download_report_buyer render in the page
            setTimeout(function () {
                //call download csv
                $('#btn_download_report_buyer', context).click(function () {
                    download_csv_buyer();
                });
            }, 1000);

            // redirect to review/adviser/user with log button
            setTimeout(function () {
                $('#btn-audit-log', context).click(function () {
                    window.location.href = '/adviser/audit-log';
                });
            }, 1000);

            //wait to button download_csv_exportador render in the page
            setTimeout(function () {
                //call download csv
                $('#btn_download_report_exportador', context).click(function () {
                    download_csv_exportador();
                });
            }, 1000);

            // redirect to review/adviser/user with log button
            setTimeout(function () {
                $('#btn-audit-log-exportador', context).click(function () {
                    window.location.href = '/adviser/audit-log';
                });
            }, 1000);

            //filter data exportador
            $('#filter-exportador', context).click(function () {
                filter_data_exportador();
                $(".text_result").show();
            });

            //clean values of form exportador
            $('#clean-exportador', context).click(function () {
                window.location.reload();
            });

            //filter data buyer
            $('#filter-buyer', context).click(function () {
                filter_data_buyer();
                $(".text_result").show();

            })

            //clean values of form buyer
            $('#clean-buyer', context).click(function () {
                window.location.reload();
            });

            //fill subcategory when category change
            $('#category', context).change(function () {
                getSubcategories();
            });
        }
    };


}(jQuery, Drupal));