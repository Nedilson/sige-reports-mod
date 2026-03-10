function atribuirIds() {
    /**
     * Função auxiliar para limpar e formatar strings para IDs
     */
    function sanitizar(texto) {
        return texto.toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/[^a-z0-9]/g, '_') // Caracteres especiais -> _
            .replace(/_+/g, '_') // Remove múltiplos underscores
            .replace(/^_|_$/g, ''); // Remove underscore no início ou fim
    }

    const boxes = document.querySelectorAll('.box');
    const dadosFicha = {}; // Objeto para armazenar os dados (apenas campos, não seções)
    const contagemBoxes = {};
    const todosIdsAtribuidos = []; // Array para listar todos os IDs atribuídos

    boxes.forEach(box => {
        // 1. Identificar o título da seção para definir o ID da BOX
        const titleDiv = box.querySelector('.div-title');
        const titleP = titleDiv ? titleDiv.querySelector('p') : null;

        let boxIdBase = '';
        if (titleP) {
            boxIdBase = sanitizar(titleP.innerText);
            // Mapeamento de IDs específicos conforme solicitação
            if (boxIdBase === 'deficiencia_transtornos_ou_disturbios') {
                boxIdBase = 'necessidades_educacionais_especiais';
            }
        } else {
            // Caso seja a última box (assinaturas), que não tem div-title
            boxIdBase = 'assinaturas';
        }

        if (!boxIdBase) return;

        // Atribuir ID à box principal (usando função de unicidade para evitar IDs duplicados no DOM)
        // OBS: Atribui o ID ao elemento DOM mas NAO adiciona ao objeto 'dadosFicha'
        const currentBoxId = atribuirIdUnico(box, boxIdBase, contagemBoxes);

        // 2. Taguear elementos internos (div-grid)
        const campos = box.querySelectorAll('.div-grid');
        const contagemInterna = {};
        let currentSubContext = '';
        let temSimSaude = false; // Controle para a seção de saúde

        campos.forEach(campo => {
            let labelText = '';
            let valorText = '';
            const spanBold = campo.querySelector('.text-bold');

            if (spanBold) {
                labelText = spanBold.innerText.replace(':', '').trim();
                valorText = campo.innerText.replace(spanBold.innerText, '').trim();
            } else {
                let partes = campo.innerText.split(':');
                labelText = (partes[0] || '').trim();
                partes.shift();
                valorText = partes.join(':').trim();
            }

            let labelId = sanitizar(labelText);
            if (!labelId || labelId.length < 2) return;

            // Mapeamento de IDs específicos conforme solicitação
            if (labelId === 'aluno_com_deficiencia') {
                labelId = 'possui_condicoes_NEE';
            }
            if (labelId === 'tipo_de_deficiencia') {
                labelId = 'condicoes_NEE';
            }

            let finalIdAtribuido = '';

            // Lógica para textos descritivos e uso de imagem
            if (labelId.includes('autorizo_uso_da_imagem')) {
                finalIdAtribuido = atribuirIdUnico(campo, 'uso_de_imagem', contagemInterna);
            } else if (boxIdBase === 'saude') {
                // Lógica específica para a caixa de Saúde
                if (labelText.match(/^\d+\s*-/)) {
                    // É a pergunta (ex: "1 - Já teve...")
                    const num = labelText.split('-')[0].trim();
                    finalIdAtribuido = `saude_pergunta_${num}`;
                    dadosFicha[finalIdAtribuido] = labelText;
                } else if (labelText === 'SIM' || labelText === 'NÃO' || labelText === '') {
                    // É a resposta
                    const num = (contagemInterna['saude_resposta'] || 0) + 1;
                    contagemInterna['saude_resposta'] = num;
                    finalIdAtribuido = `saude_resposta_${num}`;
                    // Pegar todo o texto do campo, já que 'valorText' pode não pegar tudo corretamente
                    valorText = campo.innerText.trim();

                    // Lógica para ocultar linhas com resposta NÃO e controlar visibilidade da seção
                    if (labelText === 'SIM') {
                        temSimSaude = true;
                    } else if (labelText === 'NÃO') {
                        const linha = campo.closest('.container-fluid');
                        if (linha) linha.style.display = 'none';
                    } else if (labelText === '') {
                        // Se estiver em branco, mantemos a visibilidade da seção para conferência
                        temSimSaude = true;
                    }
                } else {
                    // Permitir tags extensas na seção saude (IDs baseados no label sanitizado)
                    finalIdAtribuido = atribuirIdUnico(campo, `saude_${labelId}`, contagemInterna);
                    if (boxIdBase === 'saude') temSimSaude = true;
                }
            } else if (valorText === '' && labelText.length > 40) {
                // Textos descritivos longos sem valor preenchido
                finalIdAtribuido = atribuirIdUnico(campo, 'texto', contagemInterna);
            } else if (boxIdBase === 'filiacao') {
                // Lógica específica para FILIAÇÃO
                if (labelId === 'filiacao_1') {
                    currentSubContext = 'filiacao1';
                } else if (labelId === 'filiacao_2') {
                    currentSubContext = 'filiacao2';
                }

                // Se houver subcontexto (filiacao1 ou filiacao2), usa ele como prefixo direto
                if (currentSubContext) {
                    // Evita repetir "filiacao1_filiacao_1"
                    if (labelId === 'filiacao_1' || labelId === 'filiacao_2') {
                        campo.id = currentSubContext;
                        todosIdsAtribuidos.push(currentSubContext);
                        finalIdAtribuido = currentSubContext;
                    } else {
                        let finalId = `${currentSubContext}_${labelId}`;
                        finalIdAtribuido = atribuirIdUnico(campo, finalId, contagemInterna);
                    }
                }
            }

            // Regra geral para as demais boxes
            if (!finalIdAtribuido) {
                const secoesSemPrefixo = ['informacoes_academicas', 'necessidades_educacionais_especiais', 'outras_informacoes', 'transtorno_de_aprendizagem'];
                let finalId = secoesSemPrefixo.includes(boxIdBase) ? labelId : `${boxIdBase}_${labelId}`;
                finalIdAtribuido = atribuirIdUnico(campo, finalId, contagemInterna);
            }

            // Armazenar o valor no objeto JSON
            if (finalIdAtribuido) {
                // Se já não foi atribuído na lógica da saúde (que pega o labelText em vez do valorText)
                if (dadosFicha[finalIdAtribuido] === undefined) {
                    if (finalIdAtribuido.startsWith('texto') || (valorText === '' && labelText.length > 40)) {
                        dadosFicha[finalIdAtribuido] = labelText.trim();
                    } else if (boxIdBase === 'saude' && finalIdAtribuido.startsWith('saude_resposta')) {
                        dadosFicha[finalIdAtribuido] = valorText;
                    } else {
                        dadosFicha[finalIdAtribuido] = valorText;
                    }
                }
            }
        });

        // Se for a seção de saúde e não houver nenhuma resposta SIM (ou outro campo preenchido), oculta a seção inteira
        if (boxIdBase === 'saude' && !temSimSaude) {
            box.style.display = 'none';
        }
    });

    // 3. Capturar campos avulsos (fora das boxes), como 'Data de impressão'
    const paragrafos = document.querySelectorAll('p');
    paragrafos.forEach(p => {
        if (p.innerText.includes('Data de impressão:')) {
            const labelText = 'Data de impressão';
            const valorText = p.innerText.replace('Data de impressão:', '').trim();
            const labelId = sanitizar(labelText);

            p.id = labelId;
            todosIdsAtribuidos.push(labelId);
            dadosFicha[labelId] = valorText;
        }
    });

    /**
     * Garante que o ID seja único adicionando sufixo se necessário
     * Retorna o ID final atribuído.
     */
    function atribuirIdUnico(elemento, idBase, contador) {
        let idFinal = idBase;
        if (contador[idBase] === undefined) {
            contador[idBase] = 0;
            elemento.id = idBase;
        } else {
            contador[idBase]++;
            idFinal = `${idBase}_${contador[idBase]}`;
            elemento.id = idFinal;
        }
        todosIdsAtribuidos.push(idFinal);
        return idFinal;
    }

    // Armazena os dados em uma variável global para acesso posterior
    window.dadosFichaExtraidos = dadosFicha;

    /**
     * Função para baixar o JSON armazenado
     */
    window.baixarFichaJSON = function () {
        const dados = window.dadosFichaExtraidos;
        if (!dados) {
            console.error("Nenhum dado encontrado para baixar.");
            return;
        }

        let nomeAluno = dados['identificacao_do_aluno_nome'] || 'ALUNO_NAO_IDENTIFICADO';
        nomeAluno = nomeAluno.replace(/[<>:"/\\|?*]+/g, '').trim(); // Remove caracteres de arquivo inválidos no Windows

        const nomeArquivo = `${nomeAluno} - Ficha de matrícula.json`;
        const jsonString = JSON.stringify(dados, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`Download concluído: ${nomeArquivo}`);
    };

    const ids_padrao = [
        "identificacao_da_escola",
        "identificacao_da_escola_unidade_de_ensino",
        "identificacao_da_escola_id_inep_censo",
        "identificacao_da_escola_endereco",
        "identificacao_da_escola_telefone",
        "identificacao_da_escola_email",
        "identificacao_do_aluno",
        "identificacao_do_aluno_nome",
        "identificacao_do_aluno_id_matricula",
        "identificacao_do_aluno_id_censo",
        "identificacao_do_aluno_nome_social",
        "identificacao_do_aluno_data_de_nascimento",
        "identificacao_do_aluno_sexo",
        "identificacao_do_aluno_naturalidade",
        "identificacao_do_aluno_certidao_de_nascimento",
        "identificacao_do_aluno_cor_raca",
        "identificacao_do_aluno_cpf",
        "identificacao_do_aluno_rg",
        "identificacao_do_aluno_orgao_exp",
        "identificacao_do_aluno_nacionalidade",
        "identificacao_do_aluno_nis",
        "identificacao_do_aluno_n_sus",
        "identificacao_do_aluno_tipo_sanguineo",
        "identificacao_do_aluno_endereco",
        "filiacao",
        "filiacao1",
        "filiacao1_sexo",
        "filiacao1_data_de_nascimento",
        "filiacao1_telefone",
        "filiacao1_email",
        "filiacao1_profissao",
        "filiacao1_cpf",
        "filiacao1_rg",
        "filiacao1_endereco",
        "filiacao2",
        "filiacao2_sexo",
        "filiacao2_data_de_nascimento",
        "filiacao2_telefone",
        "filiacao2_email",
        "filiacao2_profissao",
        "filiacao2_cpf",
        "filiacao2_rg",
        "filiacao2_endereco",
        "contatos",
        "contatos_telefone1",
        "contatos_telefone2",
        "contatos_telefone3",
        "contatos_email",
        "informacoes_academicas",
        "modalidade_de_ensino",
        "data_matricula",
        "data_enturmacao",
        "turma",
        "serie",
        "ano",
        "necessidades_educacionais_especiais",
        "possui_condicoes_NEE",
        "condicoes_NEE",
        "recursos_utilizados_em_sala_de_aula",
        "atendimento_educacional_utilizado",
        "transtorno_de_aprendizagem",
        "aluno_com_transtorno_que_impactam_na_aprendizagem",
        "tipo_s_de_transtorno_s",
        "outras_informacoes",
        "uso_de_imagem",
        "utiliza_transporte_escolar",
        "participa_do_s_programa_s_social_is",
        "texto",
        "observacoes",
        "assinaturas",
        "data_de_impressao"
    ];

    const ids_ocasionais = [
        "saude",
        "texto"
    ]; // Lista de IDs base que não devem emitir alerta de faltante ou extra

    function isOcasional(id) {
        return ids_ocasionais.some(ocasional => id === ocasional);
    }

    // Verificação de conformidade com os IDs padrão
    const faltantes = ids_padrao.filter(id => !todosIdsAtribuidos.includes(id) && !isOcasional(id));
    const extras = todosIdsAtribuidos.filter(id => !ids_padrao.includes(id) && !isOcasional(id));

    if (faltantes.length > 0 || extras.length > 0) {
        let mensagem = "Divergência nos IDs encontrados:\n";
        if (faltantes.length > 0) mensagem += `\n❌ IDs faltantes (referência padrão que não foram encontrados na página):\n- ${faltantes.join("\n- ")}\n`;
        if (extras.length > 0) mensagem += `\n⚠️ IDs extras (encontrados na página mas não estão na referência padrão):\n- ${extras.join("\n- ")}\n`;

        console.warn(mensagem); // Gera o alerta no console
        alert(mensagem);
    }

    console.log("Dados extraídos e armazenados em 'window.dadosFichaExtraidos'.");
    console.log("Lista de todos os IDs atribuídos:", todosIdsAtribuidos);
    console.log("Para baixar o arquivo JSON, chame a função: baixarFichaJSON()");
}   
