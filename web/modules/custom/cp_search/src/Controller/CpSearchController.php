<?php
namespace Drupal\cp_search\Controller;

use Drupal;
use Drupal\node\Entity\Node;
use Drupal\Core\Controller\ControllerBase;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Form\FormStateInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

use Drupal\views\Views;
use Drupal\Component\Serialization\Json;

class CpSearchController extends ControllerBase {

  public function pageSearch($cat, $subcat) {
    //determine current languaje
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();

    // Get view
    $view = \Drupal\views\Views::getView('search_products');
    $view->setDisplay('page_1');
    $args_view = [
      'field_categorization_parent' => 'All',
      'field_categorization' => 'All',
      'title' => '',
      'export_markets' => '',
      'certifications' => 'All',
      'field_tariff_heading' => '',
      'productos-inn' => 'All',
      'ecom' => 'All',
    ];

    $description = '';
    $title_h1 = '';

    // Categorization
    $name_cat = NULL;
    $term_cat = NULL;
    if ($cat != 'none' && $subcat == 'none') {
      $cat = strtolower(str_replace(' ', '-', $cat));
      $tid_cat = $this->_cp_search_get_tid_by_url($cat);
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      if ($tid_cat && is_numeric($tid_cat)) {
        $args_view['field_categorization_parent'] = $tid_cat;
        $term_cat = Term::load(intval($tid_cat));
        if (!empty($term_cat)) {
          $uri_search_cat = $term_cat->get('field_uri_search')->getString();
          if ($term_cat->hasTranslation($lang)) {
            $term_cat = $term_cat->getTranslation($lang);
            $uri_search_cat = $term_cat->get('field_uri_search')->getString();
          }
          $name_cat = $term_cat->getName();
          if( strcmp($cat, $uri_search_cat) != 0 ){
            global $base_url;
            $url_product = ($lang == 'en') ? 'products' : 'productos' ;
            $url_redirect = $base_url . '/' . $lang . '/' . $url_product . '/' . $uri_search_cat ;
            // Redirect to url normalized
            return new RedirectResponse($url_redirect, 301);
          }
        } else {
          global $base_url;
          $url_actual = ($lang == 'en') ? $base_url . '/en/products' : $base_url . '/es/productos';
          return new RedirectResponse($url_actual, 301);
        }
      } else {
        global $base_url;
        $url_actual = ($lang == 'en') ? $base_url . '/en/products' : $base_url . '/es/productos';
        return new RedirectResponse($url_actual, 301);
      }
    }
    elseif ($subcat != 'none') {
      $subcat = strtolower(str_replace(' ', '-', $subcat));
      $cat = strtolower(str_replace(' ', '-', $cat));
      $tid_sub_cat = $this->_cp_search_get_tid_by_url($subcat);

      if ($tid_sub_cat && is_numeric($tid_sub_cat)) {
        $args_view['field_categorization'] = $tid_sub_cat;
      }

      if ($tid_sub_cat && is_numeric($tid_sub_cat)) {
        $term_subkat = Term::load(intval($tid_sub_cat));
        $term_cat = $term_subkat;
        $parents_subcat = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadParents(intval($tid_sub_cat));
        $parent_subcat_term = reset($parents_subcat);
        $description = $term_subkat->get('description')->value;
        if (!empty($term_subkat)) {
          $uri_search_subcat = $term_subkat->get('field_uri_search')->getString();
          if ($term_subkat->hasTranslation($lang)) {
            $term_subkat = $term_subkat->getTranslation($lang);
            $term_cat = $term_subkat;
            $description = $term_subkat->get('description')->value;
            $uri_search_subcat = $term_subkat->get('field_uri_search')->getString();
          }
          else {
            global $base_url;
            $url_actual = ($lang == 'en') ? $base_url . '/en/products' : $base_url . '/es/productos';
            return new RedirectResponse($url_actual, 301);
          }
          $name_subkat = $term_subkat->getName();
          // Get parent category uri string
          $parent_subcat_uri_search = $cat;
          if (!empty($parent_subcat_term)) {
            $parent_subcat_uri_search = $parent_subcat_term->get('field_uri_search')->getString();
            if ($parent_subcat_term->hasTranslation($lang)) {
              $parent_subcat_term = $parent_subcat_term->getTranslation($lang);
              $parent_subcat_uri_search = $parent_subcat_term->get('field_uri_search')->getString();
            }
          }
          // Compare url category and subcategory for redirect
          if( strcmp($subcat, $uri_search_subcat) != 0 || strcmp($cat, $parent_subcat_uri_search) != 0 ){
            global $base_url;
            $url_product = ($lang == 'en') ? 'products' : 'productos' ;
            $url_redirect = $base_url . '/' . $lang . '/' . $url_product . '/' . $parent_subcat_uri_search . '/' . $uri_search_subcat;
            // Redirect to url normalized
            return new RedirectResponse($url_redirect, 301);
          }
        } else {
          global $base_url;
          $url_actual = ($lang == 'en') ? $base_url . '/en/products' : $base_url . '/es/productos';
          return new RedirectResponse($url_actual, 301);
        }
      } else {
        global $base_url;
        $url_actual = ($lang == 'en') ? $base_url . '/en/products' : $base_url . '/es/productos';
        return new RedirectResponse($url_actual, 301);
      }
    }

    // Title
    if (isset($_GET['title'])) {
      $args_view['title'] = $_GET['title'];
    }

    // Tariff
    if (isset($_GET['tariff'])) {
      $args_view['field_tariff_heading'] = $_GET['tariff'];
    }

    // Export markets
    if (isset($_GET['export_markets'])) {
      $args_view['export_markets'] = $_GET['export_markets'];
    }

    // Certifications
    if (isset($_GET['certifications'])) {
      $args_view['certifications'] = $_GET['certifications'];
    }

    // dante producto innovador
    if (isset($_GET['productos-inn'])) {
      $args_view['productos-inn'] = $_GET['productos-inn'];
    }

    // ecom producto ecommerce
    if (isset($_GET['ecom'])) {
      $args_view['ecom'] = $_GET['ecom'];
    }

    $view->setExposedInput($args_view);
    $view->get_total_rows = TRUE;
    $view->execute();
    $num_elems = $view->total_rows;
    $view_render = $view->buildRenderable();
    $html_view = \Drupal::service('renderer')->render($view_render);

    // die(var_dump($view_render));

    // Currents paths
    global $base_url;
    $current_path = \Drupal::service('path.current')->getPath();
    $current_uri = \Drupal::request()->getRequestUri();

    $params = $this->_get_params_search();

    // Remove variable get page
    if (!empty($params) && isset($params['page'])) {
      unset($params['page']);
      $current_uri = ($lang == 'en') ? '/en/products' : '/es/productos';
      $current_uri .= '?';
      $cont_prm = 0;

      // New current uri
      foreach ($params as $key => $value) {
        if ($cont_prm > 0) {
          $current_uri .= '&';
        }
        $current_uri .= $key . '=' . urlencode($value);
        $cont_prm++;
      }
    }

    // Selected filters export markets
    $link_erase_all = NULL;
    $filters_selected = '<div class="filters-selected">';
    if (isset($params['export_markets']) && !empty($params['export_markets'])) {
      $filts_select_arr = explode(',', $params['export_markets']);
      if (!empty($filts_select_arr)) {

        // Clear all filters
        $url_clear = ($lang != 'en') ? '/' . $lang : '';
        $url_clear .= $current_path;
        $prmts_clear = $params;
        unset($prmts_clear['export_markets']);
        unset($prmts_clear['certifications']);
        if (!empty($prmts_clear)) {
          $url_clear .= '?';
          foreach ($prmts_clear as $key_clear => $val_param) {
            $url_clear .= $key_clear . '=' . $val_param;
          }
        }
        $link_erase_all = '<p><a href="' . $url_clear . '">' . t('Erase all') . '</a></p>';

        foreach ($filts_select_arr as $key => $name) {
          $url_href = ($lang != 'en') ? '/' . $lang : '';
          $url_href .= $current_path . '?';

          $ind = 0;
          foreach ($params as $key_param => $param) {
            if ($ind > 0) {
              $url_href .= '&';
            }
            if ($key_param == 'export_markets') {
              $list_export = explode(',', $param);
              if (in_array($name, $list_export)) {
                if (count($list_export) > 1) {
                  $key = array_search($name, $list_export);
                  unset($list_export[$key]);
                  $url_href .= 'export_markets=' . urlencode(implode(',', $list_export));
                }
                else {
                  $url_href = rtrim($url_href, "&");
                }
              }
              else {
                $url_href .= 'export_markets=' . urlencode(urldecode($param) . ',' . $name);
              }
            }
            else {
              $url_href .= $key_param . '=' . $param;
            }
            $ind++;
          }
          $filters_selected .= '<p><span><a href="' . $url_href . '">x</a></span>' . $name . '</p>';
        }
      }
    }
    $filters_selected .= '</div>';


    // Select html export markets
    $select_exp_mark = '<select class="filters-select export-location">';
    $select_exp_mark .= '<option value="none">' . t('Countries') . '</option>';
    if ($num_elems > 0) {

      // Get filters facets
      $urlWs = $this->_get_url_ws_json();
      $client = \Drupal::httpClient();
      // Only for PROCOLOMBIA QA environments
      // TODO: Make this parameterizable in drupal dashboard
      if (stripos($urlWs, 'qa') !== FALSE) {
        $request = $client->get($urlWs, ['auth' => ['root', 'master']]);
      } else {
        $request = $client->get($urlWs);
      }
      $json_resp = $request->getBody()->getContents();
      $resp = json_decode($json_resp, TRUE);

      if (!empty($resp)) {
        $exp_mark_info = [];
        foreach ($resp as $key => $value) {
          if (!empty($value['field_export_markets'])) {
            $tids_mark = explode(',', $value['field_export_markets']);
            foreach ($tids_mark as $key => $tid) {
              $int_tid = intval($tid);
              if (!isset($exp_mark_info[$int_tid])) {
                $term = Term::load($int_tid);
                if (!empty($term)) {
                  if ($term->hasTranslation($lang)) {
                    $term = $term->getTranslation($lang);
                  }
                  $name = $term->getName();
                  $exp_mark_info[$int_tid] = $name;
                }
              }
            }
          }
        }

        if (!empty($exp_mark_info)) {
          foreach ($exp_mark_info as $tid => $name) {
            $bool_add_opt = TRUE;
            if (empty($params)) {
              $url_href = $current_uri . '?' . 'export_markets=' . urlencode($name);
            }
            elseif (isset($params['export_markets'])) {
              $url_href = ($lang != 'en') ? '/' . $lang : '';
              $url_href .= $current_path . '?';

              $ind = 0;
              foreach ($params as $key_param => $param) {
                if ($ind > 0) {
                  $url_href .= '&';
                }
                if ($key_param == 'export_markets') {
                  $list_export = explode(',', $param);
                  if (in_array($name, $list_export)) {
                    $bool_add_opt = FALSE;
                  }
                  else {
                    $url_href .= 'export_markets=' . urlencode(urldecode($param) . ',' . $name);
                  }
                }
                else {
                  $url_href .= $key_param . '=' . $param;
                }
                $ind++;
              }
            }
            else {
              $url_href = $current_uri . '&export_markets=' . urlencode($name);
            }

            // Add option select
            if ($bool_add_opt) {
              $select_exp_mark .= '<option cdata-url="' . $url_href . '" value="' . $name . '">' . $name . '</option>';
            }
          }
        }
      }
    }
    $select_exp_mark .= '</select>';


    // Select html certifications
    $select_cert = '<select class="filters-select with-cert">';
    $opts_cert = [
      'All' => t('Certifications'),
      1 => t('Yes'),
      0 => t('No'),
    ];
    foreach ($opts_cert as $key => $val_cert) {
      if (empty($params) && is_numeric($key)) {
        $url_href_cert = $current_uri . '?' . 'certifications=' . $key;
      }
      elseif (empty($params)) {
        $url_href_cert = $current_uri;
      }
      elseif (!empty($params)) {
        $url_href_cert = ($lang != 'en') ? '/' . $lang : '';
        $url_href_cert .= $current_path . '?';
        $ind = 0;
        foreach ($params as $key_param => $param) {
          if ($ind > 0) {
            $url_href_cert .= '&';
          }

          if ($key_param == 'certifications' && !is_numeric($key)) {
            $url_href_cert = rtrim($url_href_cert, "&");
          }
          elseif ($key_param == 'certifications') {
            $url_href_cert .= 'certifications=' . $key;
            $ind++;
          }
          elseif ($key_param != 'certifications') {
            $url_href_cert .= $key_param . '=' . $param;
            $ind++;
          }

        }
        if (is_numeric($key) && !isset($params['certifications'])) {
          $url_href_cert .= '&certifications=' . $key;
        }
      }


      // Add to selected option
      if (isset($params['certifications']) && is_numeric($params['certifications'])
        && $params['certifications'] == $key) {

        $select_cert .= '<option selected="selected" cdata-url="' . $url_href_cert . '" value="' . $val_cert . '">' . $val_cert . '</option>';
      }
      else {
        $select_cert .= '<option cdata-url="' . $url_href_cert . '" value="' . $val_cert . '">' . $val_cert . '</option>';
      }
    }
    $select_cert .= '</select>';


    // Select html productos-inn
    $select_prod = '<div class="filters-select with-cert">';
    $opts_prod = [
      1 => t('Innovative products'),
    ];
    foreach ($opts_prod as $key => $val_cert) {
      $datPath = 'productos-inn=' . $key;
      if (empty($params) && is_numeric($key)) {
        $url_href_prod = $current_uri . '?' . 'productos-inn=' . $key;
      }
      elseif (empty($params)) {
        $url_href_prod = $current_uri;
      }
      elseif (!empty($params)) {
        $url_href_prod = ($lang != 'en') ? '/' . $lang : '';
        $url_href_prod .= $current_path . '?';
        $ind = 0;
        foreach ($params as $key_param => $param) {
          if ($ind > 0) {
            $url_href_prod .= '&';
          }

          if ($key_param == 'productos-inn' && !is_numeric($key)) {
            $url_href_prod = rtrim($url_href_prod, "&");
          }
          elseif ($key_param == 'productos-inn') {
            $url_href_prod .= 'productos-inn=' . $key;
            $ind++;
          }
          elseif ($key_param != 'productos-inn') {
            $url_href_prod .= $key_param . '=' . $param;
            $ind++;
          }

        }
        if (is_numeric($key) && !isset($params['productos-inn'])) {
          $url_href_prod .= '&productos-inn=' . $key;
        }
      }



      // Add to selected option
      if (isset($params['productos-inn']) && is_numeric($params['productos-inn'])
        && $params['productos-inn'] == $key) {
        $select_prod .= '<input type="checkbox" cdata-parametro="' . $datPath . '" checked cdata-url="' . $url_href_prod . '" value="' . $val_cert . '"><label for="' . $val_cert . '">' . $val_cert . '</label>';
      }
      else {
        $select_prod .= '<input type="checkbox" cdata-url="' . $url_href_prod . '" value="' . $val_cert . '"><label for="' . $val_cert . '">' . $val_cert . '</label>';
      }
    }
    $select_prod .= '</div>';

    // Select html productos-ecom
    $select_prod_ecom = '<div class="filters-select with-cert">';
    $opts_prod_ecom = [
      1 => t('Cross-border e-Commerce'),
    ];
    foreach ($opts_prod_ecom as $key => $val_cert) {
      $datPath = 'ecom=' . $key;
      if (empty($params) && is_numeric($key)) {
        $url_href_prod = $current_uri . '?' . 'ecom=' . $key;
      }
      elseif (empty($params)) {
        $url_href_prod = $current_uri;
      }
      elseif (!empty($params)) {
        $url_href_prod = ($lang != 'en') ? '/' . $lang : '';
        $url_href_prod .= $current_path . '?';
        $ind = 0;
        foreach ($params as $key_param => $param) {
          if ($ind > 0) {
            $url_href_prod .= '&';
          }

          if ($key_param == 'ecom' && !is_numeric($key)) {
            $url_href_prod = rtrim($url_href_prod, "&");
          }
          elseif ($key_param == 'ecom') {
            $url_href_prod .= 'ecom=' . $key;
            $ind++;
          }
          elseif ($key_param != 'ecom') {
            $url_href_prod .= $key_param . '=' . $param;
            $ind++;
          }

        }
        if (is_numeric($key) && !isset($params['ecom'])) {
          $url_href_prod .= '&ecom=' . $key;
        }
      }

      // Add to selected option
      if (isset($params['ecom']) && is_numeric($params['ecom'])
        && $params['ecom'] == $key) {
        $select_prod_ecom .= '<input type="checkbox" cdata-parametro="' . $datPath . '" checked cdata-url="' . $url_href_prod . '" value="' . $val_cert . '"><label for="' . $val_cert . '">' . $val_cert . '</label>';
      }
      else {
        $select_prod_ecom .= '<input type="checkbox" cdata-url="' . $url_href_prod . '" value="' . $val_cert . '"><label for="' . $val_cert . '">' . $val_cert . '</label>';
      }
    }
    $select_prod_ecom .= '</div>';

    if($term_cat){
      $description = $term_cat->get('description')->value;
      $title_h1 = $term_cat->get('field_titulo_h1')->value;
      if ($term_cat->hasTranslation($lang)) {
        $term_cat_trs = $term_cat->getTranslation($lang);
        $description = $term_cat_trs->get('description')->value;
        $title_h1 = $term_cat_trs->get('field_titulo_h1')->value;
      }
    }
    if( empty($title_h1) ){
      if(isset($name_subkat)){
        $title_h1 = $name_subkat;
      }elseif(isset($name_cat)){
        $title_h1 = $name_cat;
      }
    }

    return [
      '#theme' => 'cpSearch',
      '#html_view' => $html_view,
      '#filters_selected' => isset($filters_selected) ? $filters_selected : NULL,
      '#link_erase_all' => $link_erase_all,
      '#li_exp_mark' => $select_exp_mark,
      '#li_cert' => isset($select_cert) ? $select_cert : NULL,
      '#num_elems' => $num_elems,
      '#name_cat' => $name_cat,
      '#name_cat_description' => $description,
      '#name_subcat' => isset($name_subkat) ? $name_subkat : NULL,
      '#dante' => isset($select_prod) ? $select_prod : NULL,
      '#ecom' => isset($select_prod_ecom) ? $select_prod_ecom : NULL,
      '#title_h1' => $title_h1,
    ];
  }

