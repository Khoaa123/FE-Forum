"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@images/logo/voz-logo.png";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ThemeToggle } from "../theme-toggle";
import { useTheme } from "next-themes";
import { CiMail, CiBellOn } from "react-icons/ci";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { useUserStore } from "@/store/User";
import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationStore } from "@/store/Conversations";
import ChatModal from "../chatmodal/ChatModal";

const SIGNALR_HUB_URL = "https://localhost:7094/chatHub";

const Header = () => {
  const { theme } = useTheme();
  const { setDisplayName, displayName, isLogin, userId } = useUserStore();
  const {
    unreadCount,
    setUnreadCount,
    setConversations,
    conversations,
    incrementConversationUnread,
  } = useConversationStore();
  const cookies = useCookies();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    displayName: string;
    avatarUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!userId || !isLogin) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/conversations/${userId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setConversations(
            (data.data || []).map((conv: any) => ({
              id: conv.otherUserId,
              name: conv.otherUserDisplayName,
              avatar:
                conv.otherUserAvatarUrl ||
                "/placeholder.svg?height=40&width=40",
              lastMessage: conv.lastMessageContent || "",
              unread: conv.unreadCount || 0,
              online: false,
            }))
          );
        }
      } catch (err) {
        // ignore
      }
    };

    fetchConversations();
  }, [userId, isLogin, setConversations]);

  useEffect(() => {
    if (!userId || !isLogin) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Chat/unread-count/${userId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.data.unreadCount || 0);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchUnreadCount();
  }, [userId, isLogin, setUnreadCount]);

  // Kết nối SignalR và xử lý nhận tin nhắn mới
  useEffect(() => {
    if (!userId || !isLogin) return;

    const conn = new HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    conn
      .start()
      .then(() => {
        return conn.invoke("RegisterConnection", userId);
      })
      .catch(() => {});

    conn.on(
      "ReceiveMessage",
      (
        senderId: string,
        receiverId: string,
        content: string,
        sentAt: string
      ) => {
        if (receiverId === userId) {
          const store = useConversationStore.getState();
          const exists = store.conversations.some(
            (conv) => conv.id === senderId
          );
          if (!exists) {
            store.setConversations([
              ...store.conversations,
              {
                id: senderId,
                name: "Người dùng mới",
                avatar: "/placeholder.svg?height=40&width=40",
                lastMessage: content,
                unread: 1,
                online: false,
              },
            ]);
          } else {
            store.incrementConversationUnread(senderId);
          }
        }
      }
    );

    setConnection(conn);

    return () => {
      conn.stop();
    };
  }, [userId, isLogin]);

  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token) {
      setDisplayName(token);
    }
  }, [cookies, setDisplayName]);

  const handleLogout = () => {
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    setDisplayName("");
    useUserStore.setState({ isLogin: false });
    if (connection) connection.stop();
  };

  const handleChatClick = (conversation: any) => {
    setSelectedChat({
      id: conversation.id,
      displayName: conversation.name,
      avatarUrl: conversation.avatar,
    });
    setIsMessagesOpen(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours}h trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <>
      <div className="bg-[#0f578a] pt-3">
        <div className="container">
          <Link href="/">
            <Image
              src={logo || "/placeholder.svg"}
              alt="logo"
              width={70}
              height={45}
              priority
            />
          </Link>
          <div className="mt-2 flex justify-between">
            <div>
              <Button className="rounded-none bg-white text-[16px] font-semibold text-[#1474b8] shadow-none hover:bg-white dark:bg-[#1D1F20] hover:dark:bg-[#1D1F20]">
                Forums
              </Button>
              <Button className="rounded-none bg-transparent text-[16px] text-sky-300 transition duration-200 hover:bg-[#a3d4f50f] dark:shadow-none">
                Mới nhất
              </Button>
            </div>
            <div className="flex gap-2">
              {isLogin ? (
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="focus-visible:ring-0"
                    >
                      <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                        {displayName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Quản lý cá nhân</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href={`/profile/${userId}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            Trang cá nhân
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href={`/chat`}>
                          <DropdownMenuItem className="cursor-pointer">
                            Tất cả đoạn chat
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Messages Popover */}
                  <Popover
                    open={isMessagesOpen}
                    onOpenChange={setIsMessagesOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button className="relative rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                        <CiMail size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute -right-1 -top-1 inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Tin nhắn</h3>
                          <Link
                            href="/chat"
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => setIsMessagesOpen(false)}
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                      <ScrollArea className="h-80">
                        {conversations.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Chưa có tin nhắn nào
                          </div>
                        ) : (
                          <div className="divide-y">
                            {conversations.slice(0, 10).map((conversation) => (
                              <div
                                key={conversation.id}
                                className="flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => handleChatClick(conversation)}
                              >
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={
                                        conversation.avatar ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback>
                                      {conversation.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {conversation.online && (
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium">
                                      {conversation.name}
                                    </p>
                                    {conversation.unread > 0 && (
                                      <span className="ml-2 inline-block rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                                        {conversation.unread}
                                      </span>
                                    )}
                                  </div>
                                  <p className="truncate text-xs text-gray-500">
                                    {conversation.lastMessage}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>

                  <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                    <CiBellOn size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link href="/login">
                    <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
              <Link href="/search">
                <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                  Search
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <Card className="rounded-none py-2 shadow-none">
          <div className="container">
            <div className="flex gap-3">
              <div>
                <Button className="h-0 bg-transparent p-0 text-sky-600">
                  Post mới
                </Button>
              </div>
              <div>
                <Button className="h-0 bg-transparent p-0">Tìm kiếm</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {selectedChat && (
        <ChatModal
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          targetUser={selectedChat}
        />
      )}
    </>
  );
};

export default Header;
