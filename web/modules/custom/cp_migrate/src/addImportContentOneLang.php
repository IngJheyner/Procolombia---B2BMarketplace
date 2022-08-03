<?php

namespace Drupal\cp_migrate;

use Drupal\node\Entity\Node;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\IReadFilter;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\redirect\Entity\Redirect;

class addImportContentOneLang {

  /**
   * addImportContentItemBothLangs
   * @param [type] $item     
   * @param [type] &$context
   */
  public static function addImportContentItemOneLang($item, &$context) {
    $context['sandbox']['current_item'] = $item;
    $message = 'Creating ' . $item['A'];
    $results = array();
    switch ($item['type']) {
      case 'categorization':
        create_categorization($item);
        break;

      case 'empresas':
        create_company($item);
        break;

      case 'productos':
        create_product($item);
        break;

      case 'old_companies':
        create_old_company($item);
        break;
        
    }
    $context['message'] = $message;
    $context['results'][] = $item;
  }

  /**
   * addImportContentItemCallback
   * @param [type] $success    
   * @param [type] $results    
   * @param [type] $operations
   */
  public static function addImportContentItemCallback($success, $results, $operations) {
    if ($success) {
      $message = \Drupal::translation()->formatPlural(
          count($results),
          'One item processed.', '@count items processed.'
      );
    }
    else {
        $message = t('Finished with an error.');
    }
    drupal_set_message($message);
  }
}


/**
* add node in data base.
*
* @param $item array.
*
*/
function create_company($item) {
  if (is_numeric(get_value($item['A'])) && !empty(get_value($item['E']))) {
    if (!get_nid_by_previus_id($item['A'])) {
      
      // Get logo
      if (!empty($item['R'])) {
        $logo = getImage($item['R'], date('Y-d'));
        if (!empty($logo)) {
          $fid_logo = $logo['target_id'];
        }
      }
      $lang = get_value($item['D']) != 'und' ? get_value($item['D']) : 'en';
      $title = get_value($item['E']);
      $title_uri = \Drupal::service('pathauto.alias_cleaner')->cleanString($title);
      $cpCoreController = new CpCoreController();

      // Url web
      $url_web = $item['O'];
      if (!filter_var($url_web, FILTER_VALIDATE_URL)) {
        if (stripos($url_web, 'www.') === 0) {
          $url_web = 'http://' . $url_web;
        }
      }
      
      $node = Node::create([
        'type' => 'company',
        'langcode' => $lang,
        'created' => \Drupal::time()->getRequestTime(),
        'changed' => \Drupal::time()->getRequestTime(),
        'uid' => get_user($item['C']),
        'title' => $title,
        'field_body' => [
           'value' => str_replace('|', '"', get_value($item['F'])),
        ],
         'field_logo' => !empty($fid_logo) ? [
           'target_id' => $fid_logo,
         ] : [],
        'field_web' => [
          'uri' => $url_web,
        ],
        'field_nit' => [
          'value' => $item['H'],
        ],
        'field_ubication_state' => !empty($item['Q']) ? [
          'target_id' => get_tid_by_previus_id($item['Q']),
        ] : [],
        'field_ubication_city' => !empty($item['P']) ? [
          'target_id' => get_tid_by_previus_id($item['P']),
        ] : [],
        'field_contact_name' => [
          'value' => $item['I'],
        ],
        'field_charge' => [
          'value' => $item['J'],
        ],
        'field_cellphone' => [
          'value' => $item['L'],
        ],
        'field_phone' => [
          'value' => $item['M'],
        ],
        'field_email' => [
          'value' => $item['K'],
        ],
        'field_previous_id' => [
          'value' => get_value($item['A']),
        ],
      ]);
      if ($item['G'] == 1) {
        $node->setPublished(TRUE);
      } else {
        $node->setPublished(FALSE);
      }
      $node->save();
      
      // Redirect 301
      $new_alias = $cpCoreController->get_name_alias_for_company_or_product(
        $node, 
        $lang, 
        'new'
      );
      $cpCoreController->execute_redirect_301_for_nodes(
        'company', 
        $title_uri, 
        $lang, 
        $new_alias
      );

      // Path alias
      $cpCoreController->create_node_path_alias($node, $lang);
    }
  }

}


