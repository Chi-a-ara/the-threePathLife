import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Personal() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personal</h1>
          <p className="text-gray-600 mt-2">Your personal destiny matrix and insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Dashboard</CardTitle>
            <CardDescription>Content coming soon...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This section will display your personal matrix, life path numbers, and personalized insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
