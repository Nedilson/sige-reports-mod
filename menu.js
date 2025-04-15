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
        message += marker + (index + 1) + " - " + option.name + "\n";
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
