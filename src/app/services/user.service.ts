import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserService {
  private _userID: string;
  private _userID$: Subject<string> = new Subject();

  constructor() {
    this._userID$.subscribe(userID => this._userID = userID);
  }

  public setUserID(userID: string) {
    this._userID$.next(userID);
  }

  public getUserID(): string {
    return this._userID;
  }
}
