<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header exportador' Block.
 *
 * @Block(
 *   id = "header_exportador",
 *   admin_label = @Translation("Header exportador"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderExportadorBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_exportador_template_hook',
    ];
  }

}