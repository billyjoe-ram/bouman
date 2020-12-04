<?php

    $nome = ($email=$celular=$telefone=$cidade=$uf=$area="");

    //verificando se as variaveis estão definidas
    if(isset($_POST['txtcidade'], $_POST['txtnome'],$_POST['txtemail'],
    $_POST['txtcelular'],$_POST['txttelefone'],$_POST['txtuf'],$_POST['txtarea'])){

        //atribuindo valores e retirando os espaços

        $nome = trim($_POST['txtnome']);
        $email= trim($_POST['txtemail']);
        $celular=trim($_POST['txtcelular']);
        $telefone=trim($_POST['txttelefone']);
        $cidade=trim($_POST['txtcidade']);
        $uf=trim($_POST['txtuf']);
        $area=trim($_POST['txtarea']);

        if(!empty($nome) && !empty($email) && !empty($celular) && !empty($telefone)
         && !empty($cidade) && !empty($uf) && !empty($area)){

             
           if(strlen($celular) == 15 && strlen($telefone)== 14){
                var_dump($_POST);
                echo'lula ladrao';
           }
             
            
        }


    }