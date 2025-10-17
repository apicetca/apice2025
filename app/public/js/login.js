document.addEventListener('DOMContentLoaded', function() {
    // Elementos das abas
    const jovemTab = document.getElementById('jovem-tab');
    const empresaTab = document.getElementById('empresa-tab');
    const jovemContent = document.getElementById('jovem-content');
    const empresaContent = document.getElementById('empresa-content');
    const submitBtn = document.getElementById('submit-btn');
    
    // Elementos de toggle de senha
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Evento de clique para a aba Jovem
    jovemTab.addEventListener('click', function() {
      // Ativa a aba Jovem
      jovemTab.classList.add('active');
      empresaTab.classList.remove('active');
      jovemTab.setAttribute('aria-selected', 'true');
      empresaTab.setAttribute('aria-selected', 'false');
      
      // Mostra o conteúdo do Jovem
      jovemContent.classList.remove('hidden');
      empresaContent.classList.add('hidden');
      
      // Configura o botão para o formulário correto
      submitBtn.setAttribute('form', 'loginForm');
    });
    
    // Evento de clique para a aba Empresa
    empresaTab.addEventListener('click', function() {
      // Ativa a aba Empresa
      empresaTab.classList.add('active');
      jovemTab.classList.remove('active');
      empresaTab.setAttribute('aria-selected', 'true');
      jovemTab.setAttribute('aria-selected', 'false');
      
      // Mostra o conteúdo da Empresa
      empresaContent.classList.remove('hidden');
      jovemContent.classList.add('hidden');
      
      // Configura o botão para o formulário correto
      submitBtn.setAttribute('form', 'empresaForm');
    });
    
    // Funcionalidade de mostrar/ocultar senha
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