  public function getChildrensCatg($tid_parent) {
    if (is_numeric($tid_parent)) {
      $resp = $this::_cp_search_get_categories_leve2($tid_parent);
      $new_resp = [];
      if (is_array($resp) && array_key_exists('options', $resp) && array_key_exists('uris', $resp)) {
        foreach ($resp['options'] as $key => $value) {
          $new_resp['options'][] = [
            'tid' => $key,
            'value' => $value,
          ];
        }
        foreach ($resp['uris'] as $key => $value) {
          $new_resp['uris'][] = [
            'tid' => $key,
            'value' => $value,
          ];
        }
      }
      $response = new Response();
      $response->setContent(json_encode($new_resp));
      $response->headers->set('Content-Type', 'application/json');
      return $response;
    }
  }


  public function dinamicTitleCat($cat) {
    return $this::getNameTermbyUri($cat);
  }


  public function dinamicTitleSubCat($subcat) {
    return $this::getNameTermbyUri($subcat);
  }


  public function getNameTermbyUri($uri) {
    $term_name = NULL;
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $tid = $this::_cp_search_get_tid_by_url($uri);
    if ($tid && is_numeric($tid)) {
      $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
      $term = $term->getTranslation($lang);
      $term_name = $term->name->value;
    }
    return $term_name;
  }


