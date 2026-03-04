(function() {
    /**
     * Auxiliar para criar colunas Bootstrap
     */
    function criarColuna(colSize, content, id) {
        const col = document.createElement('div');
        col.className = `col-sm-${colSize} col-xs-${colSize} col-md-${colSize} div-grid`;
        if (id) col.id = id;
        if (typeof content === 'string') {
            col.innerHTML = content;
        } else if (content instanceof Element) {
            col.appendChild(content);
        }
        return col;
    }

    /**
     * Auxiliar para criar rows Bootstrap
     */
    function criarRow(container) {
        const row = document.createElement('div');
        row.className = 'row';
        if (container) container.appendChild(row);
        return row;
    }

    function executarTransformacoes() {
        console.log('Iniciando transformações da ficha...');

        // Capturar turno ANTES de qualquer transformação (pois os IDs podem sumir)
        const turmaOriginal = document.getElementById('turma');
        const turmaTextoGlobal = turmaOriginal ? turmaOriginal.innerText.toUpperCase().trim() : '';
        const globalEhMat = turmaTextoGlobal.endsWith('MAT');
        const globalEhVesp = turmaTextoGlobal.endsWith('VESP');

        // Criar o wrapper principal de 19cm se não existir
        let wrapper = document.getElementById('wrapper-ficha-a4');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'wrapper-ficha-a4';
            
            // Captura todos os elementos que devem ser movidos (tudo exceto scripts e o próprio wrapper)
            const nodesToMove = Array.from(document.body.childNodes).filter(node => 
                node.tagName !== 'SCRIPT' && node.id !== 'wrapper-ficha-a4'
            );
            
            nodesToMove.forEach(node => wrapper.appendChild(node));
            document.body.prepend(wrapper);
        }

        // 1. CAPTURAR LOGO E REMOVER CABEÇALHO ORIGINAL
        const imgLogo = document.querySelector('.table-relatorio img');
        let logoClone = null;
        if (imgLogo) {
            logoClone = imgLogo.cloneNode(true);
            logoClone.className = 'logo-ficha';
        }

        const headerOriginal = document.querySelector('.table-relatorio');
        if (headerOriginal) {
            const containerPai = headerOriginal.closest('div');
            if (containerPai) containerPai.remove();
        }

        // 2. CRIAR CABEÇALHO COM LOGO + TÍTULO
        if (!document.querySelector('.header-principal-ficha')) {
            const headerFicha = document.createElement('div');
            headerFicha.className = 'header-principal-ficha';
            
            if (logoClone) {
                const divLogo = document.createElement('div');
                divLogo.className = 'logo-container-topo';
                divLogo.appendChild(logoClone);
                headerFicha.appendChild(divLogo);
            }

            const tituloTopo = document.createElement('h1');
            tituloTopo.innerText = 'FICHA DE MATRÍCULA';
            tituloTopo.className = 'titulo-ficha-destaque';
            headerFicha.appendChild(tituloTopo);
            
            wrapper.prepend(headerFicha);
        }

        // 3. IDENTIFICAÇÃO DA ESCOLA
        const boxEscola = document.querySelector('#identificacao_da_escola');
        if (boxEscola) {
            const unidade = document.getElementById('identificacao_da_escola_unidade_de_ensino');
            const inep = document.getElementById('identificacao_da_escola_id_inep_censo');
            const tel = document.getElementById('identificacao_da_escola_telefone');
            const email = document.getElementById('identificacao_da_escola_email');
            const end = document.getElementById('identificacao_da_escola_endereco');

            const mainContainer = document.createElement('div');
            mainContainer.className = 'container-fluid';
            
            // Agora a escola ocupa toda a largura (sem a logo nela)
            // Linha 1: Unidade de Ensino, INEP, Telefone, Email
            const r1 = criarRow(mainContainer);
            if (unidade) {
                unidade.classList.add('font-destaque-escola');
                r1.appendChild(criarColuna(5, unidade.innerHTML, unidade.id));
            }
            if (inep) r1.appendChild(criarColuna(2, inep.innerHTML, inep.id));
            if (tel) r1.appendChild(criarColuna(2, tel.innerHTML, tel.id));
            if (email) r1.appendChild(criarColuna(3, email.innerHTML, email.id));

            // Linha 2: Endereço
            if (end) {
                const r2 = criarRow(mainContainer);
                r2.appendChild(criarColuna(12, end.innerHTML, end.id));
            }

            const title = boxEscola.querySelector('.div-title');
            boxEscola.innerHTML = '';
            if (title) boxEscola.appendChild(title);
            boxEscola.appendChild(mainContainer);
        }

        // 2. IDENTIFICAÇÃO DO ALUNO (FOTO À ESQUERDA)
        const boxAluno = document.querySelector('#identificacao_do_aluno');
        if (boxAluno) {
            const divFoto = boxAluno.querySelector('.text-center[style*="height: 125px"]');
            const campos = {
                nome: document.getElementById('identificacao_do_aluno_nome'),
                nasc: document.getElementById('identificacao_do_aluno_data_de_nascimento'),
                mat: document.getElementById('identificacao_do_aluno_id_matricula'),
                censo: document.getElementById('identificacao_do_aluno_id_censo'),
                sexo: document.getElementById('identificacao_do_aluno_sexo'),
                end: document.getElementById('identificacao_do_aluno_endereco'),
                cert: document.getElementById('identificacao_do_aluno_certidao_de_nascimento'),
                cpf: document.getElementById('identificacao_do_aluno_cpf'),
                raca: document.getElementById('identificacao_do_aluno_cor_raca'),
                nat: document.getElementById('identificacao_do_aluno_naturalidade'),
                f1: document.getElementById('filiacao1'),
                f2: document.getElementById('filiacao2'),
                f1_cpf: document.getElementById('filiacao1_cpf'),
                f2_cpf: document.getElementById('filiacao2_cpf')
            };

            const novoContainer = document.createElement('div');
            novoContainer.className = 'container-fluid';
            
            const mainRow = criarRow(novoContainer);
            
            // Foto
            const colEsq = document.createElement('div');
            colEsq.className = 'col-sm-2 col-xs-2 col-md-2 div-grid';
            if (divFoto) {
                // CRIAR DIV PARA ENVOLVER A FOTO (Substituindo o TD original)
                const holderFoto = document.createElement('div');
                holderFoto.style.display = 'flex';
                holderFoto.style.justifyContent = 'center';
                holderFoto.appendChild(divFoto);
                colEsq.appendChild(holderFoto);
            }
            mainRow.appendChild(colEsq);

            // Campos (Container que contém a grid interna)
            const colDir = document.createElement('div');
            colDir.className = 'col-sm-10 col-xs-10 col-md-10 container-campos-aluno';
            mainRow.appendChild(colDir);

            // Linha 1: Nome
            const r1 = criarRow(colDir);
            if (campos.nome) {
                const colNome = criarColuna(12, campos.nome.innerHTML, campos.nome.id);
                colNome.classList.add('font-destaque-aluno');
                r1.appendChild(colNome);
            }

            // Linha 2: Nasc, Naturalidade, Sexo, Cor/Raça
            const r2 = criarRow(colDir);
            if (campos.nasc) r2.appendChild(criarColuna(3, campos.nasc.innerHTML, campos.nasc.id));
            if (campos.nat) r2.appendChild(criarColuna(3, campos.nat.innerHTML, campos.nat.id));
            if (campos.sexo) r2.appendChild(criarColuna(3, campos.sexo.innerHTML, campos.sexo.id));
            if (campos.raca) r2.appendChild(criarColuna(3, campos.raca.innerHTML, campos.raca.id));

            // Linha 3: CPF, Certidão, Matrícula e Censo
            const r3 = criarRow(colDir);
            if (campos.cpf) {
                const colCpf = criarColuna(2, campos.cpf.innerHTML, campos.cpf.id);
                colCpf.classList.add('col-destaque-cpf');
                r3.appendChild(colCpf);
            }
            if (campos.cert) r3.appendChild(criarColuna(4, campos.cert.innerHTML, campos.cert.id));
            if (campos.mat) r3.appendChild(criarColuna(2, campos.mat.innerHTML, campos.mat.id));
            if (campos.censo) r3.appendChild(criarColuna(4, campos.censo.innerHTML, campos.censo.id));

            // Linha 4: Filiação 1
            const r4 = criarRow(colDir);
            if (campos.f1) r4.appendChild(criarColuna(8, campos.f1.innerHTML, campos.f1.id));
            if (campos.f1_cpf) r4.appendChild(criarColuna(4, campos.f1_cpf.innerHTML, campos.f1_cpf.id));

            // Linha 5: Filiação 2
            const r5 = criarRow(colDir);
            if (campos.f2) r5.appendChild(criarColuna(8, campos.f2.innerHTML, campos.f2.id));
            if (campos.f2_cpf) r5.appendChild(criarColuna(4, campos.f2_cpf.innerHTML, campos.f2_cpf.id));

            // Linha Fora da grid interna: Endereço
            if (campos.end) {
                const rEnd = criarRow(novoContainer);
                rEnd.appendChild(criarColuna(12, campos.end.innerHTML, campos.end.id));
            }

            const title = boxAluno.querySelector('.div-title');
            boxAluno.innerHTML = '';
            if (title) boxAluno.appendChild(title);
            boxAluno.appendChild(novoContainer);


        }

        // 3. FILIAÇÃO
        const boxFiliacao = document.querySelector('#filiacao');
        if (boxFiliacao) {
            const f1 = document.getElementById('filiacao1');
            const f2 = document.getElementById('filiacao2');
            const f1_cpf = document.getElementById('filiacao1_cpf');
            const f2_cpf = document.getElementById('filiacao2_cpf');
            
            const novoContainer = document.createElement('div');
            novoContainer.className = 'container-fluid';
            
            const r1 = criarRow(novoContainer);
            if (f1) r1.appendChild(criarColuna(6, f1.innerHTML));
            if (f2) r1.appendChild(criarColuna(6, f2.innerHTML));

            const r2 = criarRow(novoContainer);
            if (f1_cpf) r2.appendChild(criarColuna(6, f1_cpf.innerHTML));
            if (f2_cpf) r2.appendChild(criarColuna(6, f2_cpf.innerHTML));

            const title = boxFiliacao.querySelector('.div-title');
            boxFiliacao.innerHTML = '';
            if (title) boxFiliacao.appendChild(title);
            boxFiliacao.appendChild(novoContainer);
        }

        // 4. INFORMAÇÕES ACADÊMICAS
        const boxAcad = document.querySelector('#informacoes_academicas');
        if (boxAcad) {
            const modalidade = document.getElementById('modalidade_de_ensino');
            const dtMat = document.getElementById('data_matricula');
            const dtEnt = document.getElementById('data_enturmacao');
            const turma = document.getElementById('turma');
            const serie = document.getElementById('serie');
            const ano = document.getElementById('ano');

            const novoContainer = document.createElement('div');
            novoContainer.className = 'container-fluid';
            
            const row = criarRow(novoContainer);
            if (modalidade) row.appendChild(criarColuna(4, modalidade.innerHTML));
            if (dtMat) row.appendChild(criarColuna(2, dtMat.innerHTML));
            if (dtEnt) row.appendChild(criarColuna(2, dtEnt.innerHTML));
            if (turma) row.appendChild(criarColuna(2, turma.innerHTML)); // Destaque removido conforme CSS
            if (serie) row.appendChild(criarColuna(1, serie.innerHTML));
            if (ano) row.appendChild(criarColuna(1, ano.innerHTML));

            const title = boxAcad.querySelector('.div-title');
            boxAcad.innerHTML = '';
            if (title) boxAcad.appendChild(title);
            boxAcad.appendChild(novoContainer);
        }

        // 5a. NECESSIDADES EDUCACIONAIS ESPECIAIS
        const boxNEE = document.querySelector('#necessidades_educacionais_especiais');
        if (boxNEE) {
            // Título da seção
            const titleP = boxNEE.querySelector('.div-title p');
            if (titleP) titleP.innerText = 'Necessidades educacionais especiais';

            // Campo: Condições
            const condicoes = document.getElementById('condicoes_de_necessidades_educacionais_especiais');
            if (condicoes) {
                const labelNEE = condicoes.querySelector('.text-bold');
                if (labelNEE) labelNEE.innerText = 'Condições de Necessidades Educacionais Especiais:';
                
                const valorNEE = condicoes.innerText.replace(labelNEE.innerText, '').trim().toUpperCase();
                
                // Só deve aparecer se preenchido com SIM
                if (!valorNEE.includes('SIM')) {
                    boxNEE.style.display = 'none';
                }
            }
        }

        // 5. OUTRAS INFORMAÇÕES
        const boxOutros = document.querySelector('#outras_informacoes');
        // Capturar obs ANTES de limpar o boxOutros (innerHTML='' destrói o elemento do DOM)
        const obsEl = document.getElementById('observacoes');
        const obsInnerHTML = obsEl ? obsEl.innerHTML : null;
        const obsId = obsEl ? obsEl.id : null;

        if (boxOutros) {
            const imagem = document.getElementById('uso_de_imagem');
            const transporte = document.getElementById('utiliza_transporte_escolar');
            const social = document.getElementById('participa_do_s_programa_s_social_is');
            const aviso = document.getElementById('a_efetivacao_da_matricula_no_periodo_letivo_seguinte_somente_sera_efetivada_apos_o_resultado_final_e_termino_do_periodo_letivo_corrente');

            const novoContainer = document.createElement('div');
            novoContainer.className = 'container-fluid';

            if (imagem) criarRow(novoContainer).appendChild(criarColuna(12, imagem.innerHTML, imagem.id));
            if (transporte) criarRow(novoContainer).appendChild(criarColuna(12, transporte.innerHTML, transporte.id));
            if (social) criarRow(novoContainer).appendChild(criarColuna(12, social.innerHTML, social.id));
            if (aviso) criarRow(novoContainer).appendChild(criarColuna(12, aviso.innerHTML, aviso.id));

            const title = boxOutros.querySelector('.div-title');
            boxOutros.innerHTML = '';
            if (title) boxOutros.appendChild(title);
            boxOutros.appendChild(novoContainer);
        }

        // 5b. OBSERVAÇÕES (seção independente)
        if (obsInnerHTML !== null) {
            // Criar box de observações
            const boxObs = document.createElement('div');
            boxObs.className = 'box';
            boxObs.id = 'secao_observacoes';

            // Título da seção
            const titleObs = document.createElement('div');
            titleObs.className = 'div-title';
            titleObs.style.marginTop = '4px';
            titleObs.innerHTML = '<p class="text-bold">OBSERVAÇÕES: Responsáveis | Contatos | Autorizações</p>';
            boxObs.appendChild(titleObs);

            // Container com o campo observações
            const containerObs = document.createElement('div');
            containerObs.className = 'container-fluid';

            // Horários de aula
            const checkMat = globalEhMat ? '[X]' : '[&nbsp;&nbsp;]';
            const checkVesp = globalEhVesp ? '[X]' : '[&nbsp;&nbsp;]';
            
            const htmlHorarios = `
                <span class="text-bold">Horários de aula (Entrada/Saída):</span>
                <span style="${globalEhMat ? 'font-weight: bold;' : ''}">${checkMat} Matutino: das 07:30 às 11:30</span>
                <span style="${globalEhVesp ? 'font-weight: bold;' : ''}">${checkVesp} Vespertino: das 13:30 às 17:30</span>
            `;
            
            // Tentar capturar o TEXTO das observações de forma limpa
            let textoPuroObs = '';
            if (obsEl) {
                const spanLabel = obsEl.querySelector('span');
                if (spanLabel) {
                    textoPuroObs = obsEl.innerText.replace(spanLabel.innerText, '').trim();
                } else {
                    textoPuroObs = obsEl.innerText.trim();
                }
            }
            
            // Processar para substituir / por quebra de linha
            const obsConteudo = textoPuroObs ? textoPuroObs.replace(/\s*\/\s*/g, '<br>') : '';

            // Adicionar campos ao container na MESMA LINHA (Horários primeiro, depois Observações)
            const rowPrincipal = criarRow(containerObs);
            rowPrincipal.appendChild(criarColuna(12, htmlHorarios, 'horarios'));
            
            if (obsConteudo) {
                // Adicionamos o rótulo manualmente para evitar o conflito do CSS que esconde o span original
                const htmlFinalObs = `<span class="text-bold">Observações:</span>${obsConteudo}`;
                rowPrincipal.appendChild(criarColuna(12, htmlFinalObs, obsId));
            }

            boxObs.appendChild(containerObs);

            // Inserir a nova seção logo após o boxOutros
            if (boxOutros && boxOutros.parentNode) {
                boxOutros.parentNode.insertBefore(boxObs, boxOutros.nextSibling);
            } else {
                wrapper.appendChild(boxObs);
            }
        }

        // 6. Negrito em Condições de NEE e SIM
        const deficiencia = document.getElementById('condicoes_de_necessidades_educacionais_especiais');
        if (deficiencia) {
            const texto = deficiencia.innerText.toUpperCase();
            if (texto.includes('SIM')) {
                deficiencia.style.fontWeight = 'bold';
                deficiencia.style.backgroundColor = '#fff3cd'; 
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(executarTransformacoes, 100));
    } else {
        setTimeout(executarTransformacoes, 100);
    }

})();

// Polyfills
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}


