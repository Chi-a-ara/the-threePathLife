import { UserLayout } from "@/components/UserLayout";
import { Card } from "@/components/ui/card";

export default function Forum() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
        <Card className="p-6">
          <p className="text-gray-600">Forum content coming soon...</p>
        </Card>
      </div>
    </UserLayout>
  );
}
