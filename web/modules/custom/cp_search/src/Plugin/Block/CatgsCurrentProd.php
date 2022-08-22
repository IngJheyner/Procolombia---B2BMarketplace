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
* id = "categories_current_prod",
* admin_label = @Translation("Categories Current Product"),
* )
*/
class CatgsCurrentProd extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    $node = \Drupal::routeMatch()->getParameter('node');
    if ($node instanceof \Drupal\node\NodeInterface) {
      if (!empty($node->get('field_categorization')->getValue()[0])) {
        $nid = $node->id();
        $tid_cat = $node->get('field_categorization')->getValue()[0]['target_id'];
        $CpSearch = new CpSearchController();
        $cats_hier = $CpSearch->_cp_search_get_hierarchy_catgs_product($tid_cat);
        return [
          '#theme' => 'catgsHierarchy',
          '#parent' => $cats_hier['parent']['name'],
          '#child' => isset($cats_hier['child']['name']) ? $cats_hier['child']['name'] : NULL,
          '#cache' => ['max-age' => 0],
        ];
      }
    }
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