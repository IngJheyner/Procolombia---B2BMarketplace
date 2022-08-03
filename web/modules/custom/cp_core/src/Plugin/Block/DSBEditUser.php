<?php

namespace Drupal\cp_core\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\image\Entity\ImageStyle;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "dsb_edit_user",
* admin_label = @Translation("Dashboard edit user"),
* )
*/
class DSBEditUser extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    if (!\Drupal::currentUser()->isAnonymous()) {
      global $base_path;
      global $base_url;
      $name = NULL;
      $company = NULL;
      $country = NULL;
      $company_nit = NULL;
      $urlBase = $base_url . $base_path;

      // Get current user values
      $currentUser = \Drupal::currentUser();
      $mail = $currentUser->getEmail();
      $handler = \Drupal::service('theme_handler');
      $path_theme = $handler->getTheme('catalogo_public')->getPath();
      $img_user = $urlBase . $path_theme. '/images/img_user.png';
      $user_tmp = \Drupal\user\Entity\User::load($currentUser->id());
      if ($user_tmp->hasRole('buyer')) {
        if (!empty($user_tmp->get('field_complete_name')->getValue())) {
          $name = $user_tmp->get('field_complete_name')->getValue()[0]['value'];
        }
        if (!empty($user_tmp->get('field_company')->getValue())) {
          $company = $user_tmp->get('field_company')->getValue()[0]['value'];
        }
        if (!empty($user_tmp->get('field_country')->target_id)) {
          if (!empty($user_tmp->get('field_country')->referencedEntities())) {
            $country_load = $user_tmp->get('field_country')->referencedEntities()[0];
            $country = $country_load->getName();

          }
        }
      }
      elseif ($user_tmp->hasRole('exportador')) {
        $company_nit = $user_tmp->getAccountName();
      }
      $first_login = empty($_COOKIE['Drupal_visitor_first_login']) ? false : true;
      return [
        '#theme' => 'dsb_info_user',
        '#name_user' => $name,
        '#mail_user' => $mail,
        '#company_nit' => $company_nit,
        '#img_user' => $img_user,
        '#company' => $company,
        '#country' => $country,
        '#first_login' => $first_login,
        '#attached' => array(
          'library' => array('cp_core/dsb_info_user'),
         ),
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
