<?php

    $nome = ($email=$celular=$telefone=$cidade=$uf=$area=$interesse="");

    //verificando se as variaveis estão definidas
    if(isset($_POST['txtcidade'], $_POST['txtnome'],$_POST['txtemail'],
    $_POST['txtcelular'],$_POST['txttelefone'],$_POST['txtuf'],$_POST['txtarea'],$_POST['txtinteresse'])){

        //atribuindo valores e retirando os espaços

        $nome = trim($_POST['txtnome']);
        $email= trim($_POST['txtemail']);
        $celular=trim($_POST['txtcelular']);
        $telefone=trim($_POST['txttelefone']);
        $cidade=trim($_POST['txtcidade']);
        $uf=trim($_POST['txtuf']);
        $area=trim($_POST['txtarea']);
        $interesse=$_POST['txtinteresse'];

        if(!empty($nome) && !empty($email) && !empty($celular)
         && !empty($cidade) && !empty($uf) && !empty($area)){

             
           if(strlen($celular) == 15){
                var_dump($_POST);
                
           }
             
            
        }


    }