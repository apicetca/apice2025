// ========== ENTREVISTA ONLINE - FUNCIONALIDADES ========== 

document.addEventListener('DOMContentLoaded', function() {
    // Elementos dos controles de vídeo
    const cameraBtn = document.querySelector('.camera-btn');
    const micBtn = document.querySelector('.mic-btn');
    const screenBtn = document.querySelector('.screen-btn');
    const settingsBtn = document.querySelector('.settings-btn');
    
    // Botões de ação
    const joinBtn = document.getElementById('joinInterview');
    const testBtn = document.getElementById('testEquipment');
    
    // Configurações
    const defaultCameraCheckbox = document.getElementById('defaultCamera');
    const defaultMicCheckbox = document.getElementById('defaultMic');
    const recordCheckbox = document.getElementById('recordInterview');

    // Estado dos controles
    let cameraActive = true;
    let micActive = true;
    let screenSharing = false;

    // ========== CONTROLES DE VÍDEO ========== 
    
    function toggleCamera() {
        cameraActive = !cameraActive;
        cameraBtn.classList.toggle('active', cameraActive);
        
        // Feedback visual
        const participantInfo = document.querySelector('.participant-info');
        if (cameraActive) {
            participantInfo.querySelector('.participant-name').textContent = 'Câmera ligada - Pronto para entrevista';
        } else {
            participantInfo.querySelector('.participant-name').textContent = 'Câmera desligada';
        }
        
        console.log('Câmera:', cameraActive ? 'Ligada' : 'Desligada');
    }

    function toggleMic() {
        micActive = !micActive;
        micBtn.classList.toggle('active', micActive);
        
        console.log('Microfone:', micActive ? 'Ligado' : 'Desligado');
    }

    function toggleScreenShare() {
        screenSharing = !screenSharing;
        screenBtn.classList.toggle('active', screenSharing);
        
        if (screenSharing) {
            // Simular compartilhamento de tela
            console.log('Compartilhamento de tela iniciado');
        } else {
            console.log('Compartilhamento de tela parado');
        }
    }

    function openSettings() {
        // Simular abertura de configurações
        alert('Configurações de áudio e vídeo seriam abertas aqui');
    }

    // ========== EVENT LISTENERS DOS CONTROLES ========== 
    
    if (cameraBtn) {
        cameraBtn.addEventListener('click', toggleCamera);
    }

    if (micBtn) {
        micBtn.addEventListener('click', toggleMic);
    }

    if (screenBtn) {
        screenBtn.addEventListener('click', toggleScreenShare);
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }

    // ========== BOTÕES DE AÇÃO ========== 

    function joinInterview() {
        // Verificar se equipamentos estão prontos
        if (!cameraActive && !micActive) {
            if (confirm('Câmera e microfone estão desligados. Deseja continuar mesmo assim?')) {
                startInterview();
            }
        } else {
            startInterview();
        }
    }

    function startInterview() {
        // Simular início da entrevista
        console.log('Iniciando entrevista...');
        
        // Atualizar interface
        const participantInfo = document.querySelector('.participant-info');
        participantInfo.querySelector('.participant-name').textContent = 'Conectando com o entrevistador...';
        
        // Simular conexão após 2 segundos
        setTimeout(() => {
            participantInfo.querySelector('.participant-name').textContent = 'Entrevista em andamento';
            
            // Atualizar status do participante
            const entrevistadorStatus = document.querySelector('.participant-item:nth-child(2) .participant-status');
            if (entrevistadorStatus) {
                entrevistadorStatus.textContent = 'Conectado';
                entrevistadorStatus.className = 'participant-status ready';
            }
        }, 2000);
    }

    function testEquipment() {
        console.log('Testando equipamentos...');
        
        // Simular teste de equipamentos
        const originalText = testBtn.textContent;
        testBtn.disabled = true;
        testBtn.textContent = 'Testando...';
        
        setTimeout(() => {
            testBtn.disabled = false;
            testBtn.textContent = originalText;
            alert('Teste concluído!\n\n✅ Câmera: Funcionando\n✅ Microfone: Funcionando\n✅ Conexão: Estável');
        }, 3000);
    }

    // Event listeners dos botões de ação
    if (joinBtn) {
        joinBtn.addEventListener('click', joinInterview);
    }

    if (testBtn) {
        testBtn.addEventListener('click', testEquipment);
    }

    // ========== CONFIGURAÇÕES RÁPIDAS ========== 

    // Aplicar configurações padrão ao carregar
    function applyDefaultSettings() {
        if (defaultCameraCheckbox && defaultCameraCheckbox.checked) {
            cameraActive = true;
            cameraBtn.classList.add('active');
        }

        if (defaultMicCheckbox && defaultMicCheckbox.checked) {
            micActive = true;
            micBtn.classList.add('active');
        }
    }

    // Salvar configurações quando alteradas
    if (defaultCameraCheckbox) {
        defaultCameraCheckbox.addEventListener('change', function() {
            localStorage.setItem('defaultCamera', this.checked);
            if (this.checked && !cameraActive) {
                toggleCamera();
            }
        });
    }

    if (defaultMicCheckbox) {
        defaultMicCheckbox.addEventListener('change', function() {
            localStorage.setItem('defaultMic', this.checked);
            if (this.checked && !micActive) {
                toggleMic();
            }
        });
    }

    if (recordCheckbox) {
        recordCheckbox.addEventListener('change', function() {
            localStorage.setItem('recordInterview', this.checked);
            if (this.checked) {
                console.log('Gravação da entrevista habilitada');
            }
        });
    }

    // ========== CARREGAR CONFIGURAÇÕES SALVAS ========== 

    function loadSavedSettings() {
        // Carregar configurações do localStorage
        const savedCameraSetting = localStorage.getItem('defaultCamera');
        const savedMicSetting = localStorage.getItem('defaultMic');
        const savedRecordSetting = localStorage.getItem('recordInterview');

        if (savedCameraSetting !== null && defaultCameraCheckbox) {
            defaultCameraCheckbox.checked = savedCameraSetting === 'true';
        }

        if (savedMicSetting !== null && defaultMicCheckbox) {
            defaultMicCheckbox.checked = savedMicSetting === 'true';
        }

        if (savedRecordSetting !== null && recordCheckbox) {
            recordCheckbox.checked = savedRecordSetting === 'true';
        }
    }

    // ========== INICIALIZAÇÃO ========== 

    // Carregar configurações salvas
    loadSavedSettings();
    
    // Aplicar configurações padrão
    applyDefaultSettings();

    // Simular status inicial
    console.log('Página de entrevista carregada');
    console.log('Status inicial - Câmera:', cameraActive, 'Microfone:', micActive);

    // ========== UTILIDADES ========== 

    // Verificar compatibilidade do navegador (simulado)
    function checkBrowserCompatibility() {
        // Em uma implementação real, verificaria suporte a WebRTC
        const isCompatible = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        
        if (!isCompatible) {
            console.warn('Navegador pode não suportar todas as funcionalidades de vídeo');
        }
        
        return isCompatible;
    }

    // Executar verificação
    checkBrowserCompatibility();

    // ========== ATALHOS DE TECLADO ========== 

    document.addEventListener('keydown', function(event) {
        // Atalhos apenas se não estiver digitando em um campo
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            switch(event.key) {
                case 'c':
                case 'C':
                    toggleCamera();
                    break;
                case 'm':
                case 'M':
                    toggleMic();
                    break;
                case 's':
                case 'S':
                    toggleScreenShare();
                    break;
                case 'Enter':
                    if (event.ctrlKey) {
                        joinInterview();
                    }
                    break;
            }
        }
    });

    console.log('Atalhos de teclado ativados: C (câmera), M (microfone), S (tela), Ctrl+Enter (entrar)');
});