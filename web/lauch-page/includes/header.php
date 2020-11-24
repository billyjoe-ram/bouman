<?php
    require_once 'utilities/debug.php';

    function get_header($cssCaminho = '', $jsCaminho = '', $title='Pré-Cadastro do Bouman')
    {
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <link rel="stylesheet" href="./css/style.css">

    <?php
        if (!empty(trim($cssCaminho))) {
            echo "<link rel='stylesheet' href='$cssCaminho'>";
        } 
    ?>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous">
    </script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.15.1/jquery.validate.min.js">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.js">
    </script>
        
    <script src="./js/scripts.js"></script>

    <?php
        if (!empty(trim($jsCaminho))) {
            echo "<script src='$jsCaminho'></script>";
        }
    ?>

    <title>    
        <?php
            if (!empty(trim($title))) {
                echo "$title";
            }
        ?>
     </title>

</head>

<?php
    require_once 'includes/navbar.php';
?>

<body>

    <?php
    }