/**
* add node in data base.
*
* @param $item array.
*
*/
function create_old_company($item) {

  if (is_numeric(get_value($item['A'])) && !empty(get_value($item['E']))) {
    if (!get_nid_by_previus_id($item['A'])) {
      // Get logo
      if (!empty($item['T'])) {
        $logo = getImage($item['T'], date('Y-d'));
        if (!empty($logo)) {
          $fid_logo = $logo['target_id'];
        }
      }
      $lang = get_value($item['D']) != 'und' ? get_value($item['D']) : 'en';
      $node = Node::create([
        'type' => 'old_company',
        'langcode' => $lang,
        'created' => \Drupal::time()->getRequestTime(),
        'changed' => \Drupal::time()->getRequestTime(),
        'uid' => get_user($item['C']),
        'title' => $item['E'],
        'body' => [
          'summary' => '',
          'value' => $item['F'],
          'format' => 'basic_html',
        ],
        'field_text_certifications' => [
          'value' => get_value($item['AE']),
        ],
        'field_city' => [
          'target_id' => get_tid_city_by_match_tax_name($item['J']),
        ],
        'field_neighborhood' => [
          'value' => get_value($item['L']),
        ],
        'field_position_1' => [
          'value' => get_value($item['U']),
        ],
        'field_position_2' => [
          'value' => get_value($item['AA']),
        ],
        'field_cellphone' => [
          'value' => get_value($item['N']),
        ],
        'field_contact_1' => [
          'value' => get_value($item['X']),
        ],
        'field_contact_2' => [
          'value' => get_value($item['Z']),
        ],
        'field_email' => [
          'value' => get_value($item['Q']),
        ],
        'field_fax' => [
          'value' => get_value($item['O']),
        ],
        'field_body_offer' => [
          'value' => get_value($item['R']),
        ],
        'field_address' => [
          'value' => get_value($item['K']),
        ],
        'field_mail_1' => [
          'value' => get_value($item['AI']),
        ],
        'field_id_empresa' => [
          'value' => get_value($item['H']),
        ],
        'field_logo_added' => [
          'value' => get_value($item['AC']),
        ],
        'field_mercados_destino' => [
          'value' => get_value($item['AF']),
        ],
        'field_nit' => [
          'value' => get_value($item['I']),
        ],
        'field_nom_status_company' => [
          'value' => get_value($item['AD']),
        ],
        'field_employees' => [
          'value' => get_value($item['W']),
        ],
        'field_comment' => [
          'value' => get_value($item['V']),
        ],
        'field_website' => [
          'value' => get_value($item['P']),
        ],
        'field_phone_1' => [
          'value' => get_value($item['Y']),
        ],
        'field_phone_2' => [
          'value' => get_value($item['AB']),
        ],
        'field_phone' => [
          'value' => get_value($item['M']),
        ],
        'field_sector' => [
          'target_id' => get_tid_by_previus_id($item['S']),
        ],
        'field_logo' => !empty($fid_logo) ? [
          'target_id' => $fid_logo,
        ] : [],
        'field_previous_id' => [
          'value' => get_value($item['A']),
        ],
        'field_previous_uri' => [
          'value' => get_value($item['AH']),
        ],
      ]);
      if ($item['G'] == 1) {
        $node->setPublished(TRUE);
      } else {
        $node->setPublished(FALSE);
      }
      $node->save();
    }
  }
}


