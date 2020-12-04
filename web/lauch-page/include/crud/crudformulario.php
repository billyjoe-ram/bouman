<?php

    include_once '../db/dbconnection.php';
    

    $selectItens = $conn->prepare("SELECT * FROM tb_cidade WHERE cd_estado = ".$_POST['cd_estado']);
    $selectItens->execute();
    $row=$selectItens->fetchAll();
    $count = $selectItens->rowCount();
    
    if($count > 0){
        foreach($row as $itens){
            echo '<option value="'.$itens['cd_estado'].'">'.$itens['nm_cidade'].'</option>';
        }
    }

