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

function texto(){
    //mudança do texto h1 para "Pré-cadastro realizado com sucesso!"

    document.getElementById("texto").innerHTML = "Pré-cadastro realizado com sucesso!";    
}