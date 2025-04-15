var lastOption = null;

function menu() {
    // Verifica se a tabela com o id 'tblistmatriculatura' existe no DOM
    if (!document.getElementById('tblistmatriculaturma')) {
        console.log('A tabela com o id "tblistmatriculaturma" não foi encontrada no DOM.');
        return;
    }
    
    // Array de opções com funções associadas
    var options = [
        { name: 'relOrien', func: relOrien },
        { name: 'relParaProf', func: relParaProf },
        { name: 'relContMat', func: relContMat },
        { name: 'restAlim', func: restAlim }
    ];
    
    // Constroi a mensagem para exibição no prompt com as opções numeradas.
    var message = "Selecione a opção desejada:\n";
    options.forEach(function(option, index) {
        // Marca com (X) a última opção selecionada
        var marker = (lastOption === (index + 1)) ? " (X)" : "";
        message += (index + 1) + " - " + option.name + marker + "\n";
    });
    message += "\nDigite o número correspondente e confirme.\n" +
               "(Deixe em branco para executar a última opção selecionada)";
    
    // Solicita a entrada do usuário
    var userInput = prompt(message, "");
    
    // Se o usuário cancelar, não faz nada
    if (userInput === null) {
        console.log("Usuário cancelou a seleção.");
        return;
    }
    
    var selectedOption;
    if (userInput.trim() === "") {
        // Se o usuário confirmar sem digitar nada, verifica se há uma última opção armazenada
        if (lastOption !== null) {
            selectedOption = lastOption;
        } else {
            console.log("Nenhuma opção anterior selecionada. Nenhuma ação será executada.");
            return;
        }
    } else {
        selectedOption = parseInt(userInput, 10);
        // Verifica se o input é um número válido dentro do intervalo de opções
        if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > options.length) {
            console.log("Opção inválida. Nenhuma ação será executada.");
            return;
        }
    }
    
    // Atualiza a última opção selecionada e informa qual foi escolhida
    lastOption = selectedOption;
    console.log("Opção selecionada: " + lastOption);
    
    // Executa a função correspondente à opção selecionada
    options[selectedOption - 1].func();
}

main();

function restAlim() {
  // 1. Injetar CSS com toda a estilização necessária
  injectCSS(`
    /* Global */
    body { 
      text-transform: uppercase; 
      font-size: 14px;
    }
    
    /* Cabeçalho e Relatório */
    div div table,
    .text-right, 
    #tbcabecalho td:nth-child(4) {
      display: none;
    }
    
    /* Tabela relatório: Ocultar colunas */
    th,
    .table-relatorio.borda-table :is(th, td):nth-child(1),
    .table-relatorio.borda-table :is(th, td):nth-child(2),
    .table-relatorio.borda-table :is(th, td):nth-child(5) {
      display: none;
    }
    
    tr {
      border: 0;
    }
    
    td, th {
      border: 1px solid #ddd;
      padding: 1.5px 5px;
      font-size: 14px;
      width: max-content;
      height: 27px;
    }
    
    table {
      margin-bottom: 0;
    }
    
    /* Destaque nos nomes dos alunos */
    table.table-relatorio.borda-table td:nth-child(3) {
      font-size: 14px;
      width: max-content;
      height: 24px;
      font-weight: bold;
    }
    
    /* Estilização para o nome da turma */
    .nome-turma {
      font-size: 24px;
      font-weight: lighter;
      margin-bottom: 0;
    }
    
    /* Estilização para o número da sala */
    .numero-sala {
      background-color: yellow !important;
      padding: 3px 6px;
      border-radius: 5px;
      font-weight: bold;
      margin-right: 5px;
    }
    
    /* Estilização para o turno em relatórios */
    .global-header .global-turno  {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      background-color: yellow !important;
    }
    
    /* Global Header */
    .global-header {
      margin-bottom: 20px;
    }
    .global-header .header-line1 {
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }
    .global-header .header-line2 {
      text-align: center;
      margin-bottom: 20px;
    }
    /* Simplified Table (nome da turma) */
    .simplified-table {
      border: none;
      margin-bottom: 0;
    }
    .simplified-table td {
      border: none;
    }
    
    /* Report Table */
    .report-table {
      margin-bottom: 20px;
    }
  `);



  // 2. Processar cabeçalhos: identificar turno e formatar data
  const headerTables = document.querySelectorAll("#tbcabecalho");
  const turnoTexto = getTurnoText(headerTables);
  const dataFormatada = formatCurrentDate();

  // 3. Criar e inserir o cabeçalho global do documento
  const globalHeader = createGlobalHeader(turnoTexto, dataFormatada);
  document.body.insertBefore(globalHeader, document.body.firstChild);

  // 4. Para cada tabela de cabeçalho original, criar uma tabela simplificada e removê-la
  headerTables.forEach((headerTable, index) => {
    createSimplifiedTurmaTable(headerTable, index);
  });

  // 5. Processar as tabelas de relatório: filtrar linhas e ajustar cabeçalho
  const relatorioTables = document.querySelectorAll(".table-relatorio.borda-table");
  relatorioTables.forEach(table => {
    filterRelatorioTable(table);
  });
}

