import {Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit} from "@angular/core";
import {APIService} from "../../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatMessage} from "../../interfaces/chatMessage.interface";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})

export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  @ViewChildren('messageItems') private messageItems: QueryList<any>;

  public form: FormGroup;
  public isConnected: boolean;
  public messages = [];

  constructor(private api: APIService, private fb: FormBuilder, private user: UserService) {
    this.form = this.fb.group({
      content: ['', Validators.required]
    });
  }

  public ngOnInit() {
    this.api.getConnectionStatus().subscribe(res => {
      this.isConnected = res;
      if(this.isConnected) {
        this.form.enable()
      } else {
        this.form.disable()
      }
    });

    this.api.getChatMessages().subscribe(res => this.messages.push(res));
    this.api.findGameRoom();
  }

  public ngAfterViewInit() {
    this.messageItems.changes.subscribe(() => this.scrollToBottom())
  }

  public sendMessage(message: ChatMessage): void {
    this.form.controls.content.setValue(this.form.controls.content.value.trim());

    if (this.form.valid) {
      message.user_id = this.user.getUserID();
      this.api.sendMessage(message);
      this.form.controls.content.setValue('')
    }
  }

  private scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }

  public isOpponentMessage(message: ChatMessage): boolean {
    return message.user_id !== this.user.getUserID()
  }
}

