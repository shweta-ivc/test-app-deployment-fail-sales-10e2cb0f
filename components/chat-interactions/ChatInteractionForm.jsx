'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function ChatInteractionForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    user_id: initialData?.user_id || '',
    session_id: initialData?.session_id || '',
    user_message: initialData?.user_message || '',
    bot_response: initialData?.bot_response || '',
    interaction_type: initialData?.interaction_type || 'text',
    metadata: initialData?.metadata ? JSON.stringify(initialData.metadata) : '{}'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.user_id) {
      toast({
        title: "Validation Error",
        description: "User ID is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.session_id) {
      toast({
        title: "Validation Error",
        description: "Session ID is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.user_message) {
      toast({
        title: "Validation Error",
        description: "User message is required",
        variant: "destructive"
      });
      return false;
    }

    try {
      JSON.parse(formData.metadata);
    } catch (e) {
      toast({
        title: "Validation Error",
        description: "Metadata must be valid JSON",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        metadata: JSON.parse(formData.metadata)
      };

      await onSubmit(submissionData);

      toast({
        title: "Success",
        description: initialData 
          ? "Chat interaction updated successfully" 
          : "Chat interaction created successfully"
      });

      // Reset form only for new creation
      if (!initialData) {
        setFormData({
          user_id: '',
          session_id: '',
          user_message: '',
          bot_response: '',
          interaction_type: 'text',
          metadata: '{}'
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit chat interaction",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Chat Interaction" : "Create New Chat Interaction"}
        </CardTitle>
        <CardDescription>
          Fill in the details below to {initialData ? "update" : "create"} a chat interaction record
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User ID *</Label>
              <Input
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_id">Session ID *</Label>
              <Input
                id="session_id"
                name="session_id"
                value={formData.session_id}
                onChange={handleChange}
                placeholder="Enter session ID"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_message">User Message *</Label>
            <Textarea
              id="user_message"
              name="user_message"
              value={formData.user_message}
              onChange={handleChange}
              placeholder="Enter user's message"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot_response">Bot Response</Label>
            <Textarea
              id="bot_response"
              name="bot_response"
              value={formData.bot_response}
              onChange={handleChange}
              placeholder="Enter bot's response"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interaction_type">Interaction Type</Label>
              <select
                id="interaction_type"
                name="interaction_type"
                value={formData.interaction_type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="text">Text</option>
                <option value="button">Button</option>
                <option value="quick_reply">Quick Reply</option>
                <option value="image">Image</option>
                <option value="file">File</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Metadata (JSON)</Label>
              <Textarea
                id="metadata"
                name="metadata"
                value={formData.metadata}
                onChange={handleChange}
                placeholder='{"key": "value"}'
                rows={3}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Interaction" : "Create Interaction"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}