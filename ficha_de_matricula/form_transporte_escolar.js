window.baixarJSONTransporte = function() {
    const dados = {
        data_solicitacao: document.getElementById('data_solicitacao')?.innerText.trim(),
        contato: document.getElementById('contato')?.innerText.trim(),
        responsavel: document.getElementById('responsavel')?.innerText.trim(),
        cpf_responsavel: document.getElementById('cpf_responsavel')?.innerText.trim(),
        aluno: document.getElementById('aluno')?.innerText.trim(),
        data_nascimento_aluno: document.getElementById('data_nascimento_aluno')?.innerText.trim(),
        cpf_aluno: document.getElementById('cpf_aluno')?.innerText.trim(),
        portador_necessidades_especiais: document.getElementById('pne_sim')?.innerText.includes('X') ? 'SIM' : 'NÃO',
        serie: document.getElementById('serie')?.innerText.trim(),
        turma: document.getElementById('turma')?.innerText.trim(),
        periodo: document.getElementById('periodo')?.innerText.trim(),
        unidade_ensino: document.getElementById('unidade_ensino')?.innerText.trim(),
        endereco_residencial: document.getElementById('endereco_residencial')?.innerText.trim(),
        ponto_coleta: document.getElementById('ponto_coleta')?.innerText.trim(),
        sugestao_rota: document.getElementById('sugestao_rota')?.innerText.trim()
    };

};

const imgLogo = document.querySelector('.table-relatorio img');


