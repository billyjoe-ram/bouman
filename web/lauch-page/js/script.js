console.log("working;");

const mascara = {
    // Máscara para celular
    celu(value) {        
        return value
        // Impedir valores não-numéricos
        .replace(/\D/g, '')
        // Adicionar parênteses de DDD
        .replace(/(\d{2})(\d)/, '($1) $2')
        // Adicionar hífen
        .replace(/(\d{5})(\d)/, '$1-$2')
        // Limitar valores
        .replace(/(-\d{4})\d+?$/, '$1')
    },

    // Máscara para telefone
    tele(value) {        
        return value
        // Impedir valores não-numéricos
        .replace(/\D/g, '')
        // Adicionar parênteses de DDD
        .replace(/(\d{2})(\d)/, '($1) $2')
        // Adicionar hífen
        .replace(/(\d{4})(\d)/, '$1-$2')
        // Limitar valores
        .replace(/(-\d{4})\d+?$/, '$1')
    }

}

// Obtendo dados dos inputs
document.querySelectorAll('input').forEach(($input) => {
    const campo = $input.dataset.js

    $input.addEventListener('input', (e) => {
        e.target.value = mascara[campo](e.target.value)
    }, false)

})

// function texto(){

//     //mudança do texto h1 para "Pré-cadastro realizado com sucesso!"
//     document.querySelector('.titulo-pag').innerHTML = "Pré-cadastro realizado com sucesso!";
// }

/* */

    /*--------------Jquery--------------*/

    $(document).ready(function() { 

        /*Tabela cidade*/
        $("#uf").on("change", function(){

            var vl = $("#uf").val();//Atribuindo o valor de retorno da tag selection com um valor estiver selecionado

            //Código Ajax
            $.post("include/crud/crudformulario.php", { cd_estado: vl}) // metodo post, pagina para envio dos dados

            .done(function (data) {
                alert(vl);
                if(vl == null || vl ==""){ //verificando se o valor de vl é nulo ou vazio
                    alert(vl);
                    $('#cidade').html('<option value="">Selecione</option>'); // se for vazio
                }else{
                    $('#cidade').html(data); // se não for vazio vou trazer os dados da requisição da pagina php pelo banco
                }

            });
        });
        /*Fim Tabela Cidade */
    });
    /*------------Fim Jquery------------*/
    