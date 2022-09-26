<?php

namespace Drupal\cp_advisor_moderation\Access;

use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Routing\Access\AccessInterface;

/**
 * Checks access for displaying configuration translation page.
 */
class EditProductAccess implements AccessInterface {

  /**
   * A custom access check.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   Run access checks for this account.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
  public function access($node, AccountInterface $account) {
    $owner = User::load(Node::load($node)->getOwnerID());
    $adviserId =$owner->get('field_company_adviser')->getValue()[0]['target_id'];
    $userId = \Drupal::currentUser()->id();
    $access = false;

    if($adviserId == $userId || $userId == 1) {
      $access = true ;
    }
    return ($account->hasPermission('cp_advisor_moderation product dashboard') && $access) ? AccessResult::allowed() : AccessResult::forbidden();
  }
}
