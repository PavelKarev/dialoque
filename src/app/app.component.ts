import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any>;
  itemsLength: 0;
  name: any;
  date: any;
  msgVal: string = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });

    this.afAuth.authState.subscribe((user: firebase.User) => {
      this.name = user;
    });
    this.user = this.afAuth.authState;

    this.items.subscribe(items => {
      this.itemsLength = items.length;
    })
  }

  login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    });    
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  remove(key: string) {
    this.items.remove(key);
  }

  removeAll() {
    this.items.remove();
  }

  chatSend(desc: string) {
    this.items.push({
      message: desc,
      name: this.name.displayName
    });

    this.msgVal = '';
  }
}
