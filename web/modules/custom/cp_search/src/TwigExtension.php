<?php
namespace Drupal\cp_search;
use Drupal\cp_search\Controller\CpSearchController;
/**
 * extend Drupal's Twig_Extension class
 */
class TwigExtension extends \Twig_Extension {
  /**
   * {@inheritdoc}
   * Let Drupal know the name of your extension
   * must be unique name, string
   */
  public function getName() {
    return 'cp_search.twigextension';
  }
  /**
   * {@inheritdoc}
   * Return your custom twig function to Drupal
   */
  public function getFunctions() {
    return [
      new \Twig_SimpleFunction('get_cat_parent', [$this, 'get_cat_parent']),
      new \Twig_SimpleFunction('get_cat_child', [$this, 'get_cat_child']),

    ];
  }
  
  public static function get_cat_parent($tid_cat) {
    $parent = NULL;
    $CpSearch = new CpSearchController();
    $cats_hier = $CpSearch->_cp_search_get_hierarchy_catgs_product($tid_cat);
    if (isset($cats_hier['parent']['name'])) {
      $parent = $cats_hier['parent']['name'];
    }
    return $parent;
  }

  public static function get_cat_child($tid_cat) {
    $child = NULL;
    $CpSearch = new CpSearchController();
    $cats_hier = $CpSearch->_cp_search_get_hierarchy_catgs_product($tid_cat);
    if (isset($cats_hier['child']['name'])) {
      $child = $cats_hier['child']['name'];
    }
    return $child;
  }

}