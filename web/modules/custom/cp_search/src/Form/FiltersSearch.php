<?php
namespace Drupal\cp_search\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\cp_search\Controller\CpSearchController;
use Drupal\taxonomy\Entity\Term;

use Drupal\field\Entity\FieldConfig;

class FiltersSearch extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'filters_search_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $cpSearch = new CpSearchController();
    $parents = $cpSearch->_cp_search_get_categories_leve1();

    if (!empty($parents)) {
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $url_search = $cpSearch->_cp_search_get_url_search();
      $str_opt_dflt = t('- Category -');
      $str_opt_dflt_lvl2 = t('- Subcategory -');
      $opt_dflt = array($str_opt_dflt);
      $opt_dflt_lvl2 = array($str_opt_dflt_lvl2);
      $opts_img_icons = array();
      if (isset($parents['icons_uris'])) {
        $dflt_ico_option = array(array('name' => $str_opt_dflt));
        $opts_img_icons = $dflt_ico_option + $parents['icons_uris'];
      }

      $filtersMobile = '<div class="is-mobile">';
      $filtersMobile .= '<span class="show-filter">';
      $filtersMobile .= t('filter by') . '</span>';
      $filtersMobile .= '<span class="view-mode cols-1">'. t('to show');
      $filtersMobile .= '</span></div>';
      $clssFilters = 'content-form is-desktop';
      if (Drupal::service('path.matcher')->isFrontPage()) {
        $filtersMobile = '';
        $clssFilters = 'content-form';
      }

      $form['#attached']['library'][] = 'cp_search/cp_search';
      $form['content'] = array(
        '#prefix' => $filtersMobile . '<div class="'. $clssFilters .'"'
        .' data-url1="' . $url_search['url1']
        . '" data-sector="' . $url_search['sector']
        . '" data-subsector="' . $url_search['subsector'] .'">',
        '#suffix' => '</div>',
      );

      $form['content']['row'] = array(
        '#prefix' => '<div class="container"><div class="row">',
        '#suffix' => '</div></div>',
      );

      $form['content']['row']['fields'] = array(
        '#prefix' => '<div class="col-md-12">',
        '#suffix' => '</div>',
      );

      $form['content']['row']['buttons'] = array(
        '#prefix' => '<div class="col-md-12 text-center justify-content-center">',
        '#suffix' => '</div>',
      );

      // Default values selects
      $current_path = \Drupal::service('path.current')->getPath();
      $args = explode('/', ltrim($current_path, '/'));
      $count = count($args);
      $tid_dflt_cat = $tid_dflt_sub_cat = 0;
      $params = \Drupal::request()->query->all();
      $html_uris_cat2 = '';
      if ($count > 1) {
        if ($count == 2) {
          $tid_dflt_cat = $cpSearch->_cp_search_get_tid_by_url($args[1]);
        }
        if ($count == 3) {
          $tid_dflt_cat = $cpSearch->_cp_search_get_tid_by_url($args[1]);
          $tid_dflt_sub_cat = $cpSearch->_cp_search_get_tid_by_url($args[2]);
        }
        if (is_numeric($tid_dflt_cat) && $tid_dflt_cat > 0) {
          $cats_level2 = $cpSearch->_cp_search_get_categories_leve2($tid_dflt_cat);
          $opt_dflt += $cats_level2['options'];
          $opt_dflt_lvl2 += $cats_level2['options'];
          if (isset($cats_level2['uris'])) {
            foreach ($cats_level2['uris'] as $tid => $uri) {
              $html_uris_cat2 .= '<span tid="'. $tid .'">'. $uri .'</span>';
            }
            $html_uris_cat2 .= '<span tid="0">'. $str_opt_dflt .'</span>';
            $html_uris_cat2 .= '<span tid="0">'. $str_opt_dflt_lvl2 .'</span>';
          }
        }
      }

      $title_dflt = '';
      if (isset($params['title'])) {
        $title_dflt = $params['title'];
      }

      $tariff_dflt = '';
      if (isset($params['tariff'])) {
        $tariff_dflt = $params['tariff'];
      }

      // $list_sector = '<div class="form-item-sector"><span>' . t('Category') . '</span>';
      $list_sector = '<div class="form-item-sector">';
      $list_sector .= '<select id="search-list-sector" class="search-list-sector">';
      $inx = 0;
      foreach ($opts_img_icons as $tid => $values) {
        $class = $tid_dflt_cat == $tid ? "sector" : "sector";
        $selected = ($tid_dflt_cat == $tid ? ' selected="selected" ' : null);
        $list_sector .= '<option class="'. $class .'" lang="'. $lang .'"' . $selected;
        $list_sector .= ' value='. $tid;
        if (isset($values['ico'])) {
          $list_sector .= ' data-imagesrc="'. $values['ico'] .'"';
        }
        $list_sector .= '>';
        $list_sector .= $values['name'];
        $list_sector .= '</option>';
        $inx++;
      }

      $list_sector .= '</select></div>';
      $list_sector .= '<small class="description text-muted">'. t('Ex: Agricultural') .'</small>';
      $form['content']['row']['fields']['list_sector'] = array(
        '#prefix' => '<div class="row"><div class=col-md-3>',
        '#suffix' => '</div>',
        '#markup' => $list_sector,
        '#allowed_tags' => ['select', 'option', 'small'],
      );


      $elemt_html_uris = $cpSearch->_cp_search_get_html_element_uris_categories($parents["uris"]);
      $form['content']['row']['fields']['uris_sector'] = array(
        '#prefix' => '<div id="uris-sector" class="hidden">',
        '#suffix' => '</div>',
        '#markup' => $elemt_html_uris,
      );
      $form['content']['row']['fields']['sub_sector'] = array(
        '#prefix' => '<div class=col-md-3>',
        '#suffix' => '</div>',
        '#type' => 'select',
        '#title' => t('Subcategory'),
        '#attributes' => array('class' => array('select-subsector')),
        '#options' => $opt_dflt_lvl2,
        '#default_value' => $tid_dflt_sub_cat,
        '#disabled' => isset($opt_dflt[0]) && count($opt_dflt) == 1 ? TRUE : FALSE,
        '#description' => t('Ex: Flowers and plants'),
      );
      $form['content']['row']['fields']['uris_sub_sector'] = array(
        '#prefix' => '<div id="uris-sub-sector" class="hidden">',
        '#suffix' => '</div>',
        '#markup' => $html_uris_cat2,
      );

      $form['content']['row']['fields']['product'] = array(
        '#prefix' => '<div class=col-md-3>',
        '#suffix' => '</div>',
        '#type' => 'textfield',
        '#title' => t('Product'),
        '#placeholder' => t('Product'),
        '#attributes' => array('id' => 'title-product'),
        '#default_value' => $title_dflt,
        '#disabled' => ($tid_dflt_cat != 0 || !empty($tariff_dflt)) ? TRUE : FALSE,
        '#description' => t('Ex: Flower'),
      );

      $form['content']['row']['fields']['tariff_heading'] = array(
        '#prefix' => '<div class=col-md-3>',
        '#suffix' => '</div></div>',
        '#type' => 'textfield',
        '#title' => t('HS Code #'),
        '#placeholder' => t('HS Code #'),
        '#attributes' => array('id' => 'tariff-heading'),
        '#default_value' => $tariff_dflt,
        '#disabled' => ($tid_dflt_cat != 0 || !empty($title_dflt)) ? TRUE : FALSE,
        '#description' => t('Ex: 00943728'),
      );

      $form['content']['row']['buttons']['search'] = array(
        '#type' => 'submit',
        '#value' => t('Search'),
        '#attributes' => array('class' => array('btn-search')),
      );

      $form['content']['row']['buttons']['reset'] = array(
        '#type' => 'submit',
        '#value' => t('Reset'),
        '#attributes' => array('class' => array('btn-secondary btn-secondary--reset')),
      );
    }


    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    //$form_state->setRebuild();
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $root = ($lang == 'es') ? 'cp_search.pageSearchRootSp' : 'cp_search.pageSearchRootEn';
    $form_state->setRedirect($root);
  }
}
