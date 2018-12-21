import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from './constants'


firebase.initializeApp(FIREBASE_CONFIG);

export default firebase;