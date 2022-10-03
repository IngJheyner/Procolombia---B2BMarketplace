<?php

namespace Drupal\cp_chat\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Chat Windows' Block.
 *
 * @Block(
 *   id = "chat_window",
 *   admin_label = @Translation("Chat window"),
 *   category = @Translation("Chat window"),
 * )
 */
class CpChatWindowBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
        // Your theme hook name.
        '#theme' => 'cp_chat_window_template_hook',
    ];
  }

}