'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MessageSquare, Calendar, Clock, User, Bot } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatInteractionDetailPage() {
  const { id } = useParams();
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        const response = await fetch(`/api/chat-interactions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chat interaction');
        }
        const data = await response.json();
        setInteraction(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInteraction();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!interaction) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Chat interaction not found</AlertDescription>
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat Interaction Details</h1>
          <p className="text-gray-600">View detailed information about this chat interaction</p>
        </div>
        <Button onClick={() => window.history.back()}>Back to List</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interaction #{interaction.id}
            </CardTitle>
            <Badge className={getStatusColor(interaction.status)}>
              {interaction.status.charAt(0).toUpperCase() + interaction.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{interaction.user_name || 'Anonymous'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">AI Model</p>
                <p className="font-medium">{interaction.ai_model || 'Default Model'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(interaction.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {interaction.duration ? formatDuration(interaction.duration) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Conversation</h3>
            <div className="space-y-4">
              {interaction.messages && interaction.messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-50 border border-blue-100' 
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-full ${
                      msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {msg.role === 'user' ? 'User' : 'Assistant'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {interaction.error_message && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Error Details</h3>
                <Alert variant="destructive">
                  <AlertDescription>{interaction.error_message}</AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}