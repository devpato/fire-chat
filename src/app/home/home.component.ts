import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { ChatService } from "../chat.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  userChats$;
  constructor(public auth: AuthService, public cs: ChatService) {}

  ngOnInit() {
    this.userChats$ = this.cs.getUserChats();
  }
}
