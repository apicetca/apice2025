document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado, inicializando script de filtro');
            
            // Elementos da interface
            const btnMostrarFiltro = document.getElementById('btnMostrarFiltro');
            const filterBox = document.getElementById('filterBox');
            const closeBtn = document.querySelector('.close-btn');
            
            console.log('Botão de filtro:', btnMostrarFiltro);
            console.log('Caixa de filtro:', filterBox);
            
            // Adicionar classe para garantir que o estilo inicial esteja correto
            if (filterBox) {
                filterBox.classList.remove('visivel');
            }
            console.log('Botão de fechar:', closeBtn);
            
            if (!btnMostrarFiltro || !filterBox || !closeBtn) {
                console.error('Um ou mais elementos não foram encontrados');
                return;
            }
            
            // Mostrar o filtro quando o botão de filtro for clicado
            btnMostrarFiltro.onclick = function(e) {
                console.log('Botão de filtro clicado');
                e.preventDefault();
                if (filterBox.classList.contains('visivel')) {
                    filterBox.classList.remove('visivel');
                    console.log('Filtro ocultado');
                } else {
                    filterBox.classList.add('visivel');
                    console.log('Filtro exibido');
                }
            };
            
            // Fechar o filtro quando o botão de fechar for clicado
            closeBtn.onclick = function(e) {
                console.log('Botão de fechar clicado');
                e.preventDefault();
                filterBox.classList.remove('visivel');
                console.log('Filtro ocultado pelo botão de fechar');
            };
            
            // Limpar filtros
            const limparFiltros = document.getElementById('limparFiltros');
            if (limparFiltros) {
                limparFiltros.onclick = function(e) {
                    console.log('Limpar filtros clicado');
                    e.preventDefault();
                    
                    // Resetar inputs
                    document.querySelectorAll('.filter-box input[type="text"]').forEach(input => {
                        input.value = '';
                    });
                    
                    // Desmarcar checkboxes
                    document.querySelectorAll('.filter-box input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    
                    // Desmarcar radios
                    document.querySelectorAll('.filter-box input[type="radio"]').forEach(radio => {
                        radio.checked = false;
                    });
                };
            }
            
            console.log('Inicialização do script de filtro concluída');
        });