export function clearAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
  }
  
  export function scheduleTokenClear() {
    const authTokenExpiration = localStorage.getItem('authTokenExpiration');
    const timeLeft = authTokenExpiration - new Date().getTime();
  
    if (timeLeft > 0) {
      setTimeout(() => {
        clearAuthToken();
      }, timeLeft);
    } else {
      clearAuthToken();
    }
  }
  