import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {WebSocketBridge} from 'django-channels';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ChatMessage} from "../interfaces/chatMessage.interface";
import {webSocketResponse} from "../interfaces/webSocketResponse.interface";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {WebSocketMessage} from "../interfaces/webSocketMessage.interface";

@Injectable()
export class APIService {
  private webSocketBridge: WebSocketBridge = new WebSocketBridge();
  private messages$: ReplaySubject<ChatMessage> = new ReplaySubject();
  private isConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isReceiving$: Subject<boolean> = new Subject();

  constructor(private http: Http, private user: UserService) {}

  private openWebSocketConnection(room_id: string) {
    this.webSocketBridge.connect('ws://localhost:8000/' + room_id);
    this.webSocketBridge.socket.onmessage = (event: MessageEvent) => this.dispatchMessageEvent(event);
  }

  private dispatchMessageEvent(event: MessageEvent) {
    let message = JSON.parse(event.data);
    switch(message.type) {
      case 'DISCONNECT': {
        this.messages$.next(message);
        this.isConnected$.next(false);
        break;
      }
      case 'TYPING': {
        if (message.user_id !== this.user.getUserID()) {
          this.isReceiving$.next(true);
        }
        break;
      }
      case 'MESSAGE': {
        this.messages$.next(message);
        break;
      }
      case 'CONNECT': {
        this.messages$.next(message);
        this.isConnected$.next(true);
        break;
      }
    }
  }

  public findGameRoom() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.get('http://localhost:8000/api/v1/gamerooms/', {headers: headers})
      .subscribe(res => {
        let response: webSocketResponse = res.json();
        this.user.setUserID(response.user_id);
        this.openWebSocketConnection(response.room_id);
      })
  }

  public sendMessage(message: ChatMessage | WebSocketMessage) {
    this.webSocketBridge.send(message)
  }

  public getChatMessages() {
    return this.messages$;
  }

  public getConnectionStatus() {
    return this.isConnected$;
  }

  public getChatStatus() {
    return this.isReceiving$;
  }
}
