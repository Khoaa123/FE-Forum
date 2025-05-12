"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationPage from "@/components/pagination/Pagination";
import { formatDate } from "@/utils/FormatDate";
import { toast } from "react-toastify";

type User = {
  id: string;
  displayName: string;
  userName: string;
  avatarUrl: string;
  joinedDate: string;
  role: string;
  status: string;
};

const UsersPage = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/GetAllUsers?page=${currentPage}&pageSize=10`
        );
        const data = await res.json();
        setUsers(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Không thể lấy danh sách người dùng", error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleChangeRole = async () => {
    if (!selectedUserId || !newRole) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/ChangeUserRole`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUserId, newRole }),
        }
      );

      if (!res.ok) throw new Error("Đổi quyền thất bại");

      toast.success("Cập nhật quyền thành công");
      setOpenDialog(false);

      const resUsers = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/GetAllUsers?page=${currentPage}&pageSize=10`
      );
      const data = await resUsers.json();
      setUsers(data.data);
      toast.success("Cập nhật quyền thành công");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý người dùng trong diễn đàn của bạn.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm người dùng..." className="pl-8" />
        </div>
        <Button variant="outline">Bộ lọc</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Quyền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user.displayName}
                      />
                      <AvatarFallback>
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        @{user.userName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role.toLowerCase() === "admin"
                        ? "default"
                        : user.role.toLowerCase() === "mod"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.role === "admin"
                      ? "Quản trị viên"
                      : user.role === "mod"
                      ? "Điều hành viên"
                      : "Người dùng"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active"
                        ? "default"
                        : user.status === "suspended"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {user.status === "active"
                      ? "Hoạt động"
                      : user.status === "suspended"
                      ? "Đã đình chỉ"
                      : "Không xác định"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.joinedDate)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Xem hồ sơ</DropdownMenuItem>
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setNewRole(user.role);
                          setOpenDialog(true);
                        }}
                      >
                        Đổi quyền
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Đình chỉ người dùng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Đổi quyền người dùng</DialogTitle>
                        <DialogDescription>
                          Bạn đang đổi quyền cho{" "}
                          <strong>{selectedUser?.displayName}</strong>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col gap-4">
                        <div>
                          <Label>Chọn quyền mới</Label>
                          <Select
                            value={newRole}
                            onValueChange={(value) => setNewRole(value)}
                          >
                            <SelectTrigger className="mt-1 focus-visible:ring-0">
                              <SelectValue placeholder="Chọn quyền" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">
                                Quản trị viên
                              </SelectItem>
                              <SelectItem value="Mod">
                                Điều hành viên
                              </SelectItem>
                              <SelectItem value="User">Người dùng</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                          >
                            Hủy
                          </Button>
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleChangeRole}
                          >
                            Xác nhận
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationPage totalPages={totalPages} pageNumber={currentPage} />
    </div>
  );
};

export default UsersPage;
