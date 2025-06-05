"use client";

import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";
import { useUserStore } from "@/store/User";
import { useConversationStore, Conversation } from "@/store/Conversations";

type Message = {
  content: string;
  sentAt: string;
  senderId: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  receiverId: string;
  receiverDisplayName: string;
};

const SIGNALR_HUB_URL = "https://localhost:7094/chatHub";

const ForumChat = () => {
  const { userId } = useUserStore((state) => ({
    userId: state.userId,
  }));
  const { conversations, setConversations, updateConversation } =
    useConversationStore();
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [status, setStatus] = useState<
    "Connected" | "Disconnected" | "Connecting"
  >("Disconnected");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/conversations/${userId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const fetchedConversations: Conversation[] = (data.data || []).map(
          (conv: any) => ({
            id: conv.otherUserId,
            name: conv.otherUserDisplayName,
            avatar:
              conv.otherUserAvatarUrl || "/placeholder.svg?height=40&width=40",
            lastMessage: conv.lastMessageContent || "",
            unread: conv.unreadCount || 0,
            online: false,
          })
        );
        setConversations(fetchedConversations);
        setFilteredConversations(fetchedConversations);
        if (fetchedConversations.length > 0) {
          setSelectedConversation(fetchedConversations[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [userId, setConversations]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  useEffect(() => {
    if (!userId) return;

    const conn = new HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    setStatus("Connecting");
    conn
      .start()
      .then(() => {
        setStatus("Connected");
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
          `Received message: ${content} from ${senderId} to ${receiverId}`
        );

        const conversationId = senderId === userId ? receiverId : senderId;

        updateConversation(conversationId, {
          lastMessage: content,
          unread:
            selectedConversation?.id === conversationId
              ? 0
              : (conversations.find((conv) => conv.id === conversationId)
                  ?.unread || 0) + 1,
        });

        if (
          selectedConversation &&
          ((senderId === userId && receiverId === selectedConversation.id) ||
            (senderId === selectedConversation.id && receiverId === userId))
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
                  senderId === userId ? "Bạn" : selectedConversation.name,
                senderAvatarUrl:
                  senderId === userId ? "" : selectedConversation.avatar,
                receiverId,
                receiverDisplayName:
                  receiverId === userId ? "Bạn" : selectedConversation.name,
              },
            ];
          });
        }
      }
    );

    setConnection(conn);

    return () => {
      conn.stop();
    };
  }, [selectedConversation?.id, userId, updateConversation]);

  useEffect(() => {
    if (!userId || !selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/messages/${userId}/${selectedConversation.id}`;
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
        updateConversation(selectedConversation.id, { unread: 0 });
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/mark-read/${userId}/${selectedConversation.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedConversation?.id, userId, updateConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !connection ||
      status !== "Connected" ||
      !selectedConversation ||
      !userId
    ) {
      return;
    }

    const messageRequest = {
      senderId: userId,
      receiverId: selectedConversation.id,
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
        console.error("Failed to send message via API");
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
          receiverId: selectedConversation.id,
          receiverDisplayName: selectedConversation.name,
        },
      ]);

      updateConversation(selectedConversation.id, {
        lastMessage: newMessage,
        unread: 0,
      });

      await connection.invoke(
        "SendMessage",
        userId,
        selectedConversation.id,
        newMessage,
        sentAt
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex w-80 flex-col border-r bg-white">
        <div className="border-b p-4">
          <h2 className="mb-2 text-xl font-semibold">Tin nhắn</h2>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {userId ? (
              isLoading ? (
                <p>Đang tải...</p>
              ) : filteredConversations.length === 0 ? (
                <p>Không tìm thấy cuộc trò chuyện nào</p>
              ) : (
                filteredConversations
                  .filter((conv) => conv.id !== userId)
                  .map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                        selectedConversation?.id === conv.id
                          ? "bg-blue-50 border border-blue-200"
                          : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="font-medium">{conv.name}</div>
                        <div className="truncate text-xs text-gray-500">
                          {conv.lastMessage}
                        </div>
                      </div>
                      {conv.unread > 0 && (
                        <span className="ml-2 inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  ))
              )
            ) : (
              <p className="text-red-500">Vui lòng đăng nhập</p>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-1 flex-col">
        {userId && selectedConversation ? (
          <>
            <div className="flex items-center border-b bg-white p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>
                  {selectedConversation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium">{selectedConversation.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedConversation.online ? "Đang hoạt động" : "Offline"}
                </div>
              </div>
              <div className="ml-auto text-xs">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    status === "Connected"
                      ? "bg-green-500"
                      : status === "Connecting"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                {status}
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const isOwn = msg.senderId === userId;
                  return (
                    <div
                      key={`${msg.senderId}-${msg.sentAt}-${idx}`}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isOwn ? "order-2" : "order-1"
                        }`}
                      >
                        {!isOwn && (
                          <div className="mb-1 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.senderAvatarUrl} />
                              <AvatarFallback>
                                {msg.senderDisplayName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              {msg.senderDisplayName}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg break-words ${
                            isOwn
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${
                            isOwn ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form
              onSubmit={handleSendMessage}
              className="flex items-center space-x-2 border-t bg-white p-4"
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
                disabled={
                  status !== "Connected" || !newMessage.trim() || !userId
                }
                className="bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p>
              {userId
                ? "Chọn một cuộc trò chuyện để bắt đầu"
                : "Vui lòng đăng nhập"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumChat;
