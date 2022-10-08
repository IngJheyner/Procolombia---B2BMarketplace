<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header not sign in' Block.
 *
 * @Block(
 *   id = "header_not_sign_in",
 *   admin_label = @Translation("Header not sign in"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderNotSignInBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_not_sign_in_template_hook',
    ];
  }

}