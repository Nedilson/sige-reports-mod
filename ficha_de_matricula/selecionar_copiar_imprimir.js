// Ficha de matrícula - selecionarCopiarImprimir

function selecionarCopiarImprimir() {
  // Injeta estilos CSS para animações e design moderno
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sigeFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes sigeScaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    .sige-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .sige-dialog {
        background: white;
        padding: 32px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        text-align: center;
        max-width: 450px;
        width: 90%;
        animation: sigeScaleIn 0.3s ease-out;
    }
    .sige-success-card {
        background: #10b981;
        color: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
        text-align: center;
        max-width: 500px;
        width: 90%;
        animation: sigeScaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .sige-btn {
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .sige-btn-primary { background: #3b82f6; color: white; }
    .sige-btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
    .sige-btn-success { background: #10b981; color: white; }
    .sige-btn-success:hover { background: #059669; transform: translateY(-1px); }
    .sige-btn-danger { background: #ef4444; color: white; }
    .sige-btn-danger:hover { background: #dc2626; transform: translateY(-1px); }
    .sige-btn:active { transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'sige-overlay';
  overlay.id = 'over-selecionar-copiar';

  overlay.innerHTML = `
    <div class="sige-dialog">
        <div style="margin-bottom: 20px;">
            <svg style="width: 48px; height: 48px; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
        </div>
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px;">Ficha de Matrícula</h3>
        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 1.5;">Deseja selecionar tudo, copiar os dados e imprimir a ficha?</p>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button id="simTransporteBtn" class="sige-btn sige-btn-primary">SIM E DEPOIS SOLICITAR TRANSPORTE</button>
            <div style="display: flex; gap: 12px;">
                <button id="simBtn" class="sige-btn sige-btn-success" style="flex: 1;">SIM</button>
                <button id="naoBtn" class="sige-btn sige-btn-danger" style="flex: 1;">NÃO</button>
            </div>
        </div>
    </div>
  `;

  document.body.appendChild(overlay);

  function removerElemento(el) {
    if (el && el.parentNode === document.body) {
        document.body.removeChild(el);
    } else if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
  }

  function removerDialog() {
    const el = document.getElementById('over-selecionar-copiar');
    removerElemento(el);
  }

  function mostrarMensagemSucesso(callback) {
    const msgOverlay = document.createElement('div');
    msgOverlay.className = 'sige-overlay';
    
    msgOverlay.innerHTML = `
        <div class="sige-success-card">
            <div style="margin-bottom: 20px;">
                <svg style="width: 64px; height: 64px; margin: 0 auto; display: block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">FICHA COPIADA!</h2>
            <div style="font-size: 16px; line-height: 1.6; opacity: 0.9;">
                <p style="margin-bottom: 12px;">Na guia de matrícula, aperte o botão <strong>AVANÇAR</strong>.</p>
                <p>Depois retorne a esta para imprimir a ficha.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(msgOverlay);
    
    setTimeout(() => {
        removerElemento(msgOverlay);
        if (callback) callback();
    }, 10000);
  }

  function processarImpressao(solicitarTransporte = false) {
    removerDialog();
    
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.body);
      selection.removeAllRanges();
      selection.addRange(range);
      
      document.execCommand('copy');
      
      setTimeout(() => {
        window.getSelection().removeAllRanges();
      }, 100);
      
      if (typeof atribuirIds === 'function') atribuirIds();
      if (typeof alterarFicha === 'function') alterarFicha();
      document.body.classList.add('ficha-alterada');

      mostrarMensagemSucesso(() => {
          if (solicitarTransporte) {
              const posPrint = () => {
                  window.removeEventListener('afterprint', posPrint);
                  if (confirm('GERAR SOLICITAÇÃO DE TRANSPORTE?')) {
                      gerarFormularioTransporteEscolar();
                  }
              };
              window.addEventListener('afterprint', posPrint);
          }
          window.print();
      });

    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro durante o processo.');
    }
  }

  document.getElementById('simBtn').addEventListener('click', () => processarImpressao(false));
  document.getElementById('simTransporteBtn').addEventListener('click', () => processarImpressao(true));
  document.getElementById('naoBtn').addEventListener('click', removerDialog);
}

// Inicialização
selecionarCopiarImprimir();
