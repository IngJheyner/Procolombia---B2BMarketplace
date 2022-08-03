<?php

namespace Drupal\cp_core\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Session\AccountInterface;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "pre_register_block",
* admin_label = @Translation("Pre Register"),
* )
*/
class PreRegister extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    if (\Drupal::currentUser()->isAnonymous()) {
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $urls = [
        'company' => '/en/register/user',
        'buyer' => '/en/register/buyer'
      ];
      if ($lang == 'es') {
        $urls['company'] = '/es/registro/usuario';
        $urls['buyer'] = '/es/registro/comprador';
      }

      return [
        '#theme' => 'pre_register',
        '#urls' => $urls,
      ];
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
  public function getCacheMaxAge() {
    return 0;
  }
}
