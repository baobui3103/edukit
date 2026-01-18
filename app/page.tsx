import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Chào mừng thầy cô trở lại
        </h1>
        <p className="text-slate-600 mt-2">
          Bắt đầu công việc giảng dạy hiệu quả hơn với EduKit.
        </p>
      </section>

      {/* Placeholder Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="border-dashed border-2 shadow-sm bg-slate-50 hover:bg-white transition-colors cursor-pointer group"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors mb-2">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
              </div>
              <CardTitle className="text-slate-500 group-hover:text-slate-800">
                Tính năng mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 text-center">
                Vị trí dành cho tính năng tương lai
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
