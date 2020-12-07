<?php
    function insert($nome,$email,$cidade,$uf,$area,$conn){

           try{

                $comandoSQL =   " INSERT INTO tb_pre_usuario (nm_usuario, ds_email, cd_cidade, cd_estado, cd_area) "; 
                $comandoSQL = $comandoSQL . " VALUES "; 
                $comandoSQL = $comandoSQL . " ( " ; 
                $comandoSQL = $comandoSQL . $conn->quote($nome); 
                $comandoSQL = $comandoSQL . " , ";
                $comandoSQL = $comandoSQL . $conn->quote($email);         
                $comandoSQL = $comandoSQL . " , "; 
                $comandoSQL = $comandoSQL . $cidade;         
                $comandoSQL = $comandoSQL . " , "; 
                $comandoSQL = $comandoSQL . $uf;         
                $comandoSQL = $comandoSQL . " , ";
                $comandoSQL = $comandoSQL . $area;         
                $comandoSQL = $comandoSQL . " ) ";   


                $linhasafetadas = $conn->exec($comandoSQL);

           }catch(PDOException $excpetion){
                echo "INSERT Usuario - Erro: " . $Exception->getMessage() . " . Código" . $Exception->getCode() ;
           }
    
    }