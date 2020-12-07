<?php

    include_once '../db/dbconnection.php'; 

    $selectItens = $conn->prepare("SELECT * FROM tb_cidade WHERE cd_estado = ".$_POST['cd_estado']);
    $selectItens->execute();
    $row=$selectItens->fetchAll();
    $count = $selectItens->rowCount();
    
    if($count > 0){
        echo '<option value="">Selecione</option>';
        foreach($row as $itens){
            echo '<option value="'.$itens['cd_cidade'].'">'.$itens['nm_cidade'].'</option>';
        }
    }

