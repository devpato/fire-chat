import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import { Observable, of } from "rxjs";
import { switchMap, first } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthService {
  user$: Observable<any>;
  userUID: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<string>(`users/${user.uid}`).valueChanges();
        } else {
          return of("");
        }
      })
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.userUID = credential.user.uid;
    return this.updateUserData(credential.user, "online");
  }

  private updateUserData(
    { uid, email, displayName, photoURL },
    status: string
  ) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const data = {
      uid,
      email,
      displayName,
      photoURL,
      status: status
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.auth.signOut().then(() => {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${this.userUID}`
      );
      console.log("offline bro");
      userRef.update({
        status: "offline"
      });
      this.userUID = null;
    });
    return this.router.navigate(["/"]);
  }

  getUsers(): any {
    return this.afs.collection("users").valueChanges();
  }
}
