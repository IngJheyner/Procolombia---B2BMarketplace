<?php

namespace Drupal\cp_core\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\cp_core\Controller\CpCoreController;

use Drupal\node\Entity\Node;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "dsb_add_product",
* admin_label = @Translation("Dashboard user add product"),
* )
*/
class DSBAddProduct extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    global $base_path;
    global $base_url;
    $urlBase = $base_url . $base_path;
    $handler = \Drupal::service('theme_handler');
    $path_theme = $handler->getTheme('catalogo_public')->getPath();
    $img_add_product = $urlBase . $path_theme. '/images/dsbd_product_logo.png';
    return [
      '#theme' => 'dsb_add_product',
      '#img_add_product' => $img_add_product,
    ];
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

  /**
   * {@inheritdoc}
   */
  public function getCacheMaxAge() {
    return 0;
  }
}