/**
* add node in data base.
*
* @param $item array.
*
*/
function create_product($item) {

  $markets = [];
  $tids_markets = explode(',', $item['R']);
  if (count($tids_markets) > 0) {
    foreach ($tids_markets as $value) {
      if (get_tid_by_previus_id($value) > 0) {
        $markets[]['target_id'] = get_tid_by_previus_id($value);
      }
    }
  }

  // Company node id
  $nid_company = get_nid_by_previus_id($item['E']);
  if ($nid_company > 0) {

    // Category tid
    $cat = NULL;
    if (!empty($item['L']) && is_numeric($item['L']) && $item['L'] > 0) {
      $cat = get_tid_by_previus_id($item['L']);
    }

    // Category parent tid
    $cat_parent = NULL;
    if (!empty($item['W']) && is_numeric($item['W']) && $item['W'] > 0) {
      $cat_parent = get_tid_by_previus_id($item['W']);
    }

    // Creating translation
    $exist_product = get_nid_by_previus_id($item['A']);
    if (!$exist_product) {
      $cpCoreController = new CpCoreController();
      $lang = get_value($item['D']) != 'und' ? get_value($item['D']) : 'en';
      $node = Node::create([
        'type' => 'product',
        'langcode' => $lang,
        'created' => \Drupal::time()->getRequestTime(),
        'changed' => \Drupal::time()->getRequestTime(),
        'uid' => get_user($item['C']),
        'title' => $item['M'],
        'field_body' => [
           'value' => $item['N'],
        ],
        'field_tariff_heading' => [
          'value' => $item['I'],
        ],
        'field_pr_ref_company' => [
          'target_id' => $nid_company,
        ],
        'field_export_markets' => $markets,
        'field_key_words_backup' => [
          'value' => !empty($item['K']) ? $item['K'] : '',
        ],
        'field_product_type' => [
          'value' => !empty($item['F']) ? $item['F'] : [],
        ],
        'field_categorization_parent' => (is_numeric($cat_parent) && $cat_parent > 0) ? [
          'target_id' =>  $cat_parent
        ] : [],
        'field_categorization' => (is_numeric($cat) && $cat > 0) ? [
          'target_id' => $cat,
        ] : [],
        'field_exist_certifications' => [
          'value' => !empty($item['J']) ? TRUE : FALSE,
        ],
        'field_key_words' => [
          'value' => $item['K'],
        ],
        'field_previous_id' => [
          'value' => $item['A'],
        ],
        'field_file' => !empty(get_value($item['V'])) ?
          getImage(get_value($item['V']), date('Y-d')) : NULL,
        'field_images' => getImage($item['U'], date('Y-d')),
      ]);

      if ($item['Q'] == 1) {
        $node->setPublished(TRUE);
        $node->field_states->value = 'approved';
      } else {
        $node->setPublished(FALSE);
      }
      $node->save();

      // Redirect 301
      $alias = $cpCoreController->get_name_alias_for_company_or_product(
        $node, 
        $lang, 
        'old'
      );
      $new_alias = $cpCoreController->get_name_alias_for_company_or_product(
        $node, 
        $lang, 
        'new'
      );
      $cpCoreController->execute_redirect_301_for_nodes('product', $alias, $lang, $new_alias);

      // Path alias
      $cpCoreController->create_node_path_alias($node, $lang);

      // Update company info
      $company_node = Node::load($nid_company);
      if (!empty($company_node)) {
        if (!empty($categorization)) {
          $company_node->field_product_categories_list[] = ['target_id' => $cat];
          $company_node->save();
        }
      }
    }
    else {
      drupal_set_message('No se creo el producto: ' . $item['A'] . ' - ' . $item['M'] . ', ya esta creado en la plataforma', 'warning');
    }
  }
  else {
    drupal_set_message('No se creo el producto: ' . $item['A'] . ' - ' . $item['M'] . ', no existe la empresa con id: ' . $item['E'], 'warning');
  }
}


/**
* add node in data base.
*
* @param $item array.
*
*/
function create_categorization($item) {
  $exist_term = get_tid_by_previus_id($item['A']);
  if (!$exist_term) {
    if (!empty(get_value($item['C']))) {
    	$lang = get_value($item['D']) != 'und' ? get_value($item['D']) : 'es';
      $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['C']);
      $new_term = \Drupal\taxonomy\Entity\Term::create([
        'vid' => 'categorization',
        'name' => $item['C'],
        'description' => [
          'value' => get_value($item['E']),
          'format' => 'basic_html'
        ],
        'field_previous_id' => ['value' => $item['A']],
        'parent' => ['target_id' => get_tid_by_previus_id(get_value($item['F']))],
        'field_uri_search' => ['value' => $url],
      ]);
      $new_term->enforceIsNew();
      $new_term->set('langcode',$lang);
      $new_term->save();
    }
  }
}



/**
* add node in data base.
*
* @param $item array.
*
*/
function get_user($uid) {
  $connection = \Drupal::database();
  $query = $connection->query("SELECT t.entity_id as uid  FROM {user__field_previous_id} t where field_previous_id_value = " . $uid);
  $result = $query->fetchAll();
  foreach ($result as $row) {
    return $row->uid;
  }
  return 0;

}

/**
* add node in data base.
*
* @param $item array.
*
*/
function get_company($uid) {
  $connection = \Drupal::database();
  $query = $connection->query("SELECT t.entity_id as uid  FROM {node__field_previous_id} t where field_previous_id_value = " . $uid);
  $result = $query->fetchAll();
  foreach ($result as $row) {
    return $row->uid;
  }
  return 0;

}

