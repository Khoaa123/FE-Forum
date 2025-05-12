import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentUsers = [
  {
    id: 1,
    name: "Nguyen Van A",
    username: "nguyenvana",
    email: "nguyenvana@example.com",
    status: "active",
    joinedAt: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Tran Thi B",
    username: "tranthib",
    email: "tranthib@example.com",
    status: "active",
    joinedAt: "5 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Le Van C",
    username: "levanc",
    email: "levanc@example.com",
    status: "active",
    joinedAt: "1 day ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Pham Thi D",
    username: "phamthid",
    email: "phamthid@example.com",
    status: "active",
    joinedAt: "2 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Hoang Van E",
    username: "hoangvane",
    email: "hoangvane@example.com",
    status: "active",
    joinedAt: "3 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const RecentUsers = () => {
  return (
    <div className="space-y-4">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <Badge variant="outline" className="text-xs">
                New
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
          <div className="text-xs text-muted-foreground">{user.joinedAt}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentUsers;
