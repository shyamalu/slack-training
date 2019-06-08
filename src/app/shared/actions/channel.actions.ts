import { Action } from '@ngrx/store';
import { Channel } from '../../model/channel';
import { Update } from '@ngrx/entity';

export enum ChannelActionTypes {
  AllChannelsRequested = '[Channels Home Page] All Channels Requested',
  AllChannelsLoaded = '[Channels API] All Channels Loaded',
  ChannelSaved = '[Edit Channel Dialog] Channel Saved',
  ChannelRequested = '[Channel Selected] User Channel ChannelRequested',
  ChannelLoaded = '[FireBase] User Channel Loaded'
}

export class AllChannelsRequested implements Action {

  readonly type = ChannelActionTypes.AllChannelsRequested;

}

export class AllChannelsLoaded implements Action {

  readonly type = ChannelActionTypes.AllChannelsLoaded;

  constructor(public payload: { channels: Channel[] }) {

  }

}

export class ChannelSaved implements Action {

  readonly type = ChannelActionTypes.ChannelSaved;

  constructor(public payload: { channel: Channel }) {
  }
}

export class ChannelRequested implements Action {

  readonly type = ChannelActionTypes.ChannelRequested;

  constructor(public payload: { channelId: string }) {
  }
}

export class ChannelLoaded implements Action {

  readonly type = ChannelActionTypes.ChannelLoaded;

  constructor(public payload: { channel: Update<Channel> }) {
  }
}

export type ChannelActions =
  | AllChannelsRequested
  | AllChannelsLoaded
  | ChannelSaved
  | ChannelRequested
  | ChannelLoaded;




