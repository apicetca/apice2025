document.addEventListener('DOMContentLoaded', function() {
    
    const jovemTab = document.getElementById('jovem-tab');
    const empresaTab = document.getElementById('empresa-tab');
    const jovemContent = document.getElementById('jovem-content');
    const empresaContent = document.getElementById('empresa-content');
    const submitBtn = document.getElementById('submit-btn');
    
    
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    
    jovemTab.addEventListener('click', function() {
      
      jovemTab.classList.add('active');
      empresaTab.classList.remove('active');
      jovemTab.setAttribute('aria-selected', 'true');
      empresaTab.setAttribute('aria-selected', 'false');
      
      
      jovemContent.classList.remove('hidden');
      empresaContent.classList.add('hidden');
      
      
      submitBtn.setAttribute('form', 'loginForm');
    });
    
    
    empresaTab.addEventListener('click', function() {
      
      empresaTab.classList.add('active');
      jovemTab.classList.remove('active');
      empresaTab.setAttribute('aria-selected', 'true');
      jovemTab.setAttribute('aria-selected', 'false');
      
      
      empresaContent.classList.remove('hidden');
      jovemContent.classList.add('hidden');
      
      
      submitBtn.setAttribute('form', 'empresaForm');
    });
    
    
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function() {
        const passwordField = this.previousElementSibling;
        const type = passwordField.getAttribute('type');
        
        if (type === 'password') {
          passwordField.setAttribute('type', 'text');
          this.querySelector('i').classList.remove('fa-eye');
          this.querySelector('i').classList.add('fa-eye-slash');
          this.setAttribute('aria-label', 'Ocultar senha');
        } else {
          passwordField.setAttribute('type', 'password');
          this.querySelector('i').classList.remove('fa-eye-slash');
          this.querySelector('i').classList.add('fa-eye');
          this.setAttribute('aria-label', 'Mostrar senha');
        }
      });
    });
  });