function gerarFormularioTransporteEscolar() {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Formulário de Transporte Escolar Rural</title>
    <style>
        /* Configurações de Impressão */
        @page {
            size: A4 landscape;
            margin: 0;
        }

        /* Estilos Base */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: #f0f0f0;
            font-size: 13.5px;
        }

        /* Container Principal (A4 Paisagem) */
        .container {
            width: 29.7cm;
            height: 21cm;
            margin: 0 auto;
            background: white;
            display: flex;
            box-sizing: border-box;
            padding: 0.8cm;
            gap: 0.5cm;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        /* Estrutura das Páginas (Duas por folha) */
        .form-page {
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            padding: 0.4cm;
            display: flex;
            flex-direction: column;
            border: 1px solid #eeeeee98;
        }

        /* Cabeçalho e Logos */
        .header {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-bottom: 20px;
        }

        #termo_ciencia .header {
            margin-bottom: 5px;
        }

        .header-center {
            display: block;
            align-items: center;
            text-align: center;
            font-size: 13px;
        }

        .header-center img {
            height: 35px;
            margin-right: 10px;
        }

        #termo_ciencia .header-center img {
            height: 60px;
            display: block;
        }

        #termo_ciencia .header-center {
            margin-top: 15px;
            align-items: center;
            text-align: center;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        /* Títulos e Subtítulos */
        .sub-header {
            text-align: center;
            font-weight: bold;
        }

        #termo_ciencia .sub-header {
            margin-bottom: 25px;
        }

        .title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 12px;
            text-transform: none;
        }

        /* Estrutura de Formulário */
        .form-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 6px;
        }

        .label {
            white-space: nowrap;
            margin-right: 4px;
        }

        .input-line {
            flex: 1;
            border-bottom: 1px solid rgb(185, 185, 185);
            min-height: 15px;
            padding: 0 5px;
        }

        /* Checkboxes Personalizados */
        .checkbox-row {
            display: flex;
            gap: 15px;
            margin-left: 10px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
        }

        .checkbox-box {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1px solid rgb(252, 251, 251);
            margin-right: 5px;
            text-align: center;
            line-height: 12px;
        }

        /* Seções de Texto e Informação */
        .info-text {
            text-align: justify;
            line-height: 1.35;
            margin-top: 10px;
        }

        .decreto-section {
            text-align: justify;
            line-height: 1.3;
        }

        .decreto-title {
            text-align: center;
            display: block;
            font-weight: bold;
            margin-bottom: 4px;
        }

        /* Seção de Assinaturas */
        .signature-section {
            margin-top: 30px;
            text-align: center;
        }

        #termo_ciencia .signature-section {
            margin-top: 80px;
        }

        .signature-line {
            border-top: 1px solid rgb(167, 167, 167);
            width: 65%;
            margin: 0px auto 5px auto;
        }

        .signature-label {
            font-weight: normal;
        }

        /* Estilos do Termo de Ciência (Página Direita) */
        .termo-body {
            text-align: justify;
            line-height: 1.6;
            margin-top: 15px;
        }

        .termo-field {
            display: inline-block;
            border-bottom: 1px solid rgb(185, 185, 185);
            min-width: 50px;
            padding: 0 5px;
        }

        /* Listas Ordenadas */
        .ordered-list {
            margin: 15px 0 15px 15px;
            padding: 0;
            list-style: none;
            counter-reset: item-counter;
        }

        .ordered-list li {
            margin-bottom: 12px;
            text-align: justify;
            position: relative;
            padding-left: 25px;
        }

        .ordered-list li::before {
            content: counter(item-counter) ") ";
            counter-increment: item-counter;
            position: absolute;
            left: 0;
            font-weight: normal;
        }

        .date-line {
            text-align: right;
            margin-top: 30px;
        }
        
        .text-center { text-align: center; }

        #termo_ciencia{
            font-size: 14px;
        }

        /* Estilos de Validação */
        .campo-vazio {
            background-color: #fff0f0;
            border-bottom: 2px solid #ff0000 !important;
        }

        @media print {
            .campo-vazio {
                background-color: transparent !important;
                border-bottom: 1px solid rgb(185, 185, 185) !important;
            }
            body {
                background: white;
            }
            .container {
                box-shadow: none;
                margin: 0;
                padding: 0.8cm;
            }
            #modal-filiacao {
                display: none !important;
            }
        }

        /* Modal de Seleção de Filiação */
        #modal-filiacao {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }

        .modal-content h3 {
            margin-top: 0;
            color: #333;
        }

        .btn-filiacao {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            background: #f9f9f9;
            cursor: pointer;
            border-radius: 4px;
            text-align: left;
            transition: background 0.2s;
        }

        .btn-filiacao:hover {
            background: #eef;
            border-color: #aaf;
        }
        #aluno, #unidade_ensino, #termo_unidade_ensino, #termo_aluno {
            font-size: 14px;
            font-weight: bold;
        }

        #cpf_responsavel {
            flex: 0 0 auto !important;
            width: 100px !important;
            min-width: fit-content !important;
        }

        #periodo {
            text-transform: uppercase;
        }
    </style>
</head>
<body>

<div id="modal-filiacao">
    <div class="modal-content">
        <h3>Selecione o Responsável</h3>
        <div id="opcoes-filiacao"></div>
        <button class="btn-filiacao" onclick="selecionarResponsavel('', '')">Outro (deixar em branco)</button>
    </div>
</div>

