// Ficha de matrícula - selecionarCopiarImprimir

function selecionarCopiarImprimir() {
  // Criar a caixa de diálogo sobreposta
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    min-width: 300px;
  `;

  dialog.innerHTML = `
    <h3>Selecionar, Copiar e Imprimir</h3>
    <p>Deseja selecionar tudo, copiar e imprimir?</p>
    <div style="margin-top: 20px;">
      <button id="simBtn" style="
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px;
        border-radius: 4px;
        cursor: pointer;
      ">Sim</button>
      <button id="naoBtn" style="
        background-color: #f44336;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px;
        border-radius: 4px;
        cursor: pointer;
      ">Não</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Função para remover a caixa de diálogo
  function removerDialog() {
    document.body.removeChild(overlay);
  }

  // Configurar botões
  document.getElementById('simBtn').addEventListener('click', function() {
    removerDialog();
    
    try {
      // 1. Selecionar tudo
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.body);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // 2. Copiar para a área de transferência
      document.execCommand('copy');
      
      // Desselecionar após um momento
      setTimeout(() => {
        window.getSelection().removeAllRanges();
      }, 100);
      
      atribuirIds();
      alterarFicha();
      document.body.classList.add('ficha-alterada');

      // 3. Imprimir
      // Imprimir após um momento
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro durante o processo. Verifique o console para detalhes.');
    }
  });

  document.getElementById('naoBtn').addEventListener('click', function() {
    removerDialog();
  });
}

// Para usar a função, basta chamar:

 selecionarCopiarImprimir();