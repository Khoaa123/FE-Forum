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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";

const reports = [
  {
    id: 1,
    content: "Nội dung vi phạm quy định diễn đàn",
    reporter: {
      name: "Nguyen Van A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Tran Van X",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "2 giờ trước",
    type: "post",
    reason: "Spam",
    contentPreview:
      "Nội dung bài viết vi phạm quy định về spam và quảng cáo trái phép...",
  },
  {
    id: 2,
    content: "Spam liên tục trong nhiều bài viết",
    reporter: {
      name: "Tran Thi B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Le Van Y",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "5 giờ trước",
    type: "user",
    reason: "Spam",
    contentPreview:
      "Người dùng này đã đăng nhiều bài viết quảng cáo trong nhiều mục khác nhau...",
  },
  {
    id: 3,
    content: "Nội dung quảng cáo trái phép",
    reporter: {
      name: "Le Van C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Pham Van Z",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "1 ngày trước",
    type: "post",
    reason: "Quảng cáo",
    contentPreview:
      "Bài viết chứa nội dung quảng cáo không được phép theo quy định diễn đàn...",
  },
  {
    id: 4,
    content: "Ngôn từ xúc phạm người khác",
    reporter: {
      name: "Pham Thi D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Hoang Van T",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "resolved",
    reportedAt: "2 ngày trước",
    type: "comment",
    reason: "Ngôn từ không phù hợp",
    contentPreview:
      "Bình luận có chứa ngôn từ xúc phạm và gây thù ghét với người khác...",
  },
  {
    id: 5,
    content: "Hình ảnh không phù hợp",
    reporter: {
      name: "Hoang Van E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Nguyen Van K",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "rejected",
    reportedAt: "3 ngày trước",
    type: "post",
    reason: "Nội dung không phù hợp",
    contentPreview:
      "Bài viết chứa hình ảnh không phù hợp với quy định của diễn đàn...",
  },
  {
    id: 6,
    content: "Bài viết trùng lặp nhiều lần",
    reporter: {
      name: "Vu Thi F",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedUser: {
      name: "Tran Van M",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "3 ngày trước",
    type: "post",
    reason: "Spam",
    contentPreview:
      "Người dùng đã đăng cùng một nội dung trong nhiều chủ đề khác nhau...",
  },
];

const reportStats = {
  total: 24,
  pending: 18,
  resolved: 4,
  rejected: 2,
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-muted-foreground">
            Quản lý và xử lý báo cáo từ người dùng
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số báo cáo
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang chờ xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">Tất cả báo cáo</TabsTrigger>
            <TabsTrigger value="pending">Đang chờ xử lý</TabsTrigger>
            <TabsTrigger value="resolved">Đã xử lý</TabsTrigger>
            <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm báo cáo..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Báo cáo</TableHead>
                  <TableHead>Người bị báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{report.content}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={report.reporter.avatar || "/placeholder.svg"}
                              alt={report.reporter.name}
                            />
                            <AvatarFallback>
                              {report.reporter.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>Báo cáo bởi {report.reporter.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              report.reportedUser.avatar || "/placeholder.svg"
                            }
                            alt={report.reportedUser.name}
                          />
                          <AvatarFallback>
                            {report.reportedUser.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{report.reportedUser.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {report.type === "post"
                          ? "Bài viết"
                          : report.type === "comment"
                          ? "Bình luận"
                          : report.type === "user"
                          ? "Người dùng"
                          : report.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "pending"
                            ? "warning"
                            : report.status === "resolved"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {report.status === "pending"
                          ? "Đang chờ"
                          : report.status === "resolved"
                          ? "Đã xử lý"
                          : report.status === "rejected"
                          ? "Đã từ chối"
                          : report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.reportedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                            <DropdownMenuItem>
                              Đánh dấu đã xử lý
                            </DropdownMenuItem>
                            <DropdownMenuItem>Từ chối báo cáo</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Cấm người dùng</DropdownMenuItem>
                            <DropdownMenuItem>Xóa nội dung</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Báo cáo</TableHead>
                  <TableHead>Người bị báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports
                  .filter((report) => report.status === "pending")
                  .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{report.content}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={
                                  report.reporter.avatar || "/placeholder.svg"
                                }
                                alt={report.reporter.name}
                              />
                              <AvatarFallback>
                                {report.reporter.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>Báo cáo bởi {report.reporter.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={
                                report.reportedUser.avatar || "/placeholder.svg"
                              }
                              alt={report.reportedUser.name}
                            />
                            <AvatarFallback>
                              {report.reportedUser.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{report.reportedUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type === "post"
                            ? "Bài viết"
                            : report.type === "comment"
                            ? "Bình luận"
                            : report.type === "user"
                            ? "Người dùng"
                            : report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.reportedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Xem</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                              <DropdownMenuItem>
                                Đánh dấu đã xử lý
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Từ chối báo cáo
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Cấm người dùng
                              </DropdownMenuItem>
                              <DropdownMenuItem>Xóa nội dung</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Báo cáo</TableHead>
                  <TableHead>Người bị báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports
                  .filter((report) => report.status === "resolved")
                  .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{report.content}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={
                                  report.reporter.avatar || "/placeholder.svg"
                                }
                                alt={report.reporter.name}
                              />
                              <AvatarFallback>
                                {report.reporter.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>Báo cáo bởi {report.reporter.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={
                                report.reportedUser.avatar || "/placeholder.svg"
                              }
                              alt={report.reportedUser.name}
                            />
                            <AvatarFallback>
                              {report.reportedUser.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{report.reportedUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type === "post"
                            ? "Bài viết"
                            : report.type === "comment"
                            ? "Bình luận"
                            : report.type === "user"
                            ? "Người dùng"
                            : report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.reportedAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Báo cáo</TableHead>
                  <TableHead>Người bị báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports
                  .filter((report) => report.status === "rejected")
                  .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{report.content}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={
                                  report.reporter.avatar || "/placeholder.svg"
                                }
                                alt={report.reporter.name}
                              />
                              <AvatarFallback>
                                {report.reporter.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>Báo cáo bởi {report.reporter.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={
                                report.reportedUser.avatar || "/placeholder.svg"
                              }
                              alt={report.reportedUser.name}
                            />
                            <AvatarFallback>
                              {report.reportedUser.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{report.reportedUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type === "post"
                            ? "Bài viết"
                            : report.type === "comment"
                            ? "Bình luận"
                            : report.type === "user"
                            ? "Người dùng"
                            : report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.reportedAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
