<?php

namespace Drupal\cp_migrate;

use Drupal\node\Entity\Node;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\IReadFilter;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\redirect\Entity\Redirect;

class addImportContentBothLangs {

  /**
   * addImportContentItemBothLangs
   * @param [type] $item     
   * @param [type] &$context
   */
  public static function addImportContentItemBothLangs($item, &$context) {
    $context['sandbox']['current_item'] = $item;
    $message = 'Creating ' . $item['A'];
    $results = array();
    switch ($item['type']) {
      case 'usuarios':
        create_user($item);
        break;

      case 'sectores':
        create_sector($item);
        break;

      case 'categorization':
        create_categorization($item);
        break;

      case 'countries':
        create_ubication($item,'countries');
        break;

      case 'states_cities':
        create_ubication($item,'locations');
        break;

      case 'empresas':
        create_company($item);
        break;

      case 'old_companies':
        create_old_company($item);
        break;

      case 'productos':
        create_product($item);
        break;

      case 'codigos':
        create_ciiu_code($item);
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
      if (!empty($item['T'])) {
        $logo = getImage($item['T'], date('Y-d'));
        if (!empty($logo)) {
          $fid_logo = $logo['target_id'];
        }
      }
      $lang = !empty(get_value($item['D'])) ? get_value($item['D']) : 'es';
      $title = get_value($item['E']);
      $title_uri = \Drupal::service('pathauto.alias_cleaner')->cleanString($title);
      $cpCoreController = new CpCoreController();

      // Url web
      $url_web = $item['Q'];
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
          'value' => $item['J'],
        ],
        'field_ubication_state' => !empty($item['S']) ? [
          'target_id' => get_tid_by_previus_id($item['S']),
        ] : [],
        'field_ubication_city' => !empty($item['R']) ? [
          'target_id' => get_tid_by_previus_id($item['R']),
        ] : [],
        'field_contact_name' => [
          'value' => $item['K'],
        ],
        'field_charge' => [
          'value' => $item['L'],
        ],
        'field_cellphone' => [
          'value' => $item['N'],
        ],
        'field_phone' => [
          'value' => $item['O'],
        ],
        'field_email' => [
          'value' => $item['M'],
        ],
        'field_previous_id' => [
          'value' => get_value($item['A']),
        ],
      ]);
      if ($item['I'] == 1) {
        $node->setPublished(TRUE);
        $node->field_states->value = 'approved';
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


      // Creating translation Spanish.
      $lang = !empty(get_value($item['G'])) ? get_value($item['G']) : 'en';
      $node_es = $node->addTranslation($lang);
      $node_es->title = $title;
      $node_es->field_body->value = str_replace('|', '"', get_value($item['H']));
      $node_es->field_previous_id->value = get_value($item['B']);
      if ($item['I'] == 1) {
        $node_es->setPublished(TRUE);
        $node_es->field_states->value = 'approved';
      } else {
        $node_es->setPublished(FALSE);
      }
      $node_es->save();

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
      $cpCoreController->create_node_path_alias($node_es, $lang);
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
      $lang = !empty(get_value($item['D'])) ? get_value($item['D']) : 'es';
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

      // Create translation English
      if (!empty(get_value($item['AL']))) {
        $node_en = $node->addTranslation('en');
        $node_en->title = get_value($item['AL']);
        $node_en->body->value = get_value($item['AM']);
        $node_en->body->format = 'basic_html';
        $node_en->field_body_offer->value = get_value($item['AN']);
        $node_en->field_body_offer->format = 'basic_html';
        $node_en->field_previous_id->value = get_value($item['B']);
        $node_en->field_previous_uri->value = get_value($item['AO']);
        if ($item['G'] == 1) {
          $node_en->setPublished(TRUE);
        } else {
          $node_en->setPublished(FALSE);
        }
        $node_en->save();
      }
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
    if (!empty($item['AB']) && is_numeric($item['AB']) && $item['AB'] > 0) {
      $cat_parent = get_tid_by_previus_id($item['AB']);
    }

    // -------------------------------
    // Creating translation Spanish.
    // -------------------------------
    $exist_product = get_nid_by_previus_id($item['A']);
    if (!$exist_product) {
      $cpCoreController = new CpCoreController();

      $node = Node::create([
        'type' => 'product',
        'langcode' => 'es',
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
        'field_file' => !empty(get_value($item['AA'])) ?
          getImage(get_value($item['AA']), date('Y-d')) : NULL,
        'field_images' => getImage($item['Y'], date('Y-d')),
      ]);

      if ($item['U'] == 1) {
        $node->setPublished(TRUE);
        $node->field_states->value = 'approved';
      } else {
        $node->setPublished(FALSE);
      }
      $node->save();

      // Redirect 301
      $alias = $cpCoreController->get_name_alias_for_company_or_product(
        $node, 
        'es', 
        'old'
      );
      $new_alias = $cpCoreController->get_name_alias_for_company_or_product(
        $node, 
        'es', 
        'new'
      );
      $cpCoreController->execute_redirect_301_for_nodes('product', $alias, 'es', $new_alias);


      // -------------------------------
      // Creating translation English.
      // -------------------------------
      if (!empty(get_value($item['S']))) {
        $node_en = $node->addTranslation('en');
        $node_en->title = get_value($item['S']);
        $node_en->field_body->value = get_value($item['T']);
        $node_en->uid = get_user($item['C']);
        if (!empty(get_value($item['Z']))) {
          $node_en->field_file = getImage(get_value($item['Z']), date('Y-d'));
        }
        $node_en->field_previous_id->value = get_value($item['B']);
        if ($item['V'] == 1) {
          $node_en->setPublished(TRUE);
          $node_en->field_states->value = 'approved';
        } else {
          $node_en->setPublished(FALSE);
        }
        $node_en->save();

        // Redirect 301
        $alias = $cpCoreController->get_name_alias_for_company_or_product(
          $node_en, 
          'en', 
          'old'
        );
        $new_alias = $cpCoreController->get_name_alias_for_company_or_product(
          $node_en, 
          'en', 
          'new'
        );
        $cpCoreController->execute_redirect_301_for_nodes('product', $alias, 'en', $new_alias);
      }

      // Path alias
      $cpCoreController->create_node_path_alias($node_en, 'en');
      $cpCoreController->create_node_path_alias($node, 'es');

      // Update company info
      $company_node = Node::load($nid_company);
      if (!empty($company_node)) {
        if (!empty($categorization)) {
          $company_node->field_product_categories_list[] = ['target_id' => $cat];
          $company_node->save();
        }
      }
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
function create_user($item) {
  if (is_numeric($item['A']) && $item['A'] > 0) {
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $user = \Drupal\user\Entity\User::create();
    $user->enforceIsNew();
    $user->setPassword('procolombia2019');
    $user->setEmail($item['C']);
    $user->setUsername($item['B']);
    $user->set('init', $item['C']);
    if (empty($item['C'])) {
      return;
    }

    if (user_load_by_mail($item['C']) !== FALSE) {
      return;
    }
    else {
      if (user_load_by_name($item['B']) !== FALSE) {
        $user->setUsername($item['C']);
      }
    }
    $user->set('field_previous_id', $item['A']);
    if ((isset($item['D']) && !empty($items['D']) && $items['D'] != 'NULL') || !isset($item['D'])) {
      $user->addRole('exportador');
    }
    else {
      $roles = explode('-', $item['D']);
      foreach ($roles as $value) {
        if ($value == 'administrator') {
          $user->addRole('administrator');
        }
      }
    }

    $bool_rol_export = TRUE;
    if (!empty(get_value($item['D']))) {
      $roles = explode('-', $item['D']);
      foreach ($roles as $value) {
        if ($value == 'administrator') {
          $user->addRole('administrator');
          $bool_rol_export = FALSE;
        }
      }
    }
    if ($bool_rol_export) {
      $user->addRole('exportador');
    }
    $user->activate();
    $result = $user->save();

  }
}

/**
* add node in data base.
*
* @param $item array.
*
*/
function create_sector($item) {
  if (isset($item['F'])) {
    $lang = 'en';
    $cpCoreController = new CpCoreController();
    $name = get_value($item['F']);
    $parent_tid = get_tid_by_previus_id($item['B']);
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $uri_search = \Drupal::service('pathauto.alias_cleaner')->cleanString($name);
    $new_term = \Drupal\taxonomy\Entity\Term::create([
      'vid' => 'sectors',
      'name' => $name,
      'description' => ['value' => $item['I'], 'format' => 'basic_html'],
      'field_previous_id' => ['value' => $item['A']],
      'parent' => ['target_id' => $parent_tid],
      'field_uri_search' => $uri_search,
      'field_icon' => getImage(
        $item['J'],
        'sectors',
        [
          'alt' => $url_search_en,
          'title' => $url_search_en
        ]
      ),
    ]);
    $new_term->enforceIsNew();
    $new_term->set('langcode',$lang);
    $new_term->save();

    // Redirect 301
    $cpCoreController->execute_redirect_301_for_taxonomies($uri_search, $parent_tid, $lang);
  }

  if (isset($item['E'])) {
    $lang = 'es';
    $name = get_value($item['E']);
    $uri_search = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['E']);
    $new_term->addTranslation($lang, [
      'name' => $name,
      'description' => ['value' => $item['H'], 'format' => 'basic_html'],
      'field_uri_search' => $uri_search,
    ]);
    $new_term->save();

    // Redirect 301
    $cpCoreController->execute_redirect_301_for_taxonomies($uri_search, $parent_tid, $lang);
  }
}


/**
* add node in data base.
*
* @param $item array.
*
*/
function create_categorization($item) {
  $bool_create = FALSE;
  if ($item['J'] == 1 or ($item['J'] == 2 && $item['E'] > 0)) {
    $bool_create = TRUE;
  }
  $exist_term = get_tid_by_previus_id($item['B']);
  if ($bool_create && !$exist_term) {
    // Spanish
    if (!empty(get_value($item['B'])) && !empty(get_value($item['C']))) {
      $lang = !empty(get_value($item['A'])) ? get_value($item['A']) : 'es';
      $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['C']);
      $new_term = \Drupal\taxonomy\Entity\Term::create([
        'vid' => 'categorization',
        'name' => $item['C'],
        'description' => [
          'value' => get_value($item['D']),
          'format' => 'basic_html'
        ],
        'field_previous_id' => ['value' => $item['B']],
        'parent' => ['target_id' => get_tid_by_previus_id($item['E'])],
        'field_uri_search' => ['value' => $url],
        /*'field_image' => getImage(
          $item['Y'],
          'sectors',
          ['alt' => $item['V'],
          'title' => $item['W']]
        ),
        'field_icon' => getImage(
          $item['Q'],
          'sectors',
          ['alt' => $item['N'],
          'title' => $item['O']]
        ),*/
      ]);
      $new_term->enforceIsNew();
      $new_term->set('langcode',$lang);
      $new_term->save();
    }

    // English
    if (!empty(get_value($item['G'])) && !empty(get_value($item['H']))) {
      $lang = !empty(get_value($item['F'])) ? get_value($item['F']) : 'en';
      $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['H']);
      $new_term->addTranslation($lang, [
        'name' => $item['H'],
        'description' => ['value' => get_value($item['I']), 'format' => 'basic_html'],
        'field_uri_search' => ['value' => $url],
        'field_previous_id' => ['value' => $item['G']],
        /*'field_image' => getImage(
          $item['U'],
          'sectors',
          ['alt' => $item['R'],
          'title' => $item['S']]
        ),
        'field_icon' => getImage(
          $item['M'],
          'sectors',
          ['alt' => $item['J'],
          'title' => $item['K']]
        ),*/
      ]);
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
function create_categorization_old($item) {

  $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
  $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['F']);
  $image_tax = array();

  $new_term = \Drupal\taxonomy\Entity\Term::create([
      'vid' => 'categorization',
      'name' => $item['F'],
      'description' => ['value' => $item['I'], 'format' => 'basic_html'],
      'field_previous_id' => ['value' => $item['A']],
      'parent' => ['target_id' => get_tid_by_previus_id($item['B'])],
      'field_uri_search' => ['value' => $url],
      'field_advisor_email' => ['value' => $item['R']],

      'field_image' => getImage($item['Y'], 'sectors', ['alt' => $item['V'], 'title' => $item['W']]),
      'field_icon' => getImage($item['Q'], 'sectors', ['alt' => $item['N'], 'title' => $item['O']]),
  ]);

  $new_term->enforceIsNew();
  $new_term->set('langcode','en');
  $new_term->save();

  // $parent = [];
  // // if (!empty($item['B']) && $item['B'] > 0) {
  // //   $parent = ['target_id' => get_tid_by_previus_id($item['B'])];
  // // }
  //$new_term->set('parent',['target_id' => get_tid_by_previus_id($item['B'])]);

  $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['E']);
  $new_term->addTranslation('es', [
      'name' => $item['E'],
      'description' => ['value' => $item['H'], 'format' => 'basic_html'],
      'field_uri_search' => ['value' => $url],
      'field_image' => getImage($item['U'], 'sectors', ['alt' => $item['R'], 'title' => $item['S']]),
      'field_icon' => getImage($item['M'], 'sectors', ['alt' => $item['J'], 'title' => $item['K']]),
  ]);
  $new_term->save();
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

function create_ubication($item, $type) {
  $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
  $url = \Drupal::service('pathauto.alias_cleaner')->cleanString($item['C']);
  $image_tax = array();

  $new_term = \Drupal\taxonomy\Entity\Term::create([
    'vid' => $type,
    'name' => $item['C'],
    'field_previous_id' => ['value' => $item['A']],
    'parent' => ['target_id' => get_tid_by_previus_id($item['B'])],
  ]);

  $new_term->enforceIsNew();
  $new_term->save();
}

/**
* add node in data base.
*
* @param $item array.
*
*/
function create_ciiu_code($item) {

  $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
  $new_term = \Drupal\taxonomy\Entity\Term::create([
    'vid' => 'ciiu_codes',
    'name' => substr ($item['B'], 0, 255),
    'description' => ['value' => $item['B'], 'format' => 'basic_html'],
    'field_ciiu_code' => ['value' => $item['A']],
  ]);
  $new_term->enforceIsNew();
  $new_term->set('langcode','es');
  $new_term->save();
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

