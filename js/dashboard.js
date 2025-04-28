document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay token de autenticación
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Redirigir al login si no hay token
        window.location.href = '/login.html';
        return;
    }
    
    // Formatear la fecha actual
    const formatDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        return today.toLocaleDateString('es-ES', options);
    };
    
    document.getElementById('date-display').textContent = formatDate();
    
    // Obtener datos del usuario
    const getUserData = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                // Si hay error en la respuesta (token inválido, etc.)
                throw new Error('No autorizado');
            }
            
            const userData = await response.json();
            
            // Mostrar nombre del usuario
            document.getElementById('user-name').textContent = userData.nombre;
            
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            // Limpiar token inválido y redirigir al login
            localStorage.removeItem('auth_token');
            window.location.href = '/login.html';
        }
    };
    
    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/login.html';
    };
    
    // Asignar evento de cierre de sesión a los botones correspondientes
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    document.getElementById('sidebar-logout').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Inicializar
    getUserData();
});