"use client";

import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Minimize2 } from "lucide-react";
import { useUserStore } from "@/store/User";
import { useConversationStore } from "@/store/Conversations";

type Message = {
  content: string;
  sentAt: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  receiverId: string;
  receiverDisplayName: string;
};

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
};

const SIGNALR_HUB_URL = "https://localhost:7094/chatHub";

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  targetUser,
}) => {
  const { userId } = useUserStore((state) => ({
    userId: state.userId,
  }));
  const {
    markConversationRead,
    conversations,
    incrementConversationUnread,
    setUnreadCount,
  } = useConversationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [status, setStatus] = useState<
    "Connected" | "Disconnected" | "Connecting"
  >("Disconnected");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId || !isOpen) return;

    const conn = new HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    setStatus("Connecting");
    conn
      .start()
      .then(() => {
        setStatus("Connected");
        console.log(`SignalR Connected for user ${userId}`);
        return conn.invoke("RegisterConnection", userId);
      })
      .catch((err) => {
        console.error("SignalR Connection Error:", err);
        setStatus("Disconnected");
      });

    conn.on(
      "ReceiveMessage",
      (
        senderId: string,
        receiverId: string,
        content: string,
        sentAt: string
      ) => {
        console.log(
          `Received message in ChatModal: ${content} from ${senderId} to ${receiverId}`
        );

        if (
          (senderId === userId && receiverId === targetUser.id) ||
          (senderId === targetUser.id && receiverId === userId)
        ) {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.content === content &&
                msg.sentAt === sentAt &&
                msg.senderId === senderId
            );
            if (exists) return prev;
            return [
              ...prev,
              {
                content,
                sentAt,
                senderId,
                senderDisplayName:
                  senderId === userId ? "Bạn" : targetUser.displayName,
                senderAvatarUrl:
                  senderId === userId ? "" : targetUser.avatarUrl,
                receiverId,
                receiverDisplayName:
                  receiverId === userId ? "Bạn" : targetUser.displayName,
              },
            ];
          });
        }
      }
    );

    setConnection(conn);

    return () => {
      conn.stop().then(() => console.log("SignalR Disconnected"));
    };
  }, [userId, targetUser.id, isOpen]);

  useEffect(() => {
    if (!userId || !targetUser.id || !isOpen) return;

    const fetchMessages = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/messages/${userId}/${targetUser.id}`;
        const res = await fetch(url);
        if (!res.ok) {
          setMessages([]);
          return;
        }
        const data = await res.json();
        setMessages(
          (data.data || []).map((msg: any) => ({
            content: msg.content,
            sentAt: msg.sentAt,
            senderId: msg.senderId,
            senderDisplayName: msg.senderDisplayName,
            senderAvatarUrl: msg.senderAvatarUrl || "",
            receiverId: msg.receiverId,
            receiverDisplayName: msg.receiverDisplayName,
          }))
        );

        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/mark-read/${userId}/${targetUser.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        markConversationRead(targetUser.id);

        setUnreadCount(
          conversations
            .map((conv) =>
              conv.id === targetUser.id ? { ...conv, unread: 0 } : conv
            )
            .reduce((sum, conv) => sum + conv.unread, 0)
        );
      } catch (err) {
        setMessages([]);
      }
    };

    fetchMessages();
  }, [
    userId,
    targetUser.id,
    isOpen,
    markConversationRead,
    conversations,
    setUnreadCount,
  ]);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [isOpen, isMinimized, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !connection ||
      status !== "Connected" ||
      !userId
    ) {
      return;
    }

    const messageRequest = {
      senderId: userId,
      receiverId: targetUser.id,
      content: newMessage,
    };

    const sentAt = new Date().toISOString();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageRequest),
        }
      );
      if (!res.ok) {
        console.error("Failed to send message via API:", res.status);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          content: newMessage,
          sentAt,
          senderId: userId,
          senderDisplayName: "Bạn",
          senderAvatarUrl: "",
          receiverId: targetUser.id,
          receiverDisplayName: targetUser.displayName,
        },
      ]);

      await connection
        .invoke("SendMessage", userId, targetUser.id, newMessage, sentAt)
        .catch((err) => {
          console.error("Error invoking SendMessage:", err);
        });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ${
          isMinimized ? "w-80 h-12" : "w-80 h-96"
        }`}
      >
        <div className="flex items-center justify-between rounded-t-lg border-b bg-blue-500 p-3 text-white">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={targetUser.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>
                {targetUser.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium">
              {targetUser.displayName}
            </span>
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                status === "Connected"
                  ? "bg-green-400"
                  : status === "Connecting"
                  ? "bg-yellow-400"
                  : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-600"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-white hover:bg-blue-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="h-64 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 p-3" ref={scrollAreaRef}>
                  {messages.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-500">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isOwn = msg.senderId === userId;
                      return (
                        <div
                          key={`${msg.senderId}-${msg.sentAt}-${idx}`}
                          className={`flex w-full ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-start gap-2 max-w-[85%] ${
                              isOwn ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {!isOwn && (
                              <Avatar className="mt-1 h-6 w-6 flex-shrink-0">
                                <AvatarImage
                                  src={
                                    msg.senderAvatarUrl || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="text-xs">
                                  {msg.senderDisplayName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`flex flex-col ${
                                isOwn ? "items-end" : "items-start"
                              }`}
                            >
                              {!isOwn && (
                                <span className="mb-1 px-1 text-xs text-gray-500">
                                  {msg.senderDisplayName}
                                </span>
                              )}
                              <div
                                className={`px-3 py-2 rounded-lg text-sm break-words word-wrap ${
                                  isOwn
                                    ? "bg-blue-500 text-white rounded-br-sm"
                                    : "bg-gray-200 text-gray-900 rounded-bl-sm"
                                }`}
                                style={{
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  hyphens: "auto",
                                }}
                              >
                                {msg.content}
                              </div>
                              <span
                                className={`text-xs text-gray-500 mt-1 px-1 ${
                                  isOwn ? "text-right" : "text-left"
                                }`}
                              >
                                {new Date(msg.sentAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="rounded-b-lg border-t bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 p-3"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    status === "Connected"
                      ? "Nhập tin nhắn..."
                      : "Đang kết nối..."
                  }
                  className="flex-1 focus:border-blue-500 focus-visible:ring-transparent"
                  disabled={status !== "Connected" || !userId}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    status !== "Connected" || !newMessage.trim() || !userId
                  }
                  className="bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-3 w-3 text-white" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
