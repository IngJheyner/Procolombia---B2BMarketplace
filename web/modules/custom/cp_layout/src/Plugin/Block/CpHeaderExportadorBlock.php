<?php

namespace Drupal\cp_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Database;

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

    //get the total points if they are before the expiration date of the table cp_incentives_points
    $query = \Drupal::database()->select('cp_incentives_points', 'cip');
    //sum points
    $query->addExpression('SUM(cip.points)', 'total_points');
    $query->condition('cip.entity_id_company_col', $user->id());
    $query->condition('cip.expiration', date('Y-m-d'), '>=');
    //group by
    $query->groupBy('cip.entity_id_company_col');
    $result = $query->execute()->fetchField();
    $variables['total_points'] = $result ? $result : 0;

    //get the name of status incentive between in min_points and max_points 
    $query = \Drupal::database()->select('cp_incentives_status', 'cis');
    $query->fields('cis', ['name', 'image_src']);
    $query->condition('cis.min_points', $result, '<=');
    $query->condition('cis.max_points', $result, '>=');
    $result = $query->execute()->fetchAssoc();
    $variables['status_incentive'] = $result;


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
      '#theme' => 'cp_header_exportador_template_hook',
      '#language' => $variables['language'],
      '#language_2' => $variables['language_2'],
      '#company_logo' => $variables['company_logo'],
      '#business_name' => $variables['business_name'],
      '#name' => $variables['name'],
      '#lastname' => $variables['lastname'],
      '#email' => $variables['email'],
      '#uid' => $variables['uid'],
      '#country' => $variables['country'],
      '#total_points' => $variables['total_points'],
      '#status_incentive' => $variables['status_incentive'],
    ];
  }

}