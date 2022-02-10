import firebase from "firebase/compat/app"
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import store from "../store";
import { setUser, setProfile } from "../slices/authSlice";
import { setHabits } from "../slices/habitSlice"
import moment from 'moment'
import { db } from "../firebase";
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getProfile, createUserProfile } from "../Api";
import { getDate } from "../Api";
import toast from 'react-hot-toast';


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const logout = () => {
    auth.signOut();
    store.dispatch(setUser({ fullname: null, uid: null, api_token: null, photo_url: null }))
    store.dispatch(setHabits(null))
    store.dispatch(setProfile({ username: null, height: null, age: null, rise_time: null, sleep_time: null }))

}

export const register = async (email, password, fullname, setLoading) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (UserCredential) => {
            updateProfile(UserCredential.user, { displayName: fullname, });
            await generate_api_token()
                .then((token) => {
                    createUserProfile(auth.currentUser.uid, token)
                        .then(() => {
                            store.dispatch(setUser({ fullname: fullname, uid: auth.currentUser.uid, api_token: token }));
                            window.location.href = '/createprofile';
                        })
                })
        })
        .catch((error) => { setLoading(false); toast(error.message) })
}
export const signin = async (email, password, setLoading) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
            await generate_api_token("token")
                .then(async (token) => {
                    getProfile(auth.currentUser.uid, token, {})
                        .then(() => {
                            store.dispatch(setUser({ fullname: auth.currentUser.displayName, uid: auth.currentUser.uid, api_token: token }));
                            if (store.getState().auth1.profile.username == "null" || store.getState().auth1.profile.username == null) {  //if user hasn't completed profile, redirects to create profile page
                                createUserProfile(auth.currentUser.uid, token)
                                    .then(window.location.href = '/createprofile');
                            }
                            else {
                                window.location.href = '/home';
                            }
                        })
                })

        })
        .catch((error) => { setLoading(false); toast(error.message) })

}

export const signInWithGoogle = async () => {
    auth.signInWithPopup(provider)
        .then(async () => {
            var access_data = null;
            var tok = null;
            await getDoc(doc(db, "users_api_keys", auth.currentUser.uid))
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        access_data = documentSnapshot.data();
                    }
                });
            if (access_data) {
                await generate_api_token(access_data.api_token)
                    .then(async (token) => {
                        tok = token;
                        store.dispatch(setUser({ fullname: auth.currentUser.displayName, uid: auth.currentUser.uid, api_token: tok, photo_url: auth.currentUser.photoURL }));
                        getProfile(auth.currentUser.uid, tok, {})
                            .then(() => {
                                if (store.getState().auth1.profile.username == "null" || store.getState().auth1.profile.username == null) {  //if user hasn't completed profile, redirects to create profile page
                                    createUserProfile(auth.currentUser.uid, access_data.api_token)
                                        .then(window.location.href = '/createprofile');
                                }
                                else {
                                    getProfile(auth.currentUser.uid, tok, {})
                                        .then(window.location.href = '/home');
                                }
                            })
                    })
            }
            else  //if is first login
            {
                await generate_api_token()
                    .then((token) => { tok = token; store.dispatch(setUser({ fullname: auth.currentUser.displayName, uid: auth.currentUser.uid, api_token: tok, photo_url: auth.currentUser.photoURL })) })
                    .finally(async () => {
                        createUserProfile(auth.currentUser.uid, tok)
                            .then(window.location.href = '/createprofile');
                    })
            }

        })
}

export const generate_api_token = async (token = null) => {
    let expire;
    if (token) {
        var access_data = null;
        await getDoc(doc(db, "users_api_keys", auth.currentUser.uid))
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
            let tok = uuidv4();
            await setDoc(doc(db, "users_api_keys", auth.currentUser.uid), { api_token: tok, expire: moment(getDate()).add(7, 'days').format('YYYY-MM-DD') })
            return tok;
        }
        else {
            return token
        }
    }
    else {  //if user hasn't got already an API token
        let tok = uuidv4();
        await setDoc(doc(db, "users_api_keys", auth.currentUser.uid), { api_token: tok, expire: moment(getDate()).add(7, 'days').format('YYYY-MM-DD') })
        return tok;
    }
}


export default firebase