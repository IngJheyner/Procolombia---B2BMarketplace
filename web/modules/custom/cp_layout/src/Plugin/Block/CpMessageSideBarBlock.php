<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Message Windows' Block.
 *
 * @Block(
 *   id = "message_sidebar",
 *   admin_label = @Translation("Message Sidebar"),
 *   category = @Translation("Layout"),
 * )
 */
class CpMessageSideBarBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_message_sidebar_template_hook',
    ];
  }

}