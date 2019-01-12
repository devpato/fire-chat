import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { firestore } from "firebase/app";
import { map, switchMap } from "rxjs/operators";
import { Observable, combineLatest, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

  get(chatId) {
    return this.afs
      .collection<any>("chats")
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  //Creating new chat
  async create() {
    const { uid } = await this.auth.getUser(); //To make sure we have an authicated user

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection("chats").add(data);

    return this.router.navigate(["chats", docRef.id]);
  }

  async sendMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    //if authetificated, send chat and add it to the chats array using arrayUnion for only adding one payload
    if (uid) {
      const ref = this.afs.collection("chats").doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }
}
