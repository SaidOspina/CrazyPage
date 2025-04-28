document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM
    const registerForm = document.getElementById('register-form');
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
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Validación básica
        if (!nombre || !email || !password || !confirmPassword) {
            showMessage('Por favor, complete todos los campos requeridos.', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden.', 'error');
            return;
        }
        
        if (!terms) {
            showMessage('Debe aceptar los términos y condiciones.', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Por favor, ingrese un correo electrónico válido.', 'error');
            return;
        }
        
        // Validar contraseña
        if (password.length < 8) {
            showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
            return;
        }
        
        // Preparar datos para la petición
        const registerData = {
            nombre,
            email,
            password
        };
        
        try {
            // Enviar petición al servidor
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showMessage(data.message || 'Error al registrarse', 'error');
                return;
            }
            
            // Mostrar mensaje de éxito
            showMessage('Registro exitoso. Redirigiendo al inicio de sesión...', 'success');
            
            // Redirigir al login después de un breve retraso
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor, intente nuevamente.', 'error');
        }
    });
});