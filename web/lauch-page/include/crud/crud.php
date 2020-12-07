<?php
    function insert($nome,$email,$telefone,$celular,$cidade,$uf,$area,$conn){

           try{

                //Parte um
                $insert_usuario = " INSERT INTO tb_pre_usuario (nm_usuario, ds_email, cd_cidade, cd_estado, cd_area) "; 
                $insert_usuario = $insert_usuario . " VALUES "; 
                $insert_usuario = $insert_usuario . " ( " ; 
                $insert_usuario = $insert_usuario . $conn->quote($nome); 
                $insert_usuario = $insert_usuario  . " , ";
                $insert_usuario = $insert_usuario  . $conn->quote($email);         
                $insert_usuario = $insert_usuario  . " , "; 
                $insert_usuario = $insert_usuario  . $cidade;         
                $insert_usuario = $insert_usuario  . " , "; 
                $insert_usuario = $insert_usuario  . $uf;         
                $insert_usuario = $insert_usuario  . " , ";
                $insert_usuario = $insert_usuario  . $area;         
                $insert_usuario = $insert_usuario . " ) ";   

                $linhasafetadas = $conn->exec($insert_usuario);

                // //Parte dois

                 
                $id_usuario = $conn-> prepare("SELECT max(cd_pre_usuario) FROM tb_pre_usuario");
                $id_usuario->execute();
                $row=$id_usuario->fetchAll();               

                $insert_usuario = " INSERT INTO tb_contato (cd_pre_usuario, ds_telefone, ds_celular) "; 
                $insert_usuario = $insert_usuario . " VALUES "; 
                $insert_usuario = $insert_usuario . " ( " ; 
                $insert_usuario = $insert_usuario . $row['0']['0']; 
                $insert_usuario = $insert_usuario  . " , ";
                $insert_usuario = $insert_usuario  . $conn->quote($telefone);         
                $insert_usuario = $insert_usuario  . " , "; 
                $insert_usuario = $insert_usuario  . $conn->quote($celular);        
                $insert_usuario = $insert_usuario . " ) ";   

                $linhasafetadas = $conn->exec($insert_usuario);

           }catch(PDOException $excpetion){
                echo "INSERT Usuario - Erro: " . $Exception->getMessage() . " . Código" . $Exception->getCode() ;
           }
    
    }   