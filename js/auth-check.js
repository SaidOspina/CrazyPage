document.addEventListener('DOMContentLoaded', function() {
    // Lista de páginas protegidas
    const protectedPages = [
        'dashboard.html',
        'profile.html',
        'services.html',
        'invoices.html',
        'tickets.html',
        'service-details.html'
    ];
    
    // Obtener la página actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Verificar si la página actual requiere autenticación
    const requiresAuth = protectedPages.includes(currentPage);
    
    // Obtener token de autenticación
    const token = localStorage.getItem('auth_token');
    
    // Función para verificar si el token es válido
    const verifyToken = async () => {
        try {
            const response = await fetch('/api/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error al verificar token:', error);
            return false;
        }
    };
    
    // Redirección basada en autenticación
    const handleAuthentication = async () => {
        if (requiresAuth) {
            // Si la página requiere autenticación
            if (!token || !(await verifyToken())) {
                // Redirigir al login si no hay token o es inválido
                window.location.href = '/login.html';
            }
        } else if (currentPage === 'login.html' || currentPage === 'register.html') {
            // Si estamos en login o registro, verificar si ya hay sesión
            if (token && (await verifyToken())) {
                // Redirigir al dashboard si ya hay una sesión válida
                window.location.href = '/dashboard.html';
            }
        }
    };
    
    // Ejecutar verificación
    handleAuthentication();
});