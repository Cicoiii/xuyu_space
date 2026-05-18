import { db } from 'tailchat-server-sdk';
import type { Types } from 'mongoose';

const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_ai_assistant_config',
  },
})
export class AIAssistantConfig extends TimeStamps implements db.Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    default: 'global',
    unique: true,
  })
  name: string;

  @prop()
  providerName?: string;

  @prop()
  apiUrl?: string;

  @prop()
  apiKey?: string;

  @prop()
  chatModel?: string;

  @prop()
  thinkModel?: string;
}

export type AIAssistantConfigDocument = db.DocumentType<AIAssistantConfig>;

const model = getModelForClass(AIAssistantConfig);

export type AIAssistantConfigModel = typeof model;

export default model;
