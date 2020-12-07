<?php
    include_once 'include/header.php'; //INCLUINDO O HEADER HTML 
    include_once 'include/db/dbconnection.php'; //INCLUINDO A CONEXÃO
    include_once 'include/crud/crud.php';
    include_once 'include/rules/verificacao.php';  //INCLUINDO A VERIFICAÇÃO DOS DADOS VIA PHP
    /*
    _________________________________________________________
    |                    |EQUIPE BOUMAN|                      |              
    |_________________________________________________________|
    |                                                         |
    | BILLY JOE SANTOS                                        |              
    | BRUNO PEREIRA SANTANA                                   |
    | TÂMIRES SIQUEIRA                                        |
    | DENIS HOLANDA                                           |  
    |_________________________________________________________|    
    */
    // var_dump($conn);   
?>

<body>
    
    <!-- CABEÇALHO -->    
    <header>        
        <span id="titulo">Projeto Bouman</span>
        <img src="imagem/logo.png" id="logo">
    </header>    
    <h1 class="titulo-pag"> Pré-cadastro</h1>
    <!--FIM CABEÇALHO -->

    <!--INICIO CONTEÚDO-->
    <main>    

        <!--INICIO INFO-->
        <div class="info">
            <h3 class="destaque">O QUE É O BOUMAN?</h3>                  
                <p>O Bouman é a mais nova <span class="destaque">plataforma</span> pensada e adaptada para os <span class="destaque">cientistas e inventores brasileiros</span>, oferecendo diversas
                ferramentas que <span class="destaque">facilitam o desenvolvimento</span> de pesquisas e o trabalho em grupo.</p>
                <p>Pensando no senso de comunidade, oferecemos a opção dos <span class="destaque">usuários contribuirem</span> em trabalhos de outros pesquisadores, oferecendo sugestões e análises.  Também, visando o investimento nestes projetos, temos uma interface amigável e <span class="destaque">compatível com empresas</span> que buscam novos talentos e querem se conectar com os profissionais.</p>
                <p>Mas não podemos fazer isso <span class="destaque">sem a sua ajuda</span>! Nossos usuários são nossa maior prioridade e queremos que eles conheçam melhor o que oferecemos e estejam preparados para quando finalmente nos lançarmos na internet! Preencha o formulário ao lado se você tem interesse de receber nossos <span class="destaque">Termos de Uso</span> previamente e ser um dos primeiros a explorar a plataforma!</p>            
        </div>
        <!--FIM INFO-->

        <!--INICIO FORMULÁRIO-->  
        <form class="precadastro" name="precadastro" method="post" action="">

            <!--INICIO NOME-->
            <div class="row">
                <div class="col">
                    <label>Nome Completo</label>
                    <input type="text" name="txtnome" id="nome" required/>
                </div>
            </div>
            <!--FIM NOME-->

            <!--INICIO EMAIL-->
            <div class="row">
                <div class="col">
                    <label>Email</label>
                    <input type="email" name="txtemail" id="email" required/>
                </div>
            </div>
            <!--FIM EMAIL -->

            <!-- INICIO CONTATO-->
            <div class="row">
                <div class="col">
                    <label>Celular</label>
                    <input type="tel" name="txtcelular" id="celular" minlength="15" maxlength="15" required data-js="celu"/>
                </div>
                <div class="col">
                    <label>Telefone</label>
                    <input type="tel" name="txttelefone" id="telefone" minlength="14" maxlength="14" data-js="tele"/>
                </div>
            </div>
            <!--FIM CONTATO-->

            
            <div class="row">
                <!--SELECT CIDADE-->
                <div class="col"> 
                    <label>Cidade</label>
                    <select name="txtcidade" id="cidade" required>
                        <option value="">Selecione</option>
                    </select> 
                </div>
                <!--FIM SELECT CIDADE -->

                <!--INICIO SELECT ESTADO-->
                <div class="col">
                    <label>UF</label>
                    <select name="txtuf" id="uf" required>
                        <option value="">Selecione</option>
                        <!-- INICIO BLOCO PHP -->
                        <?php
                            $selectItens = $conn->prepare("SELECT * FROM tb_estado order by nm_estado asc ");
                            $selectItens->execute();
                            $row=$selectItens->fetchAll();
                            $count = $selectItens->rowCount();
                            
                            if($count > 0){
                                foreach($row as $itens){
                                    echo '<option value="'.$itens['cd_estado'].'">'.$itens['nm_estado'].'</option>';
                                }
                            }
                        ?>
                        <!-- FIM BLOCO PHP -->
                    </select> 
                </div>    
            </div>
            <!-- FIM SELECT ESTADO-->

            <!--INICIO SELECT DA ÁREA DE ATUAÇÃO-->
            <div class="row">
                <div class="col">
                    <label>Área de Atuação</label>
                    <select name="txtarea" id="area" required>
                        <option value="">Selecione</option> 
                        <?php
                            $selectItens = $conn->prepare("SELECT * FROM tb_area order by nm_area asc ");
                            $selectItens->execute();
                            $row=$selectItens->fetchAll();
                            $count = $selectItens->rowCount();
                            
                            if($count > 0){
                                foreach($row as $itens){
                                    echo '<option value="'.$itens['cd_area'].'">'.$itens['nm_area'].'</option>';
                                }
                            }
                        ?>          
                    </select>
                </div>
            </div>
            <!--FIM SELECT DA ÁREA DE ATUAÇÃO-->

            <!--INICIO INTERESSE BOUMAN-->
            <div class="row">                
                <label>
                    Tenho interesse em me cadastrar no Bouman e receber no meu e-mail os Termos de Uso.
                </label>                
                <input type="checkbox" id="interesse" name="txtinteresse">                
            </div>
            <!--FIM INTERESSE BOUMAN-->
            
            <!-- INICIO INPUT SUBMIT -->
            <div class="row">
                <input type="submit" id="enviar" value="Enviar"/>
            </div>
            <!--FIM INPUT SUBMIT-->

        </form>
        <!--FIM FORMULÁRIO-->

    </main>
    <!--FIM CONTEUDO-->   

</body>    
</html>