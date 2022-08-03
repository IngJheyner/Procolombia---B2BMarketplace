<?php
namespace Drupal\cp_wf_contact\Controller;

use Drupal;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Utility\Html;
use Drupal\node\Entity\Node;

/**
 * Controller for functions procolombia catalogo core.
 */
class CpWfContactController extends ControllerBase {

  /**
   * Function to create parent categories options with this structure
   * in every element [tid] => [name]
   * @param  [array] $arr_tids [tids array]
   * @param  [int] $nid  [nid company node]
   * @return [array] $opts [parent categories options]
   */
  public function get_select_options_product_cats_by_company($arr_tids, $nid) {
    $opts = array();
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $query = \Drupal::database()->select('node__field_pr_ref_company', 'nrc');
    $query->join('node__field_categorization_parent', 'nfcp', 'nfcp.entity_id = nrc.entity_id');
    $query->join('taxonomy_term_field_data', 'tfd', 'tfd.tid = nfcp.field_categorization_parent_target_id');
    $query->join('node__field_states', 'fs', 'fs.entity_id = nrc.entity_id');
    $query->addField('nrc', 'entity_id', 'prod_nid');
    $query->addField('nfcp', 'field_categorization_parent_target_id', 'tid_cat_parent');
    $query->addField('tfd', 'name', 'name_cat');
    $query->addField('fs', 'field_states_value', 'state');
    $query->condition('nrc.field_pr_ref_company_target_id', $nid);
    $query->condition('nrc.bundle', 'product');
    $query->condition('nfcp.bundle', 'product');
    $query->condition('fs.bundle', 'product');
    $query->condition('fs.field_states_value', 'approved');
    $query->condition('tfd.vid', 'categorization');
    $query->condition('nfcp.field_categorization_parent_target_id', $arr_tids, 'IN');
    $query->condition('tfd.langcode', $lang);
    $query->condition('fs.langcode', $lang);
    $result = $query->execute()->fetchAll();
    if (!empty($result)) {
      foreach ($result as $key => $val) {
        $opts[$val->tid_cat_parent] = $val->name_cat;
      }
    }
    return $opts;
  }

  /**
   * Function to get products array by category tid as key 
   * according to the company nid
   * @param  [type] $arr_tids [description]
   * @param  [type] $nid      [description]
   * @return [type]           [description]
   */
  public function get_info_products_cats_by_company_nid($arr_tids, $nid) {
    if (!empty($arr_tids) && $nid && is_numeric($nid)) {
      $info = array();
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $query = \Drupal::database()->select('node__field_pr_ref_company', 'nrc');
      $query->join('node__field_categorization_parent', 'nfcp', 'nfcp.entity_id = nrc.entity_id');
      $query->join('taxonomy_term_field_data', 'tfd', 'tfd.tid = nfcp.field_categorization_parent_target_id');
      $query->addField('nrc', 'entity_id', 'prod_nid');
      $query->addField('nfcp', 'field_categorization_parent_target_id', 'tid_cat_parent');
      $query->addField('tfd', 'name', 'name_cat');
      $query->condition('nrc.field_pr_ref_company_target_id', $nid);
      $query->condition('nrc.bundle', 'product');
      $query->condition('nfcp.bundle', 'product');
      $query->condition('tfd.vid', 'categorization');
      $query->condition('nfcp.field_categorization_parent_target_id', $arr_tids, 'IN');
      $query->condition('tfd.langcode', $lang);
      $result = $query->execute()->fetchAll();
      if (!empty($result)) {
        foreach ($result as $key => $val) {
          $info[$val->tid_cat_parent][] = $val->prod_nid;
        }
      }
      return $info;
    }
  }

  /**
   * Function to obtain the value of the field product_categories list of company
   * as array
   * @param  [type] $companyLoad [description]
   * @return [type]              [description]
   */
  public function get_product_parent_cats_tids_by_company($companyLoad) {
    if (!empty($companyLoad)) {
      $tids = $companyLoad->get('field_product_categories_list')->getValue();
      if (!empty($tids)) {
        $arr_tids = [];
        foreach ($tids as $key => $val) {
          $arr_tids[$val['target_id']] = $val['target_id'];
        }
        return $arr_tids;
      }
    }
  }



}
