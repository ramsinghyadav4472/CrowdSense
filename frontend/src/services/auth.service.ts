import api from './api';

const register = (username: string, email: string, password: string) => {
    return api.post('/auth/signup', {
        username,
        email,
        password,
    });
};

const login = (username: string, password: string) => {
    return api.post('/auth/signin', {
        username,
        password,
    })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
