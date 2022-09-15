<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_pro_adviser controller.
 */
class CpReviewProAdviserController extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_review_pro_adviser_template_hook',
        ];
    }

    /*
    * Function to return all advisor_logs
    */
    public function getAdvisorLogs(Request $request)
    {
        $start = $request->request->get('start');
        $limit = $request->request->get('length');

        $search = $request->request->get('search');
        //get order[column] and order[dir]
        $order = $request->request->get('order');
        //get column
        $column = $order[0]['column'];
        //get dir
        $dir = $order[0]['dir'];

        $query = \Drupal::database()->select('advisor_logs', 'al');
        $query->fields('al', ['id', 'email', 'company_name', 'created_at', 'action', 'status']);

        $company_name = $request->request->get('company_name');
        if (!empty($company_name)) {
            $query->condition('company_name', $company_name, '=');
        }

        //email
        $email = $request->request->get('email');
        if (!empty($email)) {
            $query->condition('email', $email, '=');
        }
        

        //created_at
        $created_at = $request->request->get('created_at');
        if (!empty($created_at)) {
            $query->condition('created_at', $created_at, '=');
        }

        //status
        $status = $request->request->get('status');
        if (!empty($status)) {
            $query->condition('status', $status, '=');
        }

        //sort
        //check if 
        switch ($column) {
            case 1:
                $query->orderBy('email', $dir);
                break;
            case 2:
                $query->orderBy('company_name', $dir);
                break;
            case 3:
                $query->orderBy('created_at', $dir);
                break;
            case 4:
                $query->orderBy('status', $dir);
                break;
        }

        $query->range($start, $limit);
        //get users
        $results = $query->execute()->fetchAll();

        $log = array();
        foreach ($results as $result) {
            $log[] = array(
                'id' => $result->id,
                'email' => $result->email,
                'company_name' => $result->company_name,
                'created_at' => $result->created_at,
                'action' => $result->action,
                'status' => $result->status,
            );
        }
        //count
        $query = \Drupal::database()->select('advisor_logs', 'al');
        $query->fields('al', ['id', 'email', 'company_name', 'created_at', 'action', 'status']);
        $company_name = $request->request->get('company_name');
        if (!empty($company_name)) {
            $query->condition('company_name', $company_name, '=');
        }

        //email
        $email = $request->request->get('email');
        if (!empty($email)) {
            $query->condition('email', $email, '=');
        }
        

        //created_at
        $created_at = $request->request->get('created_at');
        if (!empty($created_at)) {
            $query->condition('created_at', $created_at, '=');
        }

        //status
        $status = $request->request->get('status');
        if (!empty($status)) {
            $query->condition('status', $status, '=');
        }

        //sort
        //check if 
        switch ($column) {
            case 1:
                $query->orderBy('email', $dir);
                break;
            case 2:
                $query->orderBy('company_name', $dir);
                break;
            case 3:
                $query->orderBy('created_at', $dir);
                break;
            case 4:
                $query->orderBy('status', $dir);
                break;
        }
        $query->countQuery();
        $count = $query->execute()->fetchField();
        return new JsonResponse(array(
            'draw' => $request->request->get('draw'),
            'recordsTotal' => $count,
            'recordsFiltered' => $count,
            'data' => $log,
        ));
    }
}
