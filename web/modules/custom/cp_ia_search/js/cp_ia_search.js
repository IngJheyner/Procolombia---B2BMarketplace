(function ($, Drupal) {

  let page = 1;
  let limit = 10;
  const init = () => {
    const swiper = new Swiper('.swiper', {
      // Optional parameters
      slidesPerView: 4,
      spaceBetween: 30,
      loop: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    var swiper_new = new Swiper(".listcat", {
      slidesPerView: "auto",
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  };

  const getResults = (words, userId, origin, lang) => {
    fetch(`https://app-back-co1020-dev-search.azurewebsites.net/search/${lang}/${words}/${userId}/${origin}`)
      .then(response => response.json())
      .then(data => {
        //check if data is a string
        $('#loader-product').css('display', 'none');
        $('#content-products').show();
        console.log(data);
        if (typeof data === "string") {
          //render renderNotFound
          

          renderNotFound(words, userId);
        } else {
          renderCategories(data.categorias);
          $('#category-length').text(data.categorias.length + " categorías");
          getProducts(data.ids_productos, data.ids_empresas);
        }
      })
      .catch(error => {
        console.error(error);
      });

  };

  const getProducts = (ids, ids_empresas) => {
    console.log("getProducts");
    let formData = new FormData();
    //get page of url query parmas
    const urlParams = new URLSearchParams(window.location.search);
    page = urlParams.get('page') ? urlParams.get('page') : 1;
    formData.append("nids", ids);
    formData.append("page", page);
    formData.append("limit", limit);
    fetch(`/search/products/get`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        renderProducts(data.products);
        console.log("leng", ids.length)
        console.log("limit", limit)
        $('#total-uno').text(ids.length);
        $('#total-dos').text(ids.length);
        let totalPages = Math.ceil(ids.length / limit);
        renderPages(totalPages);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderPages = (totalPages) => {
    let html = '';
    console.log("renderPages");
    console.log(totalPages);
    const urlParams = new URLSearchParams(window.location.search);
    const words = urlParams.get('words');
    const userId = urlParams.get('userId');
    const origin = urlParams.get('origin');
    let url = `/search/products?words=${words}&userId=${userId}&origin=${origin}`;
    if (page !== 1) {
      html += `<li class="page-item"><a class="page-link" href="${url}&page=${parseInt(page) - 1}">Anterior</a></li>`;
    }
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${page == i && "active"}"><a class="page-link" href="${url + '&page=' + i}">${i}</a></li>`;
      }
    } else {
      //render the firts 4 pages and in the middle show dots and the last page
      if (page > 3 && page < totalPages - 3) {
        html += `<li class="page-item ${page == 1 && "active"}"><a class="page-link" href="${url + '&page=' + 1}">${1}</a></li>`;
        html += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
        html += `<li class="page-item ${page == page - 1 && "active"}"><a class="page-link" href="${url + '&page=' + page - 1}">${page - 1}</a></li>`;
        html += `<li class="page-item ${page == page && "active"}"><a class="page-link" href="${url + '&page=' + page}">${page}</a></li>`;
        html += `<li class="page-item ${page == (parseInt(page) + 1) && "active"}"><a class="page-link" href="${url + '&page=' + (parseInt(page) + 1)}">${parseInt(page) + 1}</a></li>`;
        html += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
        html += `<li class="page-item" ${page == parseInt(totalPages) && "active"}"><a class="page-link" href="${url + '&page=' + totalPages}">${totalPages}</a></li>`;
      } else {
        if (page <= 3) {
          html += `<li class="page-item ${page == 1 && "active"}"><a class="page-link" href="${url + '&page=' + 1}">${1}</a></li>`;
          html += `<li class="page-item ${page == 2 && "active"}"><a class="page-link" href="${url + '&page=' + 2}">${2}</a></li>`;
          html += `<li class="page-item ${page == 3 && "active"}"><a class="page-link" href="${url + '&page=' + 3}">${3}</a></li>`;
          html += `<li class="page-item ${page == 4 && "active"}"><a class="page-link" href="${url + '&page=' + 4}">${4}</a></li>`;
          html += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
          html += `<li class="page-item" ${page == parseInt(totalPages) && "active"}"><a class="page-link" href="${url + '&page=' + totalPages}">${totalPages}</a></li>`;
        } else {
          html += `<li class="page-item ${page == 1 && "active"}"><a class="page-link" href="${url + '&page=' + 1}">${1}</a></li>`;
          html += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
          html += `<li class="page-item ${page == (parseInt(totalPages) - 3) && "active"}"><a class="page-link" href="${url + '&page=' + (parseInt(totalPages) - 3)}">${parseInt(totalPages) - 3}</a></li>`;
          html += `<li class="page-item ${page == (parseInt(totalPages) - 2) && "active"}"><a class="page-link" href="${url + '&page=' + (parseInt(totalPages) - 2)}">${parseInt(totalPages) - 2}</a></li>`;
          html += `<li class="page-item ${page == (parseInt(totalPages) - 1) && "active"}"><a class="page-link" href="${url + '&page=' + (parseInt(totalPages) - 1)}">${parseInt(totalPages) - 1}</a></li>`;
          html += `<li class="page-item ${page == parseInt(totalPages) && "active"}"><a class="page-link" href="${url + '&page=' + totalPages}">${totalPages}</a></li>`;
        }
      }
    }
    if (page !== totalPages) {
      html += `<li class="page-item"><a class="page-link" href="${url}&page=${parseInt(page) + 1}">Siguiente</a></li>`;
    }
    $('#pagination').html(html);
  };

  const renderProducts = (data) => {
    console.log("renderProducts");
    let html = '';
    console.log(data);
    data.forEach(element => {
      html += `
      <div class="card-search bg-white p-3">
        <div class="row">
          <div class="col-lg-3">
            <img class="w-100" src="https://clubdelcafe.net/wp-content/uploads/2020/05/Logo-caf%C3%A9-juan-valdez.png">
          </div>
        <div class="col-lg-9">
          <p class="fs-3 tittle">${element.title}</p>
          <p class="desc" style="display: -webkit-box; max-width: 100%;-webkit-line-clamp: 3;-webkit-box-orient: vertical; overflow: hidden;">
            ${element.description}
          </p>
          <p class="cat">Empresa: <strong>${element.company}</strong></p>
          <p class="cat">Categoria: <strong>${element.category}</strong></p>
        </div>
      </div>
    </div>
      `
    });
    $('#product-list').html(html);
  };


  const renderCategories = (data) => {
    console.log("renderCategories");
    let html = '';
    if (data.length > 0) {
      data.forEach(element => {
        html += `
      <li>
        <div class="form-inline d-flex align-items-center py-1">
            <label class="tick">${element}
                <input type="checkbox">
                <span class="check"></span>
            </label>
        </div>
     </li>
    `
      });
    } else {
      html = `<li>
                  <div class="form-inline d-flex align-items-center py-1">
                      <label class="tick">No hay categorias
                          <input type="checkbox">
                          <span class="check"></span>
                      </label>
                  </div>
              </li>`
    }
    $('#list-cat-search').html(html);
    //$('#list-search-suggest').html(html);
  };

  const renderNotFound = (words, userId) => {
    //render not found
    console.log("renderNotFound");
    if (userId !== "indefinido") {
      //show notFound with login
      $('#not-found-login').show()
      $('#not-found-login-search').text('["' + words + '"]');
      $('#not-found').hide()
      $('#content-products').hide()
    } else {
      //show notFound without login
      $('#not-found-login').hide()
      $('#not-found-search').text('["' + words + '"]');
      $('#not-found').show()
      $('#content-products').hide()
    }
    saveLog(words);
  };

  const saveLog = (words) => {
    //fecth to save log in db and azure
    let formData = new FormData();
    formData.append("query", words);
    fetch(`/search/logs/save`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        alert(error);
      });
  };

  Drupal.behaviors.cp_ia_search = {
    attach: function (context, settings) {
      //init
      if (context == document) {
        init();
        console.log('init');
        //check if words, userId, origin are in url query params
        const urlParams = new URLSearchParams(window.location.search);
        const words = urlParams.get('words');
        const userId = urlParams.get('userId');
        const origin = urlParams.get('origin');
        //get language of url
        const lang = window.location.pathname.split('/')[1];
        console.log("BUSCAR")
        console.log(words, userId, origin);
        if (words && userId && origin) {
          $('#words-title').text(words);
          $('#words-filter').text('"' + words + '"');
          getResults(words, userId, origin, lang);
        }
      }
    }
  };
})(jQuery, Drupal);