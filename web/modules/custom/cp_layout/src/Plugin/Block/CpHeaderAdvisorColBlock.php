<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header Advisor Col' Block.
 *
 * @Block(
 *   id = "header_advisor_col",
 *   admin_label = @Translation("Header Advisor Col"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderAdvisorColBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_advisor_col_template_hook',
    ];
  }

}