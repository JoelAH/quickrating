export enum AuthMode {
    Signup = 'Signup',
    Login = 'Login'
}

export function normalizeEmail(email: string) {
    if (email.includes('+')) {
        const parts = email.split('@');
        const username = parts[0];
        const domain = parts[1];
        const normalized = username.split('+')[0] + '@' + domain;
        return normalized;
    } else {
        return email;
    }
}