import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { authbase } from '../firebase'
import { updateProfile } from '@firebase/auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import store from '../store';
import { setHabits } from '../slices/habitSlice';
import { setLoading, setUser, setProfile } from '../slices/authSlice';
import { getProfile, createUserProfile, getDate } from './Api';
import moment from 'moment'
import uuid from 'react-native-uuid';
import { cancelAllNot } from '../NotificationHandler';

const config = {
    webClientId: "your web client",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email"],
}

GoogleSignin.configure(config);

const setLoadingState = (state) => {
    store.dispatch(setLoading(state))
}

export const generate_api_token = async (uid, token = null) => {
    let expire;
    if (token) {
        var access_data = null;
        await firestore().collection("users_api_keys").doc(uid).get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    access_data = documentSnapshot.data();
                }
            });
        if (access_data) {
            token = access_data.api_token;
            expire = access_data.expire
        }
        else {  //if can't retrieve api token, set it as expired to generate a new one
            expire = "1970-01-01"
        }
        if (moment(expire) < new Date()) {   //if token is expired
            let tok = uuid.v4();
            await firestore().collection("users_api_keys").doc(uid).set({ api_token: tok, expire: moment(getDate()).add(7, 'days').format('YYYY-MM-DD') })
            return tok;
        }
        else {
            return token
        }
    }
    else {  //if user hasn't got already an API token
        let tok = uuid.v4();
        await firestore().collection("users_api_keys").doc(uid).set({ api_token: tok, expire: moment(getDate()).add(7, 'days').format('YYYY-MM-DD') })
        return tok;
    }
}


export const logout = () => {
    signOut(authbase).catch((error) => alert(error.message))
    GoogleSignin.signOut();
    cancelAllNot();        //on signOut removes all scheduled notifications
    store.dispatch(setUser({ fullname: null, uid: null, api_token: null, photo_url: null }))
    store.dispatch(setHabits(null))
    store.dispatch(setProfile({ username: null, height: null, age: null, rise_time: null, sleep_time: null }))
}

export const signInWithGoogle = async () => {
    setLoadingState(true);
    const { idToken } = await GoogleSignin.signIn().catch((error) => { setLoadingState(false); alert(error); });
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential).then(async () => {
        var access_data = null;
        var tok = null;
        await firestore().collection("users_api_keys").doc(auth().currentUser.uid).get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    access_data = documentSnapshot.data();
                }
            });
        if (access_data) { //if user already registerd
            await generate_api_token(auth().currentUser.uid, access_data.api_token)
                .then((token) => {
                    tok = token;
                    getProfile(auth().currentUser.uid, tok)
                        .then(() => store.dispatch(setUser({ fullname: auth().currentUser.displayName, uid: auth().currentUser.uid, api_token: tok, photo_url: auth().currentUser.photoURL })))
                        .finally(() => setLoadingState(false));
                })
        }
        else { //if is new user
            await generate_api_token(auth().currentUser.uid)
                .then((token) => { tok = token; store.dispatch(setUser({ fullname: auth().currentUser.displayName, uid: auth().currentUser.uid, api_token: tok, photo_url: auth().currentUser.photoURL })) })
                .finally(async () => {
                    createUserProfile(auth().currentUser.uid, tok)
                        .finally(() => setLoadingState(false));
                })
        }
    })
        .catch((error) => { setLoadingState(false); alert(error) });
}

export const register = (email, password, fullname) => {
    setLoadingState(true);
    createUserWithEmailAndPassword(authbase, email, password)
        .then(async (UserCredential) => {
            updateProfile(UserCredential.user, { displayName: fullname, });
            await generate_api_token(authbase.currentUser.uid)
                .then((token) => {
                    createUserProfile(authbase.currentUser.uid, token)
                    store.dispatch(setUser({ fullname: fullname, uid: authbase.currentUser.uid, api_token: token }));
                })
        }).catch(error => alert(error.message))
        .finally(() => setLoadingState(false));
}

export const signin = (email, password) => {
    setLoadingState(true)
    signInWithEmailAndPassword(authbase, email, password).then(async () => {
        await generate_api_token(authbase.currentUser.uid, "token")
            .then(async (token) => {
                await getProfile(authbase.currentUser.uid, token)
                    .then(() => { store.dispatch(setUser({ fullname: authbase.currentUser.displayName, uid: authbase.currentUser.uid, api_token: token })); setLoadingState(false) })
            })
    })
        .catch(error => { setLoadingState(false); alert(error.message) })
};