// Função para injetar CSS na página
function injectCSS(cssContent) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = cssContent;
  document.head.appendChild(style);
}

// Função para determinar o turno com base nos nomes das turmas
function getTurnoText(headerTables) {
  let hasMat = false, hasVesp = false;
  headerTables.forEach(table => {
    const rows = table.querySelectorAll("tr");
    if (rows.length > 1 && rows[1].cells.length >= 2) {
      const turmaNome = rows[1].cells[1].textContent.trim();
      if (turmaNome.endsWith("MAT")) hasMat = true;
      if (turmaNome.endsWith("VESP")) hasVesp = true;
    }
  });
  if (hasMat && hasVesp) return "MATUTINO / VESPERTINO";
  if (hasMat) return "MATUTINO";
  if (hasVesp) return "VESPERTINO";
  return "";
}

// Função para formatar a data atual no formato "DIA_DA_SEMANA, DD/MM/YYYY"
function formatCurrentDate() {
  const date = new Date();
  const diasSemana = [
    "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA",
    "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"
  ];
  const diaNome = diasSemana[date.getDay()];
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  return `${diaNome}, ${dia}/${mes}/${ano}`;
}

// Função para criar o cabeçalho global do documento
function createGlobalHeader(turnoTexto, dataFormatada) {
  const globalHeader = document.createElement("div");
  globalHeader.classList.add("global-header");

  const headerLine1 = document.createElement("div");
  headerLine1.classList.add("header-line1");
  headerLine1.textContent = `RESTRIÇÃO ALIMENTAR — ${dataFormatada}`;
  globalHeader.appendChild(headerLine1);

  const headerLine2 = document.createElement("div");
  headerLine2.classList.add("header-line2");
  const turnoLink = document.createElement("a");
  turnoLink.classList.add("global-turno");
  turnoLink.textContent = turnoTexto;
  headerLine2.appendChild(turnoLink);
  globalHeader.appendChild(headerLine2);

  return globalHeader;
}

// Função para criar e inserir uma tabela simplificada para a turma e remover o cabeçalho original
function createSimplifiedTurmaTable(headerTable, index) {
  const rows = headerTable.querySelectorAll("tr");
  if (rows.length < 2 || rows[1].cells.length < 2) return;
  const turmaNome = rows[1].cells[1].textContent.trim();

  const novaTabelaTurma = document.createElement("table");
  novaTabelaTurma.classList.add("simplified-table");

  const novaLinha = document.createElement("tr");
  const celulaTurma = document.createElement("td");
  celulaTurma.classList.add("nome-turma");

  const spanNumeroSala = document.createElement("span");
  spanNumeroSala.classList.add("numero-sala");
  spanNumeroSala.textContent = `SALA ${index + 1}:`;

  celulaTurma.appendChild(spanNumeroSala);
  celulaTurma.appendChild(document.createTextNode(` ${turmaNome}`));
  novaLinha.appendChild(celulaTurma);
  novaTabelaTurma.appendChild(novaLinha);

  // Procurar a tabela de relatório correspondente
  let reportTable = headerTable.nextElementSibling;
  while (
    reportTable &&
    (!reportTable.classList.contains("table-relatorio") ||
     !reportTable.classList.contains("borda-table"))
  ) {
    reportTable = reportTable.nextElementSibling;
  }
  if (reportTable) {
    reportTable.parentNode.insertBefore(novaTabelaTurma, reportTable);
  }
  headerTable.remove();
}

