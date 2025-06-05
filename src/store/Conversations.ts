import { create } from "zustand";

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
};

type ConversationStore = {
  conversations: Conversation[];
  unreadCount: number;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  markConversationRead: (conversationId: string) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  incrementConversationUnread: (conversationId: string) => void;
  decrementUnreadCount: (count: number) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  unreadCount: 0,
  setConversations: (conversations) =>
    set((state) => ({
      conversations,
      unreadCount: conversations.reduce((sum, conv) => sum + conv.unread, 0),
    })),
  updateConversation: (conversationId, updates) =>
    set((state) => {
      const newConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      );

      // Tính lại unreadCount mỗi khi cập nhật conversation
      const newUnreadCount = newConversations.reduce(
        (sum, conv) => sum + conv.unread,
        0
      );

      return {
        conversations: newConversations,
        unreadCount: newUnreadCount,
      };
    }),
  markConversationRead: (conversationId) =>
    set((state) => {
      const conversation = state.conversations.find(
        (conv) => conv.id === conversationId
      );
      const unreadReduction = conversation ? conversation.unread : 0;
      return {
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        ),
        unreadCount: Math.max(0, state.unreadCount - unreadReduction),
      };
    }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  incrementConversationUnread: (conversationId) =>
    set((state) => {
      const newConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: conv.unread + 1 } : conv
      );

      return {
        conversations: newConversations,
        unreadCount: state.unreadCount + 1,
      };
    }),
  decrementUnreadCount: (count) =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - count) })),
}));
