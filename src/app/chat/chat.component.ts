import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList
} from "@angular/core";
import { ChatService } from "../chat.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, AfterViewInit {
  chat$: Observable<any>;
  newMsg: string;

  // @ViewChild("cardBody")
  // cardBody: QueryList<ElementRef>;

  constructor(
    public _cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get("id");
    const source = this._cs.get(chatId);
    this.chat$ = this._cs.joinUsers(source);
    //.pipe(tap(() => this.scrollBottom()));
    //this.chat$.subscribe(() => this.scrollBottom());
  }

  submit(chatId) {
    if (!this.newMsg) {
      return alert("you need to enter something");
    }
    this._cs.sendMessage(chatId, this.newMsg);
    this.newMsg = "";
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  scrollBottom() {
    const CHAT_BODY = document.getElementById("card-body");
    CHAT_BODY.scrollTop = CHAT_BODY.scrollHeight;
  }

  ngAfterViewInit() {
    //
  }
}
