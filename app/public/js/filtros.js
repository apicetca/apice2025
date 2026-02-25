document.addEventListener('DOMContentLoaded', function() {
    const btnMostrarFiltro = document.getElementById('btnMostrarFiltro');
    const filterBox = document.getElementById('filterBox');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeBtn = document.querySelector('.close-btn');
    const limparFiltros = document.getElementById('limparFiltros');
    const filterForm = document.querySelector('.filter-form');

    function abrirFiltro() {
        filterBox.classList.add('open');
        filterOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function fecharFiltro() {
        filterBox.classList.remove('open');
        filterOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (btnMostrarFiltro) {
        btnMostrarFiltro.addEventListener('click', function(e) {
            e.preventDefault();
            abrirFiltro();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fecharFiltro();
        });
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', function() {
            fecharFiltro();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharFiltro();
        }
    });

    if (limparFiltros) {
        limparFiltros.addEventListener('click', function(e) {
            e.preventDefault();
            
            const textInputs = filterForm.querySelectorAll('input[type="text"]');
            textInputs.forEach(input => input.value = '');
            
            const selects = filterForm.querySelectorAll('select');
            selects.forEach(select => select.selectedIndex = 0);
            
            const radioButtons = filterForm.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => radio.checked = false);
        });
    }

    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(filterForm);
            const local = filterForm.querySelector('input[type="text"]').value;
            const formato = formData.get('formato');
            const area = filterForm.querySelector('select[name="area"]')?.value || 
                        filterForm.querySelectorAll('select')[0]?.value;
            const salario = filterForm.querySelectorAll('select')[1]?.value;
            const contrato = filterForm.querySelectorAll('select')[2]?.value;
            
            const params = new URLSearchParams();
            if (local) params.append('local', local);
            if (formato) params.append('formato', formato);
            if (area) params.append('area', area);
            if (salario) params.append('salario', salario);
            if (contrato) params.append('contrato', contrato);
            
            const url = params.toString() ? `/vagas?${params.toString()}` : '/vagas';
            window.location.href = url;
        });
    }
});
