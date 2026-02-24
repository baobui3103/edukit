import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Stamp, Type } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          Chào mừng thầy cô trở lại
        </h1>
        <p className="text-muted-foreground mt-2">
          Bắt đầu công việc giảng dạy hiệu quả hơn với EduKit.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* PDF Stamper Card */}
        <Link href="/tools/pdf-stamper">
          <Card className="border-2 shadow-sm bg-card hover:bg-accent transition-colors cursor-pointer group h-full">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-2">
                <Stamp className="w-6 h-6 text-primary group-hover:text-primary" />
              </div>
              <CardTitle className="group-hover:text-foreground">
                Chèn dấu PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Thêm nội dung văn bản vào hàng loạt trang PDF một cách nhanh chóng
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Luyện chữ Card */}
        <Link href="/tools/tao-bai-luyen-chu">
          <Card className="border-2 shadow-sm bg-card hover:bg-accent transition-colors cursor-pointer group h-full">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-2">
                <Type className="w-6 h-6 text-primary group-hover:text-primary" />
              </div>
              <CardTitle className="group-hover:text-foreground">
                Tạo bài luyện chữ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Sinh văn bản luyện viết tiểu học chuẩn font 4 hàng từ câu chữ bình thường
              </p>
            </CardContent>
          </Card>
        </Link>

       
      </section>
    </div>
  );
}
