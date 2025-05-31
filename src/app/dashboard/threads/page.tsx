"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MoreHorizontal, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { Thread } from "@/app/thread/[id]/page";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateLastActivity } from "@/utils/FormatDate";
import PaginationPage from "@/components/pagination/Pagination";
import { toast } from "react-toastify";

const PostsPage = () => {
  const searchParams = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "visible" | "hidden"
  >("all");
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/All?page=${currentPage}&pageSize=10`
      );
      const data = await res.json();

      let filteredThreads = data.data;
      if (statusFilter === "visible") {
        filteredThreads = data.data.filter(
          (thread: Thread) => !thread.isHidden
        );
      } else if (statusFilter === "hidden") {
        filteredThreads = data.data.filter((thread: Thread) => thread.isHidden);
      }

      setThreads(filteredThreads);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter]);

  const toggleHideThread = async (threadId: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/Hide?id=${threadId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Lỗi khi ẩn/hiện bài viết");
      }
      toast.success("Cập nhật trạng thái bài viết thành công");

      // Refresh data with current filter
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bài viết</h1>
          <p className="text-muted-foreground">
            Quản lý và kiểm duyệt bài viết trên diễn đàn
          </p>
        </div>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Xem diễn đàn
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm bài viết..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Lọc{" "}
              {statusFilter === "visible"
                ? "(Hiển thị)"
                : statusFilter === "hidden"
                ? "(Đã ẩn)"
                : ""}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Tất cả bài viết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("visible")}>
              Chỉ bài viết hiển thị
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("hidden")}>
              Chỉ bài viết đã ẩn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Bài viết</TableHead>
              <TableHead>Chuyên mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thống kê</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Đang tải...</TableCell>
              </TableRow>
            ) : threads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Không có bài viết nào.</TableCell>
              </TableRow>
            ) : (
              threads.map((thread) => (
                <TableRow
                  key={thread.id}
                  className={thread.isHidden ? "opacity-60" : ""}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {thread.title}
                        {thread.isHidden && (
                          <Badge variant="outline" className="ml-2 bg-red-100">
                            Đã ẩn
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={thread.avatarUrl || "/placeholder.svg"}
                            alt={thread.displayName}
                          />
                          <AvatarFallback>
                            {thread.displayName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{thread.displayName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{thread.forumName}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={thread.isSticky ? "default" : "outline"}>
                      {thread.isSticky ? "Ghim" : "Bình thường"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div>{thread.viewCount} lượt xem</div>
                      <div>{thread.totalComments ?? 0} phản hồi</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateLastActivity(thread.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/thread/${thread.id}`)}
                        >
                          Xem bài viết
                        </DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>
                          {thread.isSticky ? "Bỏ ghim" : "Ghim bài viết"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleHideThread(thread.id)}
                        >
                          {thread.isHidden ? "Hiện bài viết" : "Ẩn bài viết"}
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-destructive">
                          Xoá bài viết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationPage totalPages={totalPages} pageNumber={currentPage} />
    </div>
  );
};

export default PostsPage;
