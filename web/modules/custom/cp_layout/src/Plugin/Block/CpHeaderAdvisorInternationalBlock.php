<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header Advisor International' Block.
 *
 * @Block(
 *   id = "header_advisor_international",
 *   admin_label = @Translation("Header Advisor International"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderAdvisorInternationalBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_advisor_international_template_hook',
    ];
  }

}