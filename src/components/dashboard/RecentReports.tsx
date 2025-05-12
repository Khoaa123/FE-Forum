import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentReports = [
  {
    id: 1,
    content: "Nội dung vi phạm quy định diễn đàn",
    reporter: {
      name: "Nguyen Van A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "1 hour ago",
    type: "post",
  },
  {
    id: 2,
    content: "Spam liên tục trong nhiều bài viết",
    reporter: {
      name: "Tran Thi B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "3 hours ago",
    type: "user",
  },
  {
    id: 3,
    content: "Nội dung quảng cáo trái phép",
    reporter: {
      name: "Le Van C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "5 hours ago",
    type: "post",
  },
  {
    id: 4,
    content: "Ngôn từ xúc phạm người khác",
    reporter: {
      name: "Pham Thi D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "1 day ago",
    type: "comment",
  },
  {
    id: 5,
    content: "Hình ảnh không phù hợp",
    reporter: {
      name: "Hoang Van E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    reportedAt: "1 day ago",
    type: "post",
  },
];

const RecentReports = () => {
  return (
    <div className="space-y-4">
      {recentReports.map((report) => (
        <div key={report.id} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={report.reporter.avatar || "/placeholder.svg"}
              alt={report.reporter.name}
            />
            <AvatarFallback>
              {report.reporter.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{report.content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Reported by {report.reporter.name}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs capitalize">
                {report.type}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs text-muted-foreground">
              {report.reportedAt}
            </div>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
              Review
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentReports;
