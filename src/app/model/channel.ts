export interface Channel {
  id: string;
  details: string;
  name: string;
  createdBy: ChannelCreator;
  totalUsers: number;
}

export interface ChannelCreator {
  userId: string;
  avatar: string;
  name: string;
}
