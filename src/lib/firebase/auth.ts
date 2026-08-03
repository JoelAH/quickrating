import {
    type User,
    GoogleAuthProvider,
    onAuthStateChanged as _onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signInWithPopup
} from 'firebase/auth';

import { firebaseAuth } from './config';
import { normalizeEmail } from '../models/auth';

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
    return _onAuthStateChanged(firebaseAuth, callback);
}

export async function signUpUser(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, normalizeEmail(email), password);
}

export async function sendVerificationMail(user: User) {
    return sendEmailVerification(user);
}

export async function loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, normalizeEmail(email), password);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(firebaseAuth, provider);
}

export async function signOut() {
    return await firebaseAuth.signOut();
}

export function getUser(): User | null {
    return firebaseAuth.currentUser
}

export async function resetPassword(email: string) {
    return sendPasswordResetEmail(firebaseAuth, email);
}
    