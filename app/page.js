'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, MessageCircle, BarChart3, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInteractions: 0,
    activeUsers: 0,
    todayInteractions: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch chat interaction stats
        const { count: totalInteractions, error: totalError } = await supabase
          .from('chat_interactions')
          .select('*', { count: 'exact', head: true });

        // Fetch today's interactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayInteractions, error: todayError } = await supabase
          .from('chat_interactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        if (!totalError && !todayError) {
          setStats({
            totalInteractions: totalInteractions || 0,
            activeUsers: 12, // Placeholder - would come from user analytics in real implementation
            todayInteractions: todayInteractions || 0,
            avgResponseTime: 2.4 // Placeholder - would come from analytics in real implementation
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your chat interaction analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInteractions}</div>
            <p className="text-xs text-muted-foreground">All recorded chat sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently engaged users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Interactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayInteractions}</div>
            <p className="text-xs text-muted-foreground">Interactions recorded today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Chat Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Customer Support</p>
                  <p className="text-sm text-gray-500">John Doe - 2 minutes ago</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/chat-interactions')}>
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Product Inquiry</p>
                  <p className="text-sm text-gray-500">Jane Smith - 15 minutes ago</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/chat-interactions')}>
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Technical Help</p>
                  <p className="text-sm text-gray-500">Robert Johnson - 1 hour ago</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/chat-interactions')}>
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => router.push('/chat-interactions')}>
              View All Interactions
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/chat-interactions/new')}>
              Create New Interaction
            </Button>
            <Button className="w-full" variant="outline">
              Export Analytics
            </Button>
            <Button className="w-full" variant="outline">
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}