// Função para processar a tabela de relatório:
// - Remove linhas onde "Reação alérgica" (4ª coluna) é "NÃO"
// - Renomeia a coluna para "Restrição"
// - Adiciona classe para espaçamento
function filterRelatorioTable(table) {
  const tbody = table.querySelector("tbody");
  if (tbody) {
    Array.from(tbody.rows).forEach(row => {
      if (row.cells.length >= 4 && row.cells[3].textContent.trim() === "NÃO") {
        row.remove();
      }
    });
  }
  const thead = table.querySelector("thead");
  if (thead && thead.rows.length > 0 && thead.rows[0].cells.length >= 4) {
    thead.rows[0].cells[3].textContent = "Restrição";
  }
  table.classList.add("report-table");
}

function relContMat(){
    console.log('Relatório Controle de Matrículas');
    datarCabecalho();
    formatarTitulos(); // --- Formatar títulos de dados a cada elemento
    formatarCampos(); // Atribuindo formatações de dados a cada elemento
}

function relParaProf() {
    console.log('Relação para professores');
    unir_dados(true); // Passa true para permitir a remoção de números da obs
    datarCabecalho();
}

function relOrien() {
    datarCabecalho();
    console.log('Função relOrien executada.');
    unir_dados(false); // Passa false para evitar a remoção de números da obs
}

function datarCabecalho() {
    var cabecalhos = document.querySelectorAll("#tbcabecalho tr:nth-child(2) td:nth-child(4)");
    console.log(cabecalhos);
    const opcoes = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    var dataAtualExtenso = new Date().toLocaleDateString('pt-BR', opcoes);
    console.log(dataAtualExtenso);
    for (var i = 0; i < cabecalhos.length; i++) {
        cabecalhos[i].innerHTML = dataAtualExtenso;
        turma = cabecalhos[i].previousElementSibling.previousElementSibling;
        turma.innerHTML = turma.innerHTML = ' CMEI PEQUENOS BRILHANTES | ' + turma.innerText;
    }
}

function unir_dados(removerNumeros = true) {
  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  var elementosNome = document.querySelectorAll('td:nth-child(3)');

  elementosNome.forEach(element => {
    var obs = element.nextElementSibling;

    if (obs) {
      var novoElemento = document.createElement('span');
      novoElemento.className = 'observacoes-concatenadas';

      // Processar texto das observações
      var obsText = obs.innerText.replace(/\r?\n|\r/g, ' / ');

      if (removerNumeros) {
        obsText = obsText.replace(/(: *)*\(*\d+(\-\d+)*\)*/g, '');
      }

      obsText = escapeHtml(obsText);

      // Obter elementos seguintes
      var necEsp = obs.nextElementSibling;
      var restAlim = necEsp ? necEsp.nextElementSibling : null;
      var rota = restAlim ? restAlim.nextElementSibling : null;

      // Preparar destaques com classes CSS
      var highlights = [];

      // Necessidade especial (azul claro)
      if (necEsp && necEsp.innerText.trim() !== "") {
        var necEspText = " [NE: " + escapeHtml(necEsp.innerText.trim()) + "]";
        highlights.push('<span class="highlight-ne">' + necEspText + '</span>');
      }

      // Restrição alimentar (rosa claro)
      if (restAlim && restAlim.innerText.trim() !== "" && restAlim.innerText.trim() !== "NÃO") {
        var restAlimText = " [Rest. Alim.: " + escapeHtml(restAlim.innerText.trim()) + "]";
        highlights.unshift('<span class="highlight-ra">' + restAlimText + '</span>');
      }

      // Ônibus (verde claro)
      if (rota && rota.innerText.trim() !== "") {
        var rotaText = " [Ônibus: " + escapeHtml(rota.innerText.trim()) + "]";
        highlights.unshift('<span class="highlight-onibus">' + rotaText + '</span>');
      }

      // Construir conteúdo HTML
      var htmlContent = [];
      if (highlights.length > 0) {
        htmlContent.push(highlights.join(' '));
      }
      htmlContent.push(': ' + obsText);

      novoElemento.innerHTML = htmlContent.join(' ');

      // Inserir o novo elemento na célula
      element.appendChild(novoElemento);
    }
  });
}


