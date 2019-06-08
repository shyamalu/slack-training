import { Action } from '@ngrx/store';
import { UserChannel } from '../../model/user-channel';
import { Update } from '@ngrx/entity';

export enum UserChannelActionTypes {
  AllUserChannelsRequested = '[Channels Home Page] All User Channels Requested',
  AllUserChannelsLoaded = '[Channels API] All User Channels Loaded',
  UserChannelSaved = '[Edit Channel Dialog] User Channel Saved',
  UserChannelSelected = '[Channel Selected] User Channel Selected',
  UserChannelStarred = '[Info ] User Channel Starred',
  UserChannelUnStarred = '[Info] User Channel UnStarred'

}

export class AllUserChannelsRequested implements Action {

  readonly type = UserChannelActionTypes.AllUserChannelsRequested;

  constructor(public payload: { userId: string }) {

  }

}

export class AllUserChannelsLoaded implements Action {

  readonly type = UserChannelActionTypes.AllUserChannelsLoaded;

  constructor(public payload: { userChannels: UserChannel[] }) {

  }
}

export class UserChannelSaved implements Action {

  readonly type = UserChannelActionTypes.UserChannelSaved;

  constructor(public payload: { userChannel: Update<UserChannel> }) {
  }
}

export class UserChannelSelected implements Action {

  readonly type = UserChannelActionTypes.UserChannelSelected;

  constructor(public payload: { userId: string, channelId: string }) {
  }
}

export class UserChannelStarred implements Action {

  readonly type = UserChannelActionTypes.UserChannelStarred;

  constructor(public payload: { userId: string, channelId: string }) {
  }
}

export class UserChannelUnStarred implements Action {

  readonly type = UserChannelActionTypes.UserChannelUnStarred;

  constructor(public payload: { userId: string, channelId: string }) {
  }
}

export type UserChannelActions =
  | AllUserChannelsRequested
  | AllUserChannelsLoaded
  | UserChannelSaved
  | UserChannelSelected
  | UserChannelUnStarred
  | UserChannelStarred;




