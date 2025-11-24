import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Shield,
  Users,
  DollarSign,
  Activity,
  Plus,
  Minus,
  RefreshCw,
  Download,
  MapPin,
  Phone,
  Mail,
  Globe,
  Eye,
} from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [creditAmount, setCreditAmount] = useState("");

  // Redirect if not admin
  if (!loading && user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: users, refetch: refetchUsers } = trpc.admin.listUsers.useQuery();
  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: payments } = trpc.admin.listPayments.useQuery();
  const { data: osintData } = trpc.admin.exportUserData.useQuery();

  const addCreditsMutation = trpc.admin.addCredits.useMutation({
    onSuccess: () => {
      toast.success("Credits added successfully!");
      refetchUsers();
      setCreditAmount("");
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add credits");
    },
  });

  const removeCreditsMutation = trpc.admin.removeCredits.useMutation({
    onSuccess: () => {
      toast.success("Credits removed successfully!");
      refetchUsers();
      setCreditAmount("");
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove credits");
    },
  });

  const handleAddCredits = (userId: number) => {
    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }
    addCreditsMutation.mutate({ userId, amount });
  };

  const handleRemoveCredits = (userId: number) => {
    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }
    removeCreditsMutation.mutate({ userId, amount });
  };

  const handleExportOSINT = () => {
    if (!osintData) return;
    
    const csv = [
      ["ID", "Full Name", "Email", "Phone", "IP Address", "Country", "City", "User Agent", "Registered At", "Last Seen", "Role", "Credits"].join(","),
      ...osintData.map(user =>
        [
          user.id,
          `"${user.fullName}"`,
          `"${user.email}"`,
          `"${user.phone}"`,
          `"${user.ipAddress}"`,
          `"${user.country}"`,
          `"${user.city}"`,
          `"${user.userAgent}"`,
          new Date(user.registeredAt).toISOString(),
          new Date(user.lastSeen).toISOString(),
          user.role,
          user.credits,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("OSINT data exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.12_0.04_290)] to-[oklch(0.08_0.02_270)]">
      {/* Header */}
      <header className="border-b border-primary/10 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Control Panel</h1>
              <Badge variant="destructive">Owner Only</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportOSINT}>
                <Download className="h-4 w-4 mr-2" />
                Export OSINT Data
              </Button>
              <Button variant="outline" onClick={() => setLocation("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{((stats?.totalRevenue || 0) / 100).toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matrices</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMatrices || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="osint">OSINT Intelligence</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user credits and view account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name || "N/A"}</TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">{user.credits}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {selectedUserId === user.id ? (
                              <div className="flex gap-2 items-center">
                                <Input
                                  type="number"
                                  placeholder="Amount"
                                  value={creditAmount}
                                  onChange={(e) => setCreditAmount(e.target.value)}
                                  className="w-24"
                                />
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleAddCredits(user.id)}
                                  disabled={addCreditsMutation.isPending}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveCredits(user.id)}
                                  disabled={removeCreditsMutation.isPending}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedUserId(null);
                                    setCreditAmount("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                Manage Credits
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OSINT Intelligence Tab */}
          <TabsContent value="osint">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  OSINT Intelligence Dashboard
                </CardTitle>
                <CardDescription>
                  Advanced user tracking and geolocation data for investigative journalism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email
                        </TableHead>
                        <TableHead>
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone
                        </TableHead>
                        <TableHead>
                          <Globe className="h-4 w-4 inline mr-1" />
                          IP Address
                        </TableHead>
                        <TableHead>
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Location
                        </TableHead>
                        <TableHead>Last Seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                          <TableCell className="text-xs">{user.email || "N/A"}</TableCell>
                          <TableCell>{user.phone || "N/A"}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {user.ipAddress || "N/A"}
                          </TableCell>
                          <TableCell>
                            {user.city && user.country ? (
                              <div className="text-xs">
                                <div className="font-medium">{user.city}</div>
                                <div className="text-muted-foreground">{user.country}</div>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {new Date(user.lastSignedIn).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all transactions and payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments?.map((payment: any) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell>{payment.userId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.type}</Badge>
                          </TableCell>
                          <TableCell>
                            €{(payment.amount / 100).toFixed(2)} {payment.currency}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : payment.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
