import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { Track } from './track.models';

const TRACK_PAGE_SIZE = 20

@Injectable()
export class TrackService {

  async getTracks(accountId: string) {
    const trackCollection = getRepository(Track);
    const threads: Array<Track> = await trackCollection.whereEqualTo(
      'accountId', accountId
    ).orderByDescending(
      'createdAt'
    ).limit(
      TRACK_PAGE_SIZE
    ).find();
    return threads;
  }
  
  async createTrack(params: any) {
    const trackCollection = getRepository(Track);
    const track: Track = new Track();
    track.name = params.name;
    track.accountId = params.accountId;
    track.createdById = params.createdById;
    track.createdAt = new Date();
    const result = await trackCollection.create(track);
    return result;
  }

}
