import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { Prompt } from 'src/prompt/prompt.models';
import { Track } from './track.models';

const TRACK_PAGE_SIZE = 20

@Injectable()
export class TrackService {

  async getTrackById(trackId: string) {
    const trackCollection = getRepository(Track);
    const track: Track = await trackCollection.findById(trackId);
    return track;
  }
  
  async getTracks(accountId: string) {
    const trackCollection = getRepository(Track);
    const tracks: Array<Track> = await trackCollection.whereEqualTo(
      'accountId', accountId
    ).orderByDescending(
      'createdAt'
    ).limit(
      TRACK_PAGE_SIZE
    ).find();
    return tracks;
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

  async editTrack(params: any) {
    const trackCollection = getRepository(Track);
    const track: Track = await trackCollection.findById(params.id);
    track.name = params.name;
    const result = await trackCollection.update(track);
    return result;
  }

  async editTrackPrompts(updatedPrompt: Prompt) {
    const trackCollection = getRepository(Track);
    if (!updatedPrompt.trackId) {
      return;
    }
    const track: Track = await trackCollection.findById(updatedPrompt.trackId);
    const promptData = {
      id: updatedPrompt.id,
      content: updatedPrompt.content,
      type: updatedPrompt.type
    }
    if (!track.prompts) {
      track.prompts = [promptData];
    } else {
      // Check if prompt was updated
      let prompts = [...track.prompts];
      let isPromptUpdated = false;
      prompts.forEach((prompt, index) => {
        if (prompt.id === updatedPrompt.id) {
          prompts[index] = promptData;
          isPromptUpdated = true;
        }
      });
      // Prompt is new
      if (!isPromptUpdated) {
        prompts.push(promptData);
      }
      track.prompts = prompts;
    }
    const result = await trackCollection.update(track);
    return result
  }

}
