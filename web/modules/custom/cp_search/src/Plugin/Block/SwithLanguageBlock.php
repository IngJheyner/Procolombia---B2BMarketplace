<?php

namespace Drupal\cp_search\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\cp_search\Controller\CpSearchController;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "switch_language_search",
* admin_label = @Translation("Switch Language Search"),
* )
*/
class SwithLanguageBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    $langs = \Drupal::languageManager()->getLanguages();
    $current_path = \Drupal::service('path.current')->getPath();
    $args = explode('/', ltrim($current_path, '/'));
    $count = count($args);
    $str_query = \Drupal::request()->getQueryString();

    $CpSearch = new CpSearchController();
    $currentLang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $vid = 'countries';

    if (!empty($langs)) {
      $arr_urls = array();
      foreach ($langs as $key => $lang) {
        $tid_cat = NULL;
        $tid_sub_cat = NULL;
        $lang_code = $lang->getId();

        // Sector - Subsector
        if ($count > 1) {
          if ($count == 2) {
            $tid_cat = $CpSearch->_cp_search_get_tid_by_url($args[1]);
            $uris_cat = $CpSearch->_cp_search_get_uri_search_taxonomy($tid_cat);
          }
          if ($count == 3) {
            $tid_cat = $CpSearch->_cp_search_get_tid_by_url($args[1]);
            $uris_cat = $CpSearch->_cp_search_get_uri_search_taxonomy($tid_cat);

            $tid_sub_cat = $CpSearch->_cp_search_get_tid_by_url($args[2]);
            $uris_sub_cat = $CpSearch->_cp_search_get_uri_search_taxonomy($tid_sub_cat);
          }
        }
        $url_chg = $lang_code == 'en' ? '/en/products' : '/es/productos';


        if (!empty($tid_cat) && isset($uris_cat[$lang_code])) {
          $url_chg .= '/' . $uris_cat[$lang_code];
          if (!empty($tid_sub_cat) && isset($uris_sub_cat[$lang_code])) {
            $url_chg .= '/' . $uris_sub_cat[$lang_code];
          }
        }

        // GET Variables
        $params = $CpSearch->_get_params_search();
        $cont = 0;
        if (!empty($params)) {
          foreach ($params as $key_var => $val_var) {
            $url_chg .= ($cont == 0) ? '?' : '&';
            if ($key_var == 'export_markets') {
              $countries = explode(',', $val_var);
              $ctr_names = NULL;
              if (!empty($countries)) {
                foreach ($countries as $key_ct => $name_ct) {
                  $tid = $CpSearch->_cp_search_get_taxonomy_tid_by_name($name_ct, $vid);
                  if ($tid && is_numeric($tid)) {
                    $name = $CpSearch->_cp_search_get_taxonomy_name_by_tid_and_lang($tid, $lang_code, 'countries');
                    if ($name) {
                      $ctr_names .= $name . ',';
                    }

                  }
                }
                $ctr_names = rtrim($ctr_names,",");
              }
              if (!empty($ctr_names)) {
                $url_chg .= $key_var . '=' . urlencode($ctr_names);
              }
            }
            else {
              $url_chg .= $key_var . '=' . $val_var;
            }
            $cont++;
          }
        }

        $lang_name = NULL;
        switch ($lang->getName()) {
          case 'English':
          case 'Inglés':
            $lang_name = 'Eng';
            break;

          case 'Spanish':
          case 'Español':
            $lang_name = 'Esp';
            break;
        }
        $arr_urls[] = array(
          'url' => $url_chg,
          'name' => $lang_name,
          'id' => $lang->getId(),
        );
      }
    }

    return array (
      '#theme' => 'swLanguage',
      '#urls' => $arr_urls,
      '#currentLang' => $currentLang,
      '#cache' => ['max-age' => 0],
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function blockAccess(AccountInterface $account) {
    return AccessResult::allowedIfHasPermission($account, 'access content');
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['my_block_settings'] = $form_state->getValue('my_block_settings');
  }
}