<div class="container">

    <div class="form-page">
        <div class="header">
            <div class="header-center">
                <img src="${imgLogo ? imgLogo.src : 'logo-semed.png'}" alt="Logo SEMED">
            </div>
            <div class="header-center">
                <div class="sub-header">Gerência de Transporte Escolar</div>
                <div class="title">Formulário de Solicitação de Transporte Escolar Rural</div>
            </div>
        </div>

        <div class="form-row">
            <div class="label">Data da solicitação:</div>
            <div id="data_solicitacao" class="input-line " contenteditable="true">___/___/_____</div>
            <div class="label ">Contato:</div>
            <div id="contato" class="input-line" contenteditable="true">(___) ______________</div>
        </div>

        <div class="form-row">
            <div class="label">Responsável:</div>
            <div id="responsavel" class="input-line" contenteditable="true"></div>
            <div class="label ">CPF:</div>
            <div id="cpf_responsavel" class="input-line " contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Aluno:</div>
            <div id="aluno" class="input-line" contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Data de Nasc.:</div>
            <div id="data_nascimento_aluno" class="input-line " contenteditable="true">___/___/_____</div>
            <div class="label ">CPF:</div>
            <div id="cpf_aluno" class="input-line" contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Portador de necessidades especiais:</div>
            <div class="checkbox-row">
                <div class="checkbox-item"><div id="pne_sim" class="checkbox-box">( )</div> sim</div>
                <div class="checkbox-item"><div id="pne_nao" class="checkbox-box">( )</div> não</div>
            </div>
        </div>

        <div class="form-row">
            <div class="label">Serie:</div>
            <div id="serie" class="input-line " contenteditable="true"></div>
            <div class="label ">Turma:</div>
            <div id="turma" class="input-line" contenteditable="true"></div>
            <div class="label ">Período:</div>
            <div id="periodo" class="input-line " contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Unidade de Ensino:</div>
            <div id="unidade_ensino" class="input-line" contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Endereço:</div>
            <div id="endereco_residencial" class="input-line" contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label">Ponto de coleta:</div>
            <div id="ponto_coleta" class="input-line" contenteditable="true"></div>
        </div>

        <div class="form-row">
            <div class="label"><b>Sugestão de Rota:</b></div>
            <div id="sugestao_rota" class="input-line" contenteditable="true"></div>
        </div>

        <div class="info-text">
            Informamos que de acordo com a Lei nº 10.880/04, Institui o Programa Nacional de Apoio ao Transporte do Escolar – PNATE no Art. 2º Fica instituído o Programa Nacional de Apoio ao Transporte do Escolar – PNATE, no âmbito do MEC, a ser executado pelo Fundo Nacional de Desenvolvimento da Educação – FNDE, com o objetivo de oferecer transporte escolar aos alunos da educação básica pública, residentes em área rural, o transporte escolar é exclusivo para moradores da zona rural.
        </div>

        <div class="decreto-section">
            <span class="decreto-title">DECRETO Nº 1.604, DE 14 DE MAIO DE 2018</span>
            Art. 1º Este Decreto regulamenta o transporte escolar rural no âmbito do município de Palmas, destinado a alunos residentes na zona rural desta Capital, à distância superior a 1.500m (mil e quinhentos metros) da via principal, definida como rota central de embarque de passageiros, ou a 3.000m (três mil metros) da unidade educacional localizada na zona rural ou urbana, integrante da rede pública de ensino municipal, a que estiverem matriculados.
            <br>
            Parágrafo único. São considerados, para fins do disposto no caput deste artigo, também, como zona rural:
            <br>
            I - os povoados;
            <br>
            II - vilas;
            <br>
            III - assentamentos.
        </div>

        <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-label">Assinatura do solicitante</div>
        </div>
    </div>

    <div class="form-page" id="termo_ciencia">
        <div class="header">
            <div class="header-center">
                <img src="${imgLogo ? imgLogo.src : 'logo-semed.png'}" alt="Logo SEMED">
            </div>
        </div>
        <div class="sub-header">Gerência de Transporte Escolar</div>
        
        <div class="title ">TERMO DE CIÊNCIA</div>

        <div class="termo-body">
            Eu, <span id="termo_responsavel" class="termo-field " contenteditable="true"></span>, 
            responsável do(a) aluno(a) <span id="termo_aluno" class="termo-field " contenteditable="true"></span>, 
            matriculado na Unidade Educacional <span id="termo_unidade_ensino" class="termo-field " contenteditable="true"></span>
            manifesto ciência ao Decreto nº 1.604/2018, que traz as normativas sobre o transporte escolar rural na cidade de Palmas/TO, especialmente quanto aos seguintes aspectos previstos na norma citada:
        </div>

        <ul class="ordered-list">
            <li>É de responsabilidade da família o transporte do(a) aluno(a) da residência até a distância de 1.500 metros da via definida como rota central de embarque (artigo 2º, §2º);</li>
            <li>É obrigação do usuário comparecer no local determinado pela Secretaria Municipal da Educação, nos horários definidos, para o embarque e desembarque de passageiros (artigo 10, inciso IV);</li>
            <li>É de responsabilidade dos pais ou responsáveis acompanhar o estudante até o local de embarque do transporte escolar rural, bem com o aguardá-los no desembarque, sob pena de responsabilização por omissão (artigo 10, §1º).</li>
        </ul>

        <div class="date-line">
            Palmas, <span id="termo_dia" class="termo-field text-center" contenteditable="true"></span> de <span id="termo_mes" class="termo-field text-center" contenteditable="true"></span> de <span id="termo_ano" class="termo-field text-center" contenteditable="true"></span>.
        </div>

        <div class="signature-section ">
            <div class="signature-line"></div>
            <div class="signature-label">Responsável</div>
        </div>
    </div>

