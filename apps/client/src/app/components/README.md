# Sistema de Protección de Rutas

Este sistema proporciona protección para rutas que requieren autenticación en la aplicación frontend.

## Componentes Implementados

### 1. AuthGuard

El componente principal para proteger rutas. Ofrece las siguientes funcionalidades:

- Verifica si el usuario está autenticado mediante el token almacenado
- Muestra un indicador de carga durante la verificación
- Redirecciona a usuarios no autenticados a la página de login
- Guarda la ubicación original para redirigir después del inicio de sesión

```tsx
// Ejemplo de uso en rutas
<Route path="/ruta-protegida" element={<AuthGuard><ComponenteProtegido /></AuthGuard>} />
```

### 2. ProtectedRoute (Alternativa más simple)

Una versión más simple del guard que solo verifica el token y redirecciona.

### 3. LoginRedirect

Componente que maneja la redirección después del inicio de sesión, llevando al usuario a la página que intentaba acceder originalmente.

### 4. Hook useAuth

Hook personalizado que facilita el acceso a funciones de autenticación desde cualquier componente:

```tsx
const { isAuthenticated, user, login, logout } = useAuth();

// Verificar autenticación
if (!isAuthenticated) {
  // Manejar usuario no autenticado
}
```

## Flujo de Autenticación

1. Usuario intenta acceder a una ruta protegida
2. AuthGuard verifica si existe un token válido
3. Si no hay token, redirecciona al login y guarda la ruta original
4. Después del login exitoso, el usuario es redirigido a la ruta original

## Integración con el Backend

El sistema utiliza tokens JWT almacenados en el estado de la aplicación mediante Zustand. El token se envía en cada solicitud al backend a través del interceptor de Axios configurado.