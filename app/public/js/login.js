document.addEventListener('DOMContentLoaded', function() {
    const jovemTab = document.getElementById('jovem-tab');
    const empresaTab = document.getElementById('empresa-tab');
    const jovemContent = document.getElementById('jovem-content');
    const empresaContent = document.getElementById('empresa-content');
    const submitBtn = document.getElementById('submit-btn');

    function switchToJovem() {
        jovemTab.classList.add('active');
        jovemTab.setAttribute('aria-selected', 'true');
        empresaTab.classList.remove('active');
        empresaTab.setAttribute('aria-selected', 'false');
        
        jovemContent.classList.remove('hidden');
        empresaContent.classList.add('hidden');
        
        submitBtn.setAttribute('form', 'loginForm');
        
        console.log('Switched to Jovem tab');
    }

    function switchToEmpresa() {
        empresaTab.classList.add('active');
        empresaTab.setAttribute('aria-selected', 'true');
        jovemTab.classList.remove('active');
        jovemTab.setAttribute('aria-selected', 'false');
        
        empresaContent.classList.remove('hidden');
        jovemContent.classList.add('hidden');
        
        submitBtn.setAttribute('form', 'empresaForm');
        
        console.log('Switched to Empresa tab');
    }

    if (jovemTab && empresaTab) {
        jovemTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchToJovem();
        });

        empresaTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchToEmpresa();
        });
    }

    jovemTab?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchToJovem();
        }
    });

    empresaTab?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchToEmpresa();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Ocultar senha');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Mostrar senha');
            }
        });
    });
});