  public function _cp_search_get_tid_by_url($url_tax) {
    $query = \Drupal::database()->select('taxonomy_term__field_uri_search', 'tfu');
    $query->addField('tfu', 'entity_id');
    $query->addField('tfu', 'field_uri_search_value');
    $query->condition('tfu.bundle', 'categorization');
    $query->condition('tfu.field_uri_search_value', $url_tax);
    $result = $query->execute()->fetchAssoc();
    return $result['entity_id'];
  }

  public function _cp_search_get_taxonomy_name_by_tid_and_lang($tid, $lang, $vid) {
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->addField('tfd', 'name');
    $query->condition('tfd.tid', $tid);
    $query->condition('tfd.langcode', $lang);
    $query->condition('tfd.vid', $vid);
    $result = $query->execute()->fetchAssoc();
    return $result['name'];
  }

  public function _cp_search_get_taxonomy_tid_by_name($name, $vid) {
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->addField('tfd', 'tid');
    $query->condition('tfd.name', $name);
    $query->condition('tfd.vid', $vid);
    $result = $query->execute()->fetchAssoc();
    return $result['tid'];
  }


  public function _cp_search_get_categories_leve1() {
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $parents = [];
    $voc_name = 'categorization';

    $query = \Drupal::database()->query(
      "SELECT tfd.tid AS tid,
        tfd.name AS name,
        tfd.langcode AS langcode,
        tfus.field_uri_search_value AS field_uri_search_value,
        fm.uri AS uri,
        nfc.field_categorization_parent_target_id
      FROM node__field_categorization_parent nfc
        INNER JOIN node_field_data n ON n.nid = nfc.entity_id
        INNER JOIN taxonomy_term__parent tp
          ON nfc.field_categorization_parent_target_id = tp.entity_id
        INNER JOIN taxonomy_term_field_data tfd
          ON tp.entity_id = tfd.tid
        INNER JOIN taxonomy_term__field_uri_search tfus
          ON tp.entity_id = tfus.entity_id
        LEFT OUTER JOIN taxonomy_term__field_icon tfico
          ON tp.entity_id = tfico.entity_id
        LEFT OUTER JOIN file_managed fm
          ON tfico.field_icon_target_id = fm.fid
      WHERE tfus.langcode = :lang
      AND tfd.langcode = :lang
      AND tp.bundle = :voc_name
      AND tp.parent_target_id = :tid_parent
      AND n.status = :status
      GROUP by tfd.tid, tfd.name, tfd.langcode, tfus.field_uri_search_value, fm.uri, nfc.field_categorization_parent_target_id
      ORDER BY tfd.name ASC",
      [
        ':lang' => $lang,
        ':voc_name' => $voc_name,
        ':tid_parent' => 0,
        ':status' => 1,
      ]);
    $result = $query->fetchAll();

    //check if show only related categories on specialized offer
    $categories = [];
    $route = \Drupal::routeMatch();
    if ($route->getRouteName() == 'entity.taxonomy_term.canonical') {
      $term_id = $route->getRawParameter('taxonomy_term');
      // view machine name user_quick_view
      $view = Views::getView('specialized_offer_search_categories');
      $view->setDisplay('rest_export_1');
      // contextual relationship filter
      $view->setArguments([$term_id]);
      $render_view = $view->render();
      $json_resp = $render_view['#markup']->jsonSerialize();
      if(isset($json_resp) && !empty($json_resp) && !empty($render_view['#markup']->count())){
        $arr_resp = Json::decode($json_resp);
        foreach ($arr_resp as $category) {
          $categories[] = $category['tid'];
        }
      }
    }

    if (!empty($result)) {
      foreach ($result as $key => $value) {
        if(empty($categories) || in_array($value->tid, $categories)){
          $parents['options'][$value->tid] = $value->name;
          $parents['uris'][$value->tid] = $value->field_uri_search_value;
          $parents['icons_uris'][$value->tid] = [
            'name' => $value->name,
          ];
          if (!empty($value->uri)) {
            $real_uri_img = ImageStyle::load('icono')->buildUrl($value->uri);
          }
          else {
            try {
              $entity = Term::load($value->tid);
              if (!empty($entity)) {
                $field = $entity->get('field_icon');
                if ($field) {
                  $default_image = $field->getSetting('default_image');
                  if ($default_image && $default_image['uuid']) {
                    $uuid = $default_image['uuid'];
                    $entity_repository = Drupal::service('entity.repository');
                    $defaultIco = $entity_repository->loadEntityByUuid('file', $uuid);
                    if ($defaultIco) {
                      $icoUri = $defaultIco->getFileUri();
                      $real_uri_img = ImageStyle::load('icono')->buildUrl($icoUri);
                    }
                  }
                }
              }
            } catch (\Exception $e) {
              \Drupal::logger('get_field_icon')->notice($e->getMessage(), []);
            }
          }
          $parents['icons_uris'][$value->tid]['ico'] = $real_uri_img;
        }
      }
      return $parents;
    }
  }

