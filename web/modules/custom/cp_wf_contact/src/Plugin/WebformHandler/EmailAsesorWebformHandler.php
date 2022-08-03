<?php
namespace Drupal\cp_wf_contact\Plugin\WebformHandler;

use Drupal\webform\Plugin\WebformHandler\EmailWebformHandler;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Emails a webform submission.
 *
 * @WebformHandler(
 *   id = "assesor_mail",
 *   label = @Translation("Email to assessor"),
 *   category = @Translation("Notification"),
 *   description = @Translation("Sends a webform submission to email address per category."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_UNLIMITED,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 * )
 */
class EmailAsesorWebformHandler extends EmailWebformHandler {

  public function sendMessage(WebformSubmissionInterface $webform_submission, array $message) {
    $data = $webform_submission->getData();
    $tid_submited = $data['category_of_interest'];
    $asesorOfCategory = $this->getAsesorOfCategory($tid_submited);
    // Enviar a correo de actualizaciones de seguridad. $config['update.settings']['notification']['emails']
    // $asesorMail = \Drupal::config('system.site')->get('mail');
    $config =  \Drupal\Core\Site\Settings::get('update.settings');
    // Security mail
    $asesorMail = implode(',', $config['notification']['emails']);
    if($asesorOfCategory['exists']){
      // Send mail to asesor
      $asesorMail = $asesorOfCategory['asesor']['mail'];
    }else{
      // When no exists asesor wite in log
      $message_error = 'Categorías sin asesor: '. implode(' , ', $asesorOfCategory['categories']);
      $message['subject'] = $message_error;
      \Drupal::logger('asesor_mail_contact_form')->error($message_error);
    }
    $message['to_mail'] = $asesorMail;
    parent::sendMessage($webform_submission, $message);
  }

  public function getAsesorOfCategory( $tid = 0 ){
    $asesorOfCategory = [];
    $asesorOfCategory['exists'] = FALSE;
    $asesorOfCategory['asesor'] = NULL;
    $asesorOfCategory['categories'] = [];
    if (isset($tid) && !empty($tid)) {
      // $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load(intval($tid));
      $ancestors = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadAllParents(intval($tid));
      // Loop over all term and ancestors for check asesor field
      foreach ($ancestors as $term) {
        $asesor = $term->get('field_asesor');
        $asesorOfCategory['categories'][] = '/taxonomy/term/'.$term->id().'/edit - '.$term->label();
        // Check if field asesor is not empty
        if(!$asesor->isEmpty()){
          $data_asesor = $asesor ->first()
          ->get('entity')
          ->getTarget()
          ->getValue();
          $asesorOfCategory['asesor']['mail'] = $data_asesor->get('mail')->value;
          $asesorOfCategory['asesor']['uid'] = $data_asesor->get('uid')->value;
          $asesorOfCategory['asesor']['name'] = $data_asesor->get('name')->value;
          // save flag when asesor exists
          $asesorOfCategory['exists'] = TRUE;
          // Break loop when find a asesor
          break;
        }
      }
    }
    return $asesorOfCategory;
  }
}
