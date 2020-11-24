<?php
require_once 'includes/header.php';
get_header();
?>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-6">
            <h1>Formulário de pré-cadastro</h1>
        </div>
        <div class="col-md-2"></div>
    </div>
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-4" id="texto">
            <h3 id="destaque">O QUE É O BOUMAN?</h3>
            <p>O Bouman é a mais nova <span id="destaque">plataforma</span> pensada e adaptada para os <span id="destaque">cientistas e inventores brasileiros</span>, oferecendo diversas
            ferramentas que <span id="destaque">facilitam o desenvolvimento</span> de pesquisas e o trabalho em grupo.</p>
            <p>Pensando no senso de comunidade, oferecemos a opção dos <span id="destaque">usuários contribuirem</span> em trabalhos de outros pesquisadores, 
            oferecendo sugestões e análises.  Também, visando o investimento nestes projetos, temos uma interface amigável e <span id="destaque">compatível 
            com empresas</span> que buscam novos talentos e querem se conectar com os profissionais.</p>
            <p>Infelzmente não podemos fazer isso, <span id="destaque">sem a sua ajuda</span>! Nossos usuários são nossa maior prioridade e queremos que eles 
            conheçam melhor o que oferecemos e estejam preparados para quando finalmente nos lançarmos na internet! Preencha o formulário 
            ao lado se você tem interesse de receber nossos <span id="destaque">Termos de Uso</span> previamente e ser um dos primeiros a explorar a plataforma!</p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <form class="cadastro" action="sucess.php">
                <div class="row">
                    <div class="col">
                        <label>Nome Completo</label>
                        <div class="break"></div>
                        <input type="text" name="txtnome" id="nome"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label>Email</label>
                        <div class="break"></div>
                        <input type="email" name="txtemail" id="email"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label>Celular</label>
                        <input type="tel" name="txtcelular" id="celular"/>
                    </div>
                    <div class="col">
                        <label>Telefone</label>
                        <input type="tel" name="txttelefone" id="telefone"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label>Cidade</label>
                        <input type="text" name="txtcidade" id="cidade"/>
                    </div>
                    <div class="col">
                        <label>UF</label>
                        <select name="txtuf" id="uf">
                            <option value="">Selecione</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AM">AM</option>
                            <option value="AP">AP</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MG">MG</option>
                            <option value="MS">MS</option>
                            <option value="MT">MT</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="PR">PR</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SE">SE</option>
                            <option value="SP">SP</option>
                            <option value="TO">TO</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label>Área de Atuação</label>
                        <input type="text" name="txtarea" id="area"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-9">
                        <label>
                            <h6>Tenho interesse em me cadastrar no Bouman e receber no meu e-mail os Termos de Uso.</h6>
                        </label>
                    </div>
                    <div class="col-md-1">
                        <input type="checkbox" id="interesse" name="txtinteresse">  
                    </div>
                    <div class="col-md-2"></div>
                </div>
                <div class="row">
                    <input type="submit" name="btnenviar" id="enviar" value="Enviar" />
                </div>
            </form>
        </div>
        <div class="col-md-1"></div>
    </div>
</div>

<?php
require_once 'includes/footer.php';
?>