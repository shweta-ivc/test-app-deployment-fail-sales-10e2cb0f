'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  User, 
  Bot, 
  Clock, 
  MessageSquare, 
  Zap, 
  AlertCircle,
  Trash2,
  Edit
} from 'lucide-react';
import axios from 'axios';

export default function ChatInteractionDetail({ id }) {
  const router = useRouter();
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/chat-interactions/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setInteraction(response.data);
      } catch (err) {
        setError('Failed to load chat interaction');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInteraction();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/chat-interactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      router.push('/chat-interactions');
    } catch (err) {
      setError('Failed to delete chat interaction');
      console.error(err);
    }
  };

  const handleEdit = () => {
    router.push(`/chat-interactions/${id}/edit`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Chat interaction not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/chat-interactions')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interactions
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Chat Interaction #{interaction.id}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {interaction.topic || 'No topic specified'}
              </p>
            </div>
            <Badge variant={interaction.status === 'resolved' ? 'default' : 'secondary'}>
              {interaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">User:</span>
              <span>{interaction.user_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-gray-500" />
              <span className="font-medium">AI Model:</span>
              <span>{interaction.ai_model || 'GPT-4'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Created:</span>
              <span>{formatDate(interaction.created_at)}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              Interaction Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {interaction.summary || 'No summary available for this interaction.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Conversation History</h3>
            <div className="space-y-4">
              {interaction.messages && interaction.messages.length > 0 ? (
                interaction.messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-50 border border-blue-100' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full ${
                        message.sender === 'user' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.sender === 'user' ? 'User' : 'Assistant'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No conversation history available.</p>
              )}
            </div>
          </div>

          {interaction.feedback && (
            <div>
              <h3 className="font-medium mb-3">User Feedback</h3>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-full bg-green-100 text-green-600">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">Feedback</span>
                      <Badge variant="outline" className="text-xs">
                        {interaction.feedback.rating}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {interaction.feedback.comment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}