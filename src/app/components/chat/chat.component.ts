import {Component} from "@angular/core";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})

export class ChatComponent {
  public isConnected: boolean = false;
}

