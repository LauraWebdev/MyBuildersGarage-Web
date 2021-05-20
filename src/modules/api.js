import axios from 'axios';

class MGGApi {
    apiBase = "";

    constructor(useStagingApi = false) {
        if(useStagingApi) {
            this.apiBase = "http://localhost:1337/api/v1/";
        } else {
            this.apiBase = "https://mygarage.games/api/v1/";
        }
    }

    async authLogin(username, password) {
        try {
            const response = await axios.post(this.apiBase + 'auth/login', {
                "username": username,
                "password": password
            });

            return response.data;
        } catch(error) {
            switch(error.response.data.name) {
                case "USER_NOT_FOUND":
                    throw new UserNotFoundException(error.response.data.text);
                case "AUTHENTICATION_WRONG":
                    throw new AuthenticationWrongException(error.response.data.text);
                default:
                    throw new Error(error.response.data.text);
            }
        }
    }

    async authVerify(jwtToken) {
        try {
            const response = await axios.post(this.apiBase + 'auth/verify', {
                "token": jwtToken,
            });

            return response.data;
        } catch(error) {
            switch(error.response.data.name) {
                case "AUTHENTICATION_WRONG":
                    throw new AuthenticationWrongException(error.response.data.text);
                default:
                    throw new Error(error.response.data.text);
            }
        }
    }

    async authRegister(username, password, email) {
        try {
            const response = await axios.post(this.apiBase + 'users', {
                "username": username,
                "password": password,
                "email": email
            });

            return response.data;
        } catch(error) {
            switch(error.response.data.name) {
                case "USERNAME_EMAIL_CONFLICT":
                    throw new UsernameEmailConflictException(error.response.data.text);
                default:
                    throw new Error(error.response.data.text);
            }
        }
    }

    async getAllGames() {
        try {
            const response = await axios.get(this.apiBase + 'games');

            return response.data;
        } catch(error) {
            switch(error.response.data.name) {
                default:
                    throw new Error(error.response.data.text);
            }
        }
    }
}

class UserNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotFoundException";
    }
}

class AuthenticationWrongException extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationWrongException";
    }
}

class UsernameEmailConflictException extends Error {
    constructor(message) {
        super(message);
        this.name = "UsernameEmailConflictException";
    }
}

export default MGGApi;