/**
* add node in data base.
*
* @param $item array.
*
*/
function get_node($nid) {
  $connection = \Drupal::database();
  $query = $connection->query("SELECT t.entity_id as nid  FROM {node__field_previous_id} t where field_previous_id_value = " . $nid);
  $result = $query->fetchAll();
  foreach ($result as $row) {
    return $row->nid;
  }
  return 0;

}


/**
* get tid of taxonomy by previous id.
*
* @param $tid integer.
* @return integer The unique ID of taxonomy or 0 if not exist.
*
*/

function get_tid_by_previus_id($tid){
  if ($tid && is_numeric($tid)) {
    $connection = \Drupal::database();
    $query = $connection->query("SELECT t.entity_id as tid  FROM {taxonomy_term__field_previous_id} t where field_previous_id_value = " . $tid);
    $result = $query->fetchAll();
    if ($result) {
      foreach ($result as $row) {
        return $row->tid;
      }
    }
  }
  return 0;
}

/**
* get nid node by previous id.
*
* @param $tid integer.
* @return integer The unique ID of taxonomy or 0 if not exist.
*
*/

function get_nid_by_previus_id($nid){
  if ($nid && is_numeric($nid) && $nid > 0) {
    $connection = \Drupal::database();
    $query = $connection->query("SELECT n.entity_id as nid  FROM {node__field_previous_id} n where field_previous_id_value = " . $nid);
    $result = $query->fetchAll();
    foreach ($result as $row) {
      return $row->nid;
    }
  }
  return 0;
}


/**
* get city tid a toxonomy by match name.
*
* @param $tid integer.
* @return integer The unique ID of taxonomy or 0 if not exist.
*
*/
function get_tid_city_by_match_tax_name($tax_name){
  $connection = \Drupal::database();
  $quey = "SELECT t.tid
    FROM taxonomy_term_field_data t
    join taxonomy_term__parent tp on tp.entity_id = t.tid
    and tp.bundle = 'locations' and tp.parent_target_id > 0
    WHERE name LIKE '". $tax_name ."%'";
  $query = $connection->query($quey);
  $result = $query->fetchAssoc();
  if (!empty($result)) {
    return $result['tid'];
  }
  return 0;
}


/**
* get tid a toxonomy by name.
*
* @param $name string.
* @param $type string.
* @return integer The unique ID of taxonomy or 0 if not exist.
*
*/
function getTidByName ($name,$type) {
  $connection = \Drupal::database();
  $query = $connection->query("SELECT t.tid  FROM {taxonomy_term_field_data} t where name = '" . $name . "' and vid = '" . $type . "'");
  $result = $query->fetchAll();
  foreach ($result as $row) {
    return $row->tid;
  }
  return 0;
}

/**
* Create iamgen or icon.
*
* @param $url string.
* @param array $data Additional data: alt text and title
* @return integer The unique Fid.
*
*/
function getImage ($url, $directory, $data = []) {
  $image_tax = array();
  if (!empty($url)) {
    $destination = \Drupal::config('system.file')->get('default_scheme') . '://' . $directory;
    file_prepare_directory($destination, FILE_CREATE_DIRECTORY | FILE_MODIFY_PERMISSIONS);
    $url_image = str_replace('public://', '/app/Files-catalogo/files/', $url);
    $image_path = explode('/', $url);
    $image_name = $image_path[count($image_path) - 1];
    $imageString = file_get_contents($url_image);
    $file_uri = file_stream_wrapper_uri_normalize($destination . '/' . $image_name);
    $file =  file_save_data($imageString, $file_uri, $replace = FILE_EXISTS_RENAME);
    if ($file->id()) {
      $image_tax = [
        'target_id' => $file->id(),
        'alt' => !empty($data['alt']) ? $data['alt'] : $image_name,
        'title' => !empty($data['title']) ? $data['title'] : $image_name,
      ];
    }
  }
  //drupal_set_message('image:<pre>' . var_export($image_tax,true).'</pre>');
  return $image_tax;
}


/**
* Get value field
*
* @param $val string.
* @return string Value
*
*/
function get_value($val) {
  if (!empty($val) && $val != 'NULL') {
    return trim($val);
  }
  return NULL;
}


