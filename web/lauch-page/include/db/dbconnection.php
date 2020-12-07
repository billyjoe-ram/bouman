<?php
    require_once 'dbconfig.php' ;
    
    try {

    
        $conn = new PDO(DBDRIVER . ':host=' . DBHOSTNAME .';port=' . DBPORT . ';dbname=' . DBNAME .';charset=utf8',  DBUSERNAME, DBPASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")); 

        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
            

    } catch (PDOException $Exception) {
        echo "Erro: " . $Exception->getMessage() . " - Código: " . $Exception->getCode(); 
        exit;
    }    

   