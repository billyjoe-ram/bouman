<?php

function debugar($debugar,
                $exibir_bonito = false,
                $mensagem = '',
                $parar = true)
{
    if ($exibir_bonito) {
        echo "<pre> $mensagem <hr>";
    }
    var_dump($debugar);
    if ($parar) {
        exit();
    }
}