  public function _cp_search_get_categories_leve2($tid_parent) {
    if (!empty($tid_parent)) {
      $resp = ['options' => [t('- Subcategory -')]];
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $voc_name = 'categorization';

      $query = \Drupal::database()->query(
        "SELECT tfd.tid AS tid,
        tfd.name AS name,
        tfd.langcode AS langcode,
        tfus.field_uri_search_value AS field_uri_search_value,
        nfc.field_categorization_target_id
      FROM node__field_categorization nfc
        INNER JOIN node_field_data n ON n.nid = nfc.entity_id
        INNER JOIN taxonomy_term__parent tp
          ON nfc.field_categorization_target_id = tp.entity_id
        INNER JOIN taxonomy_term_field_data tfd
          ON tp.entity_id = tfd.tid
        INNER JOIN taxonomy_term__field_uri_search tfus
          ON tp.entity_id = tfus.entity_id
      WHERE tfus.langcode = :lang
      AND tfd.langcode = :lang
      AND tp.bundle = :voc_name
      AND tp.parent_target_id = :tid_parent
      AND n.status = :status
      GROUP by tfd.tid, tfd.name, tfd.langcode, tfus.field_uri_search_value, nfc.field_categorization_target_id
      ORDER BY tfd.name ASC",
        [
          ':lang' => $lang,
          ':voc_name' => $voc_name,
          ':tid_parent' => $tid_parent,
          ':status' => 1,
        ]
      );
      $result = $query->fetchAll();

      if (!empty($result)) {
        $resp = [];
        foreach ($result as $key => $value) {
          $resp['options'][$value->tid] = $value->name;
          $resp['uris'][$value->tid] = $value->field_uri_search_value;
        }
      }
      return $resp;
    }
  }


