import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { GroupTopic } from './types';

interface TopicPanelMap {
  [panelId: string]: GroupTopic[];
}

interface TopicStoreState {
  topicMap: TopicPanelMap;
  addTopicPanel: (panelId: string, topicList: GroupTopic[]) => void;
  addTopicItem: (panelId: string, topic: GroupTopic) => void;
  deleteTopicItem: (panelId: string, topicId: string) => void;
  updateTopicItem: (panelId: string, topic: GroupTopic) => void;
  resetTopicPanel: (panelId: string) => void;
}

export const useTopicStore = create<
  TopicStoreState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    topicMap: {},
    addTopicPanel: (panelId, topicList) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          const topicMap = new Map(
            state.topicMap[panelId].map((topic) => [topic._id, topic])
          );

          topicList.forEach((topic) => {
            topicMap.set(topic._id, topic);
          });

          state.topicMap[panelId] = Array.from(topicMap.values());
        } else {
          state.topicMap[panelId] = topicList;
        }
      });
    },
    addTopicItem: (panelId, topic) => {
      set((state) => {
        const topicList = state.topicMap[panelId];
        if (topicList) {
          const existedIndex = topicList.findIndex((t) => t._id === topic._id);

          if (existedIndex >= 0) {
            topicList[existedIndex] = topic;
            return;
          }

          state.topicMap[panelId].unshift(topic);
        } else {
          state.topicMap[panelId] = [topic];
        }
      });
    },
    deleteTopicItem: (panelId, topicId) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId] = state.topicMap[panelId].filter(
            (item) => item._id !== topicId
          );
        }
      });
    },
    updateTopicItem: (panelId, topic) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          const findedTopicIndex = state.topicMap[panelId].findIndex(
            (t) => t._id === topic._id
          );
          if (findedTopicIndex >= 0) {
            state.topicMap[panelId][findedTopicIndex] = topic;
          } else {
            state.topicMap[panelId].unshift(topic);
          }
        } else {
          state.topicMap[panelId] = [topic];
        }
      });
    },
    resetTopicPanel: (panelId) => {
      set((state) => {
        delete state.topicMap[panelId];
      });
    },
  }))
);
