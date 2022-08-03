<?php

namespace Drupal\cp_search\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\cp_search\Controller\CpSearchController;
use Drupal\image\Entity\ImageStyle;
use Drupal\taxonomy\Entity\Term;

/**
* Provides a block with a simple text.
*
* @Block(
* id = "banner_category",
* admin_label = @Translation("Banner Category"),
* )
*/
class BannerCategory extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    $current_path = \Drupal::service('path.current')->getPath();
    $args = explode('/', ltrim($current_path, '/'));
    $count = count($args);
    $CpSearch = new CpSearchController();
    $real_uri_img = NULL;
    $taxonomy_name = '';
    if ($count > 1) {
      $tid_cat = $CpSearch->_cp_search_get_tid_by_url($args[1]);
      if (is_numeric($tid_cat)) {
        $curr_langcode = \Drupal::languageManager()->getCurrentLanguage(\Drupal\Core\Language\LanguageInterface::TYPE_CONTENT)->getId();
        $taxonomy_term = Term::load($tid_cat);
        $taxonomy_term_trans = \Drupal::service('entity.repository')->getTranslationFromContext($taxonomy_term, $curr_langcode);
        $taxonomy_name = $taxonomy_term_trans->getName();
        $uri_img = $CpSearch->_cp_search_get_img_cat_uri($tid_cat);
        $real_uri_img = ImageStyle::load('results_banner')->buildUrl($uri_img);
      }
    }
    else {
      $uri_img = $CpSearch->_cp_search_get_img_block_type_banner(1);
      $real_uri_img = ImageStyle::load('results_banner')->buildUrl($uri_img);
      $taxonomy_name = t('Search by product');
    }

    return array (
      '#theme' => 'bannerCategory',
      '#uri_img' => $real_uri_img,
      '#taxonomy_name' => $taxonomy_name,
    );
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
   * @return int
   */
  public function getCacheMaxAge() {
    return 0;
  }
}
