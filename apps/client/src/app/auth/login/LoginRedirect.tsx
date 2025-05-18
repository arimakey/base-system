import { useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../stores/user.store';

/**
 * Componente que maneja la redirección después del inicio de sesión
 * Redirecciona al usuario a la página original que intentó acceder antes de ser redirigido al login
 */
const LoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useUserStore((state) => state.token);
  
  // Memorizar la ruta de destino para evitar cálculos repetidos
  const destinationPath = useMemo(() => {
    return location.state?.from || '/dashboard';
  }, [location.state]);
  
  // Función de redirección memorizada
  const redirectUser = useCallback(() => {
    if (token) {
      navigate(destinationPath, { replace: true });
    }
  }, [token, navigate, destinationPath]);
  
  useEffect(() => {
    redirectUser();
  }, [redirectUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      Redireccionando...
    </div>
  );
};

export default LoginRedirect;