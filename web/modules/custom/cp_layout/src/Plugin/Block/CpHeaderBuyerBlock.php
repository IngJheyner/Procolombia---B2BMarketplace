<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Header buyer' Block.
 *
 * @Block(
 *   id = "header_buyer",
 *   admin_label = @Translation("Header buyer"),
 *   category = @Translation("Layout"),
 * )
 */
class CpHeaderBuyerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $uid = \Drupal::currentUser();
    $user = \Drupal\user\Entity\User::load($uid->id());
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    //force language in all paths
    $variables['language'] = $language == 'en' ? 'EN' : 'ES';
    $variables['language_2'] = $language != 'en' ? 'EN' : 'ES';

    $variables['company_logo'] = '';
    $variables['business_name'] = '';
    if($user->isActive()){

      //check if has exporter rol
      // chek if user is not root
      if($user->hasRole('exportador')){
        //is not empty field_company_name
        if(!empty($user->get('field_company_name')->value)){
          $variables['business_name'] = $user->get('field_company_name')->value;
          $variables['company_logo'] = file_create_url($user->get('field_company_logo')->entity->getFileUri());
        }
        else{
          $variables['company_logo'] = '';
          $variables['business_name'] = '';
        }
      }
    }
    //is not empty field_company_name
    $variables['name'] = $user->get('field_company_contact_name')->value;
    $variables['lastname'] = $user->get('field_company_contact_lastname')->value;
    //get email
    $variables['email'] = $user->get('mail')->value;

    //get id of user if not exist put indefinido
    $variables['uid'] = $uid->id();
    //get country
    $variables['country'] = $user->get('field_country')->value != "" ? $user->get('field_country')->value : 'Colombia';
    return [
        // Your theme hook name.
        '#theme' => 'cp_header_buyer_template_hook',
        '#language' => $variables['language'],
        '#language_2' => $variables['language_2'],
        '#name' => $variables['name'],
        '#lastname' => $variables['lastname'],
        '#email' => $variables['email'],
        '#uid' => $variables['uid'],
        '#country' => $variables['country'],
    ];
  }

}