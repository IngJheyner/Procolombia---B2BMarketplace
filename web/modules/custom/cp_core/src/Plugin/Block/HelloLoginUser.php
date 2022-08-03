<?php

namespace Drupal\cp_core\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\node\Entity\Node;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "hello_login_exporter",
* admin_label = @Translation("Hello Login User"),
* )
*/
class HelloLoginUser extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    if (!\Drupal::currentUser()->isAnonymous()) {
      global $base_path;
      global $base_url;
      $cpCoreController = new CpCoreController();
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $urlLogout = $base_url . $base_path;
      $urlLogout .= $lang == 'es' ? 'es/user/logout' : 'user/logout';
      $currentUser = \Drupal::currentUser();


      $uid = $currentUser->id();
      $nid_company = $cpCoreController->_cp_core_get_company_nid_by_user($uid);
      $path_dsbd = $cpCoreController->get_dashboard_path_by_user_role();
      $company_name = NULL;
      if ($nid_company && is_numeric($nid_company)) {
        $company_name = Node::load($nid_company)->getTitle();
      }

      $handler = \Drupal::service('theme_handler');
      $path_theme = $handler->getTheme('catalogo_public')->getPath();
      $img_icon_user = base_path() . $path_theme . '/images/icons/img_ico_user.png';
      return [
        '#theme' => 'hello_user',
        '#img_ico' => $img_icon_user,
        '#name_user' => [
          'company' => $company_name,
          'user_mail' => $currentUser->getEmail(),
        ],
        '#url_logout' => $urlLogout,
        '#path_dsbd' => $path_dsbd
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
