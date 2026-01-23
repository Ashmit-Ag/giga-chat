import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <Card className="bg-[#0f1424] border-white/10">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-white/80 font-bold uppercase">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
          <p className="text-[10px] text-white/30 mt-1">{subtitle}</p>
        </div>
        <div className="bg-indigo-500/10 p-3 rounded-xl">{icon}</div>
      </CardContent>
    </Card>
  );
}
