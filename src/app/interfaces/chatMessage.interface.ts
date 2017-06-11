import {WebSocketMessage} from "./webSocketMessage.interface";

export interface ChatMessage extends WebSocketMessage{
  user_id: string
  content: string
}