  public function _cp_search_get_html_element_uris_categories($arr_uris) {
    if (!empty($arr_uris)) {
      $elem_html = '';
      foreach ($arr_uris as $tid => $uri) {
        $elem_html .= '<span tid="' . $tid . '">' . $uri . '</span>';
      }
      return $elem_html;
    }
  }


  public function _cp_search_get_url_search() {

    $arr_url = [];
    global $base_url;
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $current_path = \Drupal::service('path.current')->getPath();
    $current_uri = \Drupal::request()->getRequestUri();
    $params = \Drupal::request()->query->all();
    $root = $lang == 'en' ? 'products' : 'productos';

    // cdata-uri1
    $cdata_uri1 = $base_url . '/' . $lang . '/' . $root;

    $curr_url = explode('/', $current_uri);
    $arr_url['sector'] = NULL;
    if (isset($curr_url[3])) {
      $arr_url['sector'] = $curr_url[3];
    }

    $arr_url['subsector'] = NULL;
    if (isset($curr_url[4])) {
      $arr_url['subsector'] = explode('?', $curr_url[4])[0];
    }

    $arr_url['url1'] = $cdata_uri1;
    return $arr_url;
  }


  public function _cp_search_get_uri_search_taxonomy($tid) {
    if (!empty($tid) && is_numeric($tid)) {
      $uris = [];
      $voc_name = 'categorization';
      $query = \Drupal::database()->select('taxonomy_term__field_uri_search', 'tfus');
      $query->addField('tfus', 'field_uri_search_value');
      $query->addField('tfus', 'entity_id');
      $query->addField('tfus', 'langcode');
      $query->condition('tfus.bundle', $voc_name);
      $query->condition('tfus.entity_id', $tid);
      $result = $query->execute()->fetchAll();
      if (!empty($result)) {
        foreach ($result as $value) {
          $uris[$value->langcode] = $value->field_uri_search_value;
        }
      }
      return $uris;
    }

  }


