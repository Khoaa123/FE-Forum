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

const posts = [
  {
    id: 1,
    title: "Thảo luận về công nghệ mới",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Công nghệ",
    status: "published",
    views: 1245,
    replies: 32,
    createdAt: "2 giờ trước",
  },
  {
    id: 2,
    title: "Chia sẻ kinh nghiệm du lịch Đà Nẵng",
    author: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Du lịch",
    status: "published",
    views: 876,
    replies: 18,
    createdAt: "5 giờ trước",
  },
  {
    id: 3,
    title: "Review laptop gaming mới nhất 2024",
    author: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Máy tính",
    status: "published",
    views: 2345,
    replies: 45,
    createdAt: "1 ngày trước",
  },
  {
    id: 4,
    title: "Thảo luận về thị trường chứng khoán",
    author: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tài chính",
    status: "published",
    views: 1567,
    replies: 28,
    createdAt: "2 ngày trước",
  },
  {
    id: 5,
    title: "Góp ý về tính năng mới của diễn đàn",
    author: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Góp ý",
    status: "flagged",
    views: 432,
    replies: 15,
    createdAt: "3 ngày trước",
  },
  {
    id: 6,
    title: "Hướng dẫn cài đặt Windows 11",
    author: {
      name: "Vũ Thị F",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Máy tính",
    status: "published",
    views: 3210,
    replies: 52,
    createdAt: "4 ngày trước",
  },
  {
    id: 7,
    title: "Đánh giá điện thoại Samsung mới",
    author: {
      name: "Đào Văn G",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Công nghệ",
    status: "hidden",
    views: 876,
    replies: 23,
    createdAt: "5 ngày trước",
  },
];

const PostsPage = () => {
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
        <Button variant="outline">Lọc</Button>
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
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{post.title}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                        />
                        <AvatarFallback>
                          {post.author.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "published"
                        ? "default"
                        : post.status === "flagged"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {post.status === "published"
                      ? "Đã đăng"
                      : post.status === "flagged"
                      ? "Cần xem xét"
                      : "Đã ẩn"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <div>{post.views} lượt xem</div>
                    <div>{post.replies} phản hồi</div>
                  </div>
                </TableCell>
                <TableCell>{post.createdAt}</TableCell>
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
                      <DropdownMenuItem>Xem bài viết</DropdownMenuItem>
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem>Ghim bài viết</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Xoá bài viết
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PostsPage;
