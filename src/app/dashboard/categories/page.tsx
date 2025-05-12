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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Edit,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Đại sảnh",
    slug: "dai-sanh",
    description: "Thông báo, góp ý và tin tức chung",
    threads: 245,
    posts: 1245,
    subcategories: [
      { id: 101, name: "Thông báo", threads: 45, posts: 120 },
      { id: 102, name: "Góp ý", threads: 78, posts: 325 },
      { id: 103, name: "Tin tức iNet", threads: 122, posts: 800 },
    ],
  },
  {
    id: 2,
    name: "Máy tính",
    slug: "may-tinh",
    description: "Thảo luận về máy tính, phần cứng, phần mềm",
    threads: 532,
    posts: 3245,
    subcategories: [
      { id: 201, name: "Tư vấn cấu hình", threads: 145, posts: 920 },
      { id: 202, name: "Overclocking & Cooling", threads: 87, posts: 425 },
      { id: 203, name: "AMD", threads: 102, posts: 600 },
      { id: 204, name: "Intel", threads: 98, posts: 580 },
      { id: 205, name: "GPU & Màn hình", threads: 100, posts: 720 },
    ],
  },
  {
    id: 3,
    name: "Điện thoại",
    slug: "dien-thoai",
    description: "Thảo luận về điện thoại di động, tablet",
    threads: 432,
    posts: 2145,
    subcategories: [
      { id: 301, name: "Android", threads: 145, posts: 920 },
      { id: 302, name: "iOS", threads: 87, posts: 425 },
      { id: 303, name: "Windows Phone", threads: 22, posts: 100 },
      { id: 304, name: "Phụ kiện", threads: 78, posts: 700 },
    ],
  },
  {
    id: 4,
    name: "Đời sống",
    slug: "doi-song",
    description: "Thảo luận về đời sống, xã hội",
    threads: 332,
    posts: 1845,
    subcategories: [
      { id: 401, name: "Chuyện trò linh tinh", threads: 145, posts: 920 },
      { id: 402, name: "Ẩm thực", threads: 87, posts: 425 },
      { id: 403, name: "Du lịch", threads: 100, posts: 500 },
    ],
  },
];

const CategoriesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="text-muted-foreground">
            Quản lý danh mục và danh mục con của diễn đàn
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
              <DialogDescription>
                Tạo một danh mục mới cho diễn đàn của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input id="name" placeholder="Tên danh mục" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Tạo danh mục
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Chế độ lưới</TabsTrigger>
            <TabsTrigger value="table">Chế độ bảng</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-8" />
            </div>
          </div>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa danh mục
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa danh mục
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Subcategories:</div>
                    <ul className="space-y-1 text-sm">
                      {category.subcategories.map((subcategory) => (
                        <li
                          key={subcategory.id}
                          className="flex items-center justify-between"
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {subcategory.threads} threads, {subcategory.posts}{" "}
                            posts
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                    <span>Total: {category.threads} threads</span>
                    <span>{category.posts} posts</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <div className="flex items-center gap-1">
                      Tên
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Danh mục con</TableHead>
                  <TableHead>Chủ đề</TableHead>
                  <TableHead>Bài viết</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.subcategories.length}</TableCell>
                    <TableCell>{category.threads}</TableCell>
                    <TableCell>{category.posts}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa danh mục
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa danh mục
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
};

export default CategoriesPage;