  public function _cp_search_get_hierarchy_catgs_product($tid) {
    if ($tid && is_numeric($tid)) {
      $cats = [];
      $voc_name = 'categorization';
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $query = \Drupal::database()->select('taxonomy_term__parent', 'tp');
      $query->join('taxonomy_term_field_data', 'tfd', 'tp.entity_id = tfd.tid');
      $query->addField('tp', 'parent_target_id');
      $query->addField('tfd', 'name');
      $query->condition('tp.bundle', $voc_name);
      $query->condition('tp.entity_id', $tid);
      $query->condition('tfd.langcode', $lang);
      $result = $query->execute()->fetchAssoc();
      if (!empty($result)) {
        if (!empty($result['parent_target_id'])) {
          $cats['child']['tid'] = $result['parent_target_id'];
          $cats['child']['name'] = $result['name'];
          $query = \Drupal::database()->select('taxonomy_term__parent', 'tp');
          $query->join('taxonomy_term_field_data', 'tfd', 'tp.entity_id = tfd.tid');
          $query->addField('tp', 'parent_target_id');
          $query->addField('tfd', 'name');
          $query->condition('tp.bundle', $voc_name);
          $query->condition('tp.entity_id', $result['parent_target_id']);
          $query->condition('tfd.langcode', $lang);
          $result = $query->execute()->fetchAssoc();
          if (!empty($result)) {
            $cats['parent']['tid'] = $result['parent_target_id'];
            $cats['parent']['name'] = $result['name'];
          }
        }
        else {
          $cats['parent']['tid'] = $result['parent_target_id'];
          $cats['parent']['name'] = $result['name'];
        }
        return $cats;
      }
    }
  }