</div>

<script>
    window.onload = function() {
        if (typeof dadosFichaExtraidos !== 'undefined') {
            preencherFormulario(dadosFichaExtraidos);
        }
        configurarValidacao();
    };

    function extrairTelefone(texto, n = 1) {
        const regex = /\\(*\\d{2,}\\)*[\\s-]*\\d+[\\s-]*\\d+/g;
        const colecao = texto.match(regex);
        if (!colecao) return "";

        let contador = 0;
        let numeroFinal = "";

        for (const item of colecao) {
            let numeroTemp = item.replace(/[\\(\\)\\-\\s]/g, "");
            if (numeroTemp.length < 8) continue;

            contador++;
            if (contador === n) {
                if (numeroTemp.length === 8 && numeroTemp.startsWith("3")) continue;
                
                if (numeroTemp.length === 8 && !numeroTemp.startsWith("3")) {
                    numeroTemp = "639" + numeroTemp;
                } else if (numeroTemp.length === 9) {
                    numeroTemp = "63" + numeroTemp;
                }

                if (numeroTemp.length === 11) {
                    numeroFinal = numeroTemp;
                    break;
                }
            }
        }

        if (numeroFinal.length === 11) {
            return "(" + numeroFinal.substring(0, 2) + ") " + numeroFinal.substring(2, 3) + " " + numeroFinal.substring(3, 7) + "-" + numeroFinal.substring(7);
        }
        return "";
    }

    function limparEndereco(endereco) {
        if (!endereco) return "";
        let limpo = endereco.split(/CEP/i)[0]
            .replace(/(,\\s*)+/g, ', ')
            .replace(/\\s+/g, ' ')
            .trim()
            .replace(/,$/, '');
        return limpo;
    }

    function preencherFormulario(dados) {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        document.getElementById('data_solicitacao').innerText = dia + "/" + mes + "/" + ano;

        const contato = extrairTelefone(dados.observacoes || "");
        if (contato) document.getElementById('contato').innerText = contato;

        document.getElementById('aluno').innerText = dados.identificacao_do_aluno_nome || "";
        document.getElementById('data_nascimento_aluno').innerText = dados.identificacao_do_aluno_data_de_nascimento || "";
        document.getElementById('cpf_aluno').innerText = dados.identificacao_do_aluno_cpf || "";
        document.getElementById('termo_aluno').innerText = dados.identificacao_do_aluno_nome || "";

        if (dados.possui_condicoes_NEE === "SIM") {
            document.getElementById('pne_sim').innerText = "(X)";
            document.getElementById('pne_nao').innerText = "( )";
        } else {
            document.getElementById('pne_sim').innerText = "( )";
            document.getElementById('pne_nao').innerText = "(X)";
        }

        document.getElementById('serie').innerText = dados.serie || "";
        document.getElementById('turma').innerText = dados.turma || "";
        document.getElementById('unidade_ensino').innerText = dados.identificacao_da_escola_unidade_de_ensino || "";
        document.getElementById('termo_unidade_ensino').innerText = dados.identificacao_da_escola_unidade_de_ensino || "";
        
        if (dados.turma) {
            if (dados.turma.toUpperCase().endsWith("VESP")) {
                document.getElementById('periodo').innerText = "Vespertino";
            } else if (dados.turma.toUpperCase().endsWith("MAT")) {
                document.getElementById('periodo').innerText = "Matutino";
            }
        }

        document.getElementById('endereco_residencial').innerText = limparEndereco(dados.identificacao_do_aluno_endereco || "");

        document.getElementById('termo_dia').innerText = dia;
        const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        document.getElementById('termo_mes').innerText = meses[hoje.getMonth()];
        document.getElementById('termo_ano').innerText = ano;

        const f1 = (dados.filiacao1 || "").trim();
        const f2 = (dados.filiacao2 || "").trim();

        if (f1 && f2) {
            mostrarModalFiliacao(f1, dados.filiacao1_cpf, f2, dados.filiacao2_cpf);
        } else if (f1) {
            selecionarResponsavel(f1, dados.filiacao1_cpf);
        } else if (f2) {
            selecionarResponsavel(f2, dados.filiacao2_cpf);
        } else {
            solicitarRota();
        }
    }

    function mostrarModalFiliacao(n1, c1, n2, c2) {
        document.querySelector('#modal-filiacao h3').innerText = "Selecione o Responsável";
        const container = document.getElementById('opcoes-filiacao');
        container.innerHTML = '<button class="btn-filiacao" onclick="selecionarResponsavel(\\'' + n1 + '\\', \\'' + c1 + '\\')">1. ' + n1 + '</button>' +
                              '<button class="btn-filiacao" onclick="selecionarResponsavel(\\'' + n2 + '\\', \\'' + c2 + '\\')">2. ' + n2 + '</button>';
        document.getElementById('modal-filiacao').style.display = 'flex';
    }

    function selecionarResponsavel(nome, cpf) {
        document.getElementById('responsavel').innerText = nome;
        document.getElementById('cpf_responsavel').innerText = cpf;
        document.getElementById('termo_responsavel').innerText = nome;
        document.getElementById('modal-filiacao').style.display = 'none';
        solicitarRota();
    }

    function solicitarRota() {
        const modal = document.getElementById('modal-filiacao');
        const container = document.getElementById('opcoes-filiacao');
        const titulo = modal.querySelector('h3');
        
        titulo.innerText = "Selecione a Rota";
        container.innerHTML = '<button class="btn-filiacao" onclick="definirRota(\\'SONHO MEU\\')">SONHO MEU</button>' +
                              '<button class="btn-filiacao" onclick="definirRota(\\'FUMAÇA\\')">FUMAÇA</button>';
        modal.style.display = 'flex';
    }

    function definirRota(rota) {
        document.getElementById('sugestao_rota').innerText = rota;
        document.getElementById('modal-filiacao').style.display = 'none';
        document.querySelector('#modal-filiacao h3').innerText = "Selecione o Responsável";
        validarTodos();
    }

    function configurarValidacao() {
        const campos = document.querySelectorAll('.input-line, .termo-field');
        campos.forEach(campo => {
            campo.addEventListener('input', () => validarCampo(campo));
            campo.addEventListener('blur', () => validarCampo(campo));
            validarCampo(campo);
        });
    }

    function validarCampo(campo) {
        const valor = campo.innerText.trim();
        const placeholders = ["___/___/_____", "(___) ______________", "( )"];
        if (valor === "" || placeholders.includes(valor)) {
            campo.classList.add('campo-vazio');
        } else {
            campo.classList.remove('campo-vazio');
        }
    }

    function validarTodos() {
        const campos = document.querySelectorAll('.input-line, .termo-field');
        campos.forEach(validarCampo);
    }
</script>
</body>
</html>`;

    document.open();
    document.write(htmlContent);
    document.close();
}