function formatarTitulos() {
    var dicionarioTitulos = {
        "Idmatricula": "Mat.",
        "Data nascimento": "Dt Nasc.",
        "Data matrícula": "Dt Mat.",
        "ID Aluno MEC": "Código INEP",
    };

    titulos = document.querySelectorAll('table.table-relatorio.borda-table th');
    titulos.forEach(titulo => substituirPalavras(titulo, dicionarioTitulos));
}

// Função para substituir palavras
function substituirPalavras(elemento, dicionario) {
    var texto = elemento.innerHTML;

    // Percorre o dicionário e substitui as palavras
    var texto = elemento.innerHTML;

    for (var palavra in dicionario) {
        if (texto.indexOf(palavra) !== -1) {
            texto = texto.replace(palavra, dicionario[palavra]);
        }

        elemento.innerHTML = texto;
    }
}

function formatarCampos() {
    // Pegar todos os elementos do campo elementos Situação de Matrícula
    const elementosMatricula = document.querySelectorAll('td:nth-child(5)');

    // Percorrer em loop cada elemento do campo situação Matrícula
    elementosMatricula.forEach(element => {
        // pega o elemento nome do aluno
        var nomeAluno = element.previousElementSibling.previousElementSibling;

        // Verfifica se a sitação de matrícula do aluno é diferente de CURSANDO
        if (!((element.textContent == 'C') || (element.textContent == 'CURSANDO'))) {
            // atrubui a classe 'nc', um classe especial para o CSS reconhecer e destacar nome de alunos que estejam com elemento situação diferente de cursando
            nomeAluno.setAttribute('class', 'nc');

            // Coloca os dados da situação de matrícula após o nome do aluno e data de saída
            nomeAluno.innerText = nomeAluno.innerText + " - " + element.textContent
        }

        // Altera o formato da data de nascimento para que apareça apenas os dois últimos dígitos do ano
        dataNascimeto = element.nextElementSibling;
        dataNascimeto.innerText = dataNascimeto.textContent.slice(0, -4) + dataNascimeto.textContent.slice(-2);

        // Altera o formato da data de matrícula para que apareça apenas os dois últimos dígitos do ano
        dataMatricula = dataNascimeto.nextElementSibling.nextElementSibling;
        dataMatricula.innerText = dataMatricula.textContent.slice(0, -4) + dataMatricula.textContent.slice(-2);

        // verifica se a data de saída não está em branco
        dataSaida = dataMatricula.nextElementSibling;
        if (dataSaida.textContent.trim() !== "Não informado" && dataSaida.textContent.trim() !== "_") {
            // adiciona data de saída após o nome do aluno
            nomeAluno.innerText = nomeAluno.innerText + " [" + dataSaida.textContent.slice(0, 5) + "]"
        }

        var dicionario = {
            "TRANSFERIDO(A)": "TR.",
            "TRANSFERIDO DE TURMA": "TR. TURMA"
        };

        substituirPalavras(nomeAluno, dicionario);

    });
}
