<?php
/**
 * @file
 * Contains \Drupal\cp_core\Plugin\Block\SearchCategoriesModalBlock.
 */

namespace Drupal\cp_core\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'Modal' Block
 *
 * @Block(
 *   id = "search_categories_modal_block",
 *   admin_label = @Translation("Search categories modal block"),
 * )
 */
class SearchCategoriesModalBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\SearchCategoriesModalForm');

    return $form;
  }
}