  public function _cp_search_get_img_cat_uri($tid) {
    if ($tid && is_numeric($tid)) {
      $cats = [];
      $imgUri = NULL;
      $voc_name = 'categorization';
      $query = \Drupal::database()->select('taxonomy_term__field_image', 'tfi');
      $query->join('file_managed', 'fm', 'tfi.field_image_target_id = fm.fid');
      $query->addField('fm', 'uri');
      $query->condition('tfi.entity_id', $tid);
      $query->condition('tfi.bundle', $voc_name);
      $result = $query->execute()->fetchAssoc();
      if (!empty($result)) {
        $imgUri = $result['uri'];
      }
      else {
        try {
          $term = Term::load($tid);
          if (!empty($term)) {
            $field = $term->get('field_image');
            if ($field) {
              $default_image = $field->getSetting('default_image');
              if ($default_image && $default_image['uuid']) {
                $entity_repository = Drupal::service('entity.repository');
                $uuid = $default_image['uuid'];
                $defaultImg = $entity_repository->loadEntityByUuid('file', $uuid);
                if ($defaultImg) {
                  $imgUri = $defaultImg->getFileUri();
                }
              }
            }
          }
        } catch (\Exception $e) {
          \Drupal::logger('get_default_field_image')->notice($e->getMessage(), []);
        }
      }
      return $imgUri;
    }
  }


