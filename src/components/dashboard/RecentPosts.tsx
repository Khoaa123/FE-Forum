import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentPosts = [
  {
    id: 1,
    title: "Thảo luận về công nghệ mới",
    author: {
      name: "Nguyen Van A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Công nghệ",
    createdAt: "30 minutes ago",
    replies: 12,
  },
  {
    id: 2,
    title: "Chia sẻ kinh nghiệm du lịch Đà Nẵng",
    author: {
      name: "Tran Thi B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Du lịch",
    createdAt: "2 hours ago",
    replies: 8,
  },
  {
    id: 3,
    title: "Review laptop gaming mới nhất 2024",
    author: {
      name: "Le Van C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Máy tính",
    createdAt: "5 hours ago",
    replies: 15,
  },
  {
    id: 4,
    title: "Thảo luận về thị trường chứng khoán",
    author: {
      name: "Pham Thi D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tài chính",
    createdAt: "1 day ago",
    replies: 20,
  },
  {
    id: 5,
    title: "Góp ý về tính năng mới của diễn đàn",
    author: {
      name: "Hoang Van E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Góp ý",
    createdAt: "1 day ago",
    replies: 5,
  },
];

const RecentPosts = () => {
  return (
    <div className="space-y-4">
      {recentPosts.map((post) => (
        <div key={post.id} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
            />
            <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{post.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{post.author.name}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium">{post.replies} replies</div>
            <div className="text-xs text-muted-foreground">
              {post.createdAt}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
