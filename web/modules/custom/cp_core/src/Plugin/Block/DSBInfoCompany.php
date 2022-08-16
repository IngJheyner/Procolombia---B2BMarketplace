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
* id = "dsb_info_company",
* admin_label = @Translation("Dashboard user info company"),
* )
*/
class DSBInfoCompany extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    global $base_path;
    global $base_url;
    $urlBase = $base_url . $base_path;
    $uid = \Drupal::currentUser()->id();
    $CpCoreController = new CpCoreController();
    $nid_company = $CpCoreController->_cp_core_get_company_nid_by_user($uid);
    $handler = \Drupal::service('theme_handler');
    $path_theme = $handler->getTheme('catalogo_public')->getPath();
    $img_add_company = $urlBase . $path_theme. '/images/dsbd_company_logo.png';
    $company_name = NULL;
    $nit = NULL;
    $label_state = NULL;
    $bool_publish = NULL;
    if (!empty($nid_company) && is_numeric($nid_company)) {
      $companyLoad = Node::load($nid_company);
      $company_name = $companyLoad->getTitle();
      $bool_publish = $companyLoad->isPublished() == TRUE ? 'Si': 'No';
      $nit = $companyLoad->get('field_nit')->getValue()[0]['value'];
      $state = $companyLoad->get('field_states')->getValue()[0]['value'];
      $label_state = $CpCoreController->get_label_by_state($state);
    }
    return [
      '#theme' => 'dsb_company_info',
      '#img_add_company' => $img_add_company,
      '#nid_company' => $nid_company,
      '#name_company' => $company_name,
      '#nit' => $nit,
      '#label_state' => $label_state,
      '#bool_publish' => $bool_publish,
    ];
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
