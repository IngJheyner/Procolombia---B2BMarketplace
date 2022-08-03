<?php
//se requiere el archivo nusoap.php de la librer?
include(drupal_get_path('module', 'cp_core') . '/sf/lib/nusoap.php');

function ConsultaPrueba(){

  //Se incluye el archivo el cual contiene la conexi? a los datos de salesforce
  include(drupal_get_path('module', 'cp_core') . '/sf/inc_connection.php');

  //Consulta de los datos mediante el NIT
  $queryX = "SELECT Razon_Social__c,NUMERO_DE_IDENTIFICACION__C,Ciudad__C,Departamento__C,PA_S__C,Direccion_Principal__C,Indicativo__C,Phone,Correo_Corporativo__C ".
           "FROM Account WHERE NUMERO_DE_IDENTIFICACION__C='". $nit ."' ";
  $response1 = $connection->query($queryX);
  $queryResult1 = new QueryResult($response1);
  $records1 = $queryResult1->records;
  $entidad = array();
  if (!empty($records1)) {
    foreach ($records1 as $record) {
        $sObject = new SObject($record);
        $query2 = "Select Name FROM Ciudades__c WHERE Id = '". $sObject->fields->Ciudad__c . "'";
        $response2 = $connection->query($query2);
        $queryResult2 = new QueryResult($response2);
        $records2 = $queryResult2->records;
        $sObject2 = new SObject($records2[0]);
        //Se le asigna a la variable entidades, que es una arreglo,
        //un arreglo en el cual el primer campo es el NIT obtenido, el segundo campo es el nombre obtenido
        $entidad[]= array(
            'nit'=>$sObject->fields->Numero_de_Identificacion__c,
            'nombre' => $sObject->fields->Razon_Social__c,
            'ciudad' => $sObject2->fields->Name,
            'dpto' => $sObject->fields->Departamento__c,
            'pais' => $sObject->fields->Pa_s__c,
            'direccion' => $sObject->fields->Direccion_Principal__c,
            'indicativo' => $sObject->fields->Indicativo__c,
            'telefono' => $sObject->fields->Phone,
            'correo' => $sObject->fields->Correo_Corporativo__c,
        );
    }
  }
  //Se retorna la variable entidad
  return $entidad;
}

//Funci? que realiza la consulta por NIT
function ConsultaNIT($nit){
  //Se incluye el archivo el cual contiene la conexi? a los datos de salesforce
  include(drupal_get_path('module', 'cp_core') . '/sf/inc_connection.php');
  //Consulta de los datos mediante el NIT
  $query1 = "SELECT  Razon_Social__c,NUMERO_DE_IDENTIFICACION__C,Ciudad__C,Departamento__C,PA_S__C,Direccion_Principal__C,Indicativo__C,Phone,Correo_Corporativo__C ".
           "FROM Account ".
           "WHERE RECORDTYPEID IN ".
           "(SELECT ID FROM RecordType ".
           "WHERE NAME IN ('Cuenta Nacional','Cuenta Personal','Entidad Gubernamental','Gremios Colombia')) AND ".
           "NUMERO_DE_IDENTIFICACION__C='". $nit ."' ". "And Razon_Social__c != null ".
           "ORDER BY NAME ASC";
  $response1 = $connection->query($query1);
  $queryResult1 = new QueryResult($response1);
  $records1 = $queryResult1->records;
  $entidad = array();
  if (!empty($records1)) {
    foreach ($records1 as $record) {
        $sObject = new SObject($record);
        $query2 = "Select Name FROM Ciudades__c WHERE Id = '". $sObject->fields->Ciudad__c . "'";
        $response2 = $connection->query($query2);
        $queryResult2 = new QueryResult($response2);
        $records2 = $queryResult2->records;
        $sObject2 = new SObject($records2[0]);
        //Se le asigna a la variable entidades, que es una arreglo,
        //un arreglo en el cual el primer campo es el NIT obtenido, el segundo campo es el nombre obtenido
        $entidad[]= array(
            'nit'=>$sObject->fields->Numero_de_Identificacion__c,
            'nombre' => $sObject->fields->Razon_Social__c,
            'ciudad' => $sObject2->fields->Name,
            'dpto' => $sObject->fields->Departamento__c,
            'pais' => $sObject->fields->Pa_s__c,
            'direccion' => $sObject->fields->Direccion_Principal__c,
            'indicativo' => $sObject->fields->Indicativo__c,
            'telefono' => $sObject->fields->Phone,
            'correo' => $sObject->fields->Correo_Corporativo__c,
        );
    }
  }
  //Se retorna la variable entidad
  return $entidad;
}

//Funci? que consulta por nombre comercial
function ConsultaNombre($nombre){
  include(drupal_get_path('module', 'cp_core') . '/sf/inc_connection.php');
  ini_set("soap.wsdl_cache_enabled", "0");
    $query1 = "SELECT  Razon_Social__c,NUMERO_DE_IDENTIFICACION__C,Ciudad__C,Departamento__C,PA_S__C,Direccion_Principal__C,Indicativo__C,Phone,Correo_Corporativo__C ".
           "FROM Account ".
           "WHERE RECORDTYPEID IN ".
           "(SELECT ID FROM RecordType ".
           "WHERE NAME IN ('Cuenta Nacional','Cuenta Personal','Entidad Gubernamental','Gremios Colombia')) AND ".
           " Razon_Social__c LIKE '%".utf8_encode($nombre)."%' ".
           "ORDER BY NAME ASC";

    $response1 = $connection->query($query1);
    $queryResult1 = new QueryResult($response1);
    $records1 = $queryResult1->records;
    foreach ($records1 as $record) {
        $sObject = new SObject($record);
        $query2 = "Select Name FROM Ciudades__c WHERE Id = '". $sObject->fields->Ciudad__c . "'";
        $response2 = $connection->query($query2);
        $queryResult2 = new QueryResult($response2);
        $records2 = $queryResult2->records;
        $sObject2 = new SObject($records2[0]);
        //Se le asigna a la variable entidades, que es una arreglo,
        //un arreglo en el cual el primer campo es el NIT obtenido, el segundo campo es el nombre obtenido
        $entidades[]= array(
            'nit'=>$sObject->fields->Numero_de_Identificacion__c,
            'nombre' => $sObject->fields->Razon_Social__c,
            'ciudad' => $sObject2->fields->Name,
            'dpto' => $sObject->fields->Departamento__c,
            'pais' => $sObject->fields->Pa_s__c,
            'direccion' => $sObject->fields->Direccion_Principal__c,
            'indicativo' => $sObject->fields->Indicativo__c,
            'telefono' => $sObject->fields->Phone,
            'correo' => $sObject->fields->Correo_Corporativo__c,
        );
    }

  //Se retorna la variable entidades
  return $entidades;
}
