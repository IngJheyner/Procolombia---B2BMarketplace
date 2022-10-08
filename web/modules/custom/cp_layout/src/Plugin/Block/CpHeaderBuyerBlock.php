<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header buyer' Block.
 *
 * @Block(
 *   id = "header_buyer",
 *   admin_label = @Translation("Header buyer"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderBuyerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_buyer_template_hook',
    ];
  }

}