  public function _cp_search_get_img_block_type_banner($type) {
    if ($type && is_numeric($type)) {
      $query = \Drupal::database()->select('block_content__field_banner', 'cfb');
      $query->join('block_content__field_type', 'cft', 'cfb.entity_id = cft.entity_id');
      $query->join('file_managed', 'fm', 'cfb.field_banner_target_id = fm.fid');
      $query->addField('fm', 'uri');
      $query->condition('cfb.bundle', 'banner');
      $query->condition('cft.field_type_value', $type);
      $result = $query->execute()->fetchAssoc();
      if (!empty($result)) {
        return $result['uri'];
      }
    }
  }


  protected function _get_url_ws_json() {
    global $base_url;
    global $base_path;
    $current_path = \Drupal::service('path.current')->getPath();
    $params = $this->_get_params_search();
    $url_ws = $base_url . '/products-json?';
    // $url_ws = 'https://nginx-procolombia-catalogo-develop.us.amazee.io/products-json?';

    if (!empty($params)) {
      foreach ($params as $key_param => $param) {
        switch ($key_param) {
          case 'export_markets':
            $url_ws .= 'export_markets=' . urlencode(strtolower($param)) . '&';
            break;

          case 'title':
            $url_ws .= 'title=' . urlencode(strtolower($param)) . '&';
            break;

          case 'tariff':
            $url_ws .= 'field_tariff_heading=' . urlencode(strtolower($param)) . '&';
            break;

          case 'certifications':
            if ($param == 'yes') {
              $param = 1;
            }
            elseif ($param == 'no') {
              $param = 0;
            }
            $url_ws .= 'certifications=' . urlencode($param) . '&';
            break;
        }
      }
    }

    $args = explode('/', ltrim($current_path, '/'));
    $count = count($args);

    if ($count > 1) {
      if ($count == 2) {
        $tid_cat = $this->_cp_search_get_tid_by_url($args[1]);
        if ($tid_cat && is_numeric($tid_cat)) {
          $url_ws .= 'field_categorization_parent=' . $tid_cat . '&';
        }
      }
      if ($count == 3) {
        $tid_sub_cat = $this->_cp_search_get_tid_by_url($args[2]);
        if ($tid_sub_cat && is_numeric($tid_sub_cat)) {
          $url_ws .= 'field_categorization=' . $tid_sub_cat . '&';
        }
      }
    }

    $url_ws = rtrim($url_ws, "&");
    return $url_ws;
  }


  public function _get_params_search() {
    $params = \Drupal::request()->query->all();

    // New export markets - Array pagination
    if (isset($params['export_markets']) && is_array($params['export_markets'])) {
      $new_filt_exp = NULL;
      foreach ($params['export_markets'] as $key => $val) {
        $tid_exp = $val['target_id'];
        $term_exp = Term::load(intval($tid_exp));
        if (!empty($term_exp)) {
          $new_filt_exp .= $term_exp->getName() . ',';
        }
      }
      if (!empty($new_filt_exp)) {
        $new_filt_exp = rtrim($new_filt_exp, ',');
        $params['export_markets'] = $new_filt_exp;
      }
    }

    // New export markets - Remove coma
    elseif (isset($params['export_markets']) && !empty($params['export_markets']) && $params['export_markets'][0] == ',') {
      $params['export_markets'] = ltrim($params['export_markets'], ',');
    }
    return $params;
  }


}

?>
