document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Función para mostrar mensajes
    const showMessage = (message, type) => {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
    };
    
    // Configurar botones para mostrar/ocultar contraseña
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Manejar envío del formulario
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validación básica
        if (!email || !password) {
            showMessage('Por favor, complete todos los campos requeridos.', 'error');
            return;
        }
        
        // Preparar datos para la petición
        const loginData = {
            email,
            password,
            remember
        };
        
        try {
            // Enviar petición al servidor
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showMessage(data.message || 'Error al iniciar sesión', 'error');
                return;
            }
            
            // Éxito - Guardar token y redirigir
            localStorage.setItem('auth_token', data.token);
            if (remember) {
                localStorage.setItem('user_email', email);
            }
            
            showMessage('Inicio de sesión exitoso. Redirigiendo...', 'success');
            
            // Redirigir al dashboard o página principal
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor, intente nuevamente.', 'error');
        }
    });
    
    // Cargar email guardado si existe
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('remember').checked = true;
    }
});