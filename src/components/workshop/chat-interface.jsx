"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/toast-provider';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import {
  Send,
  MessageCircle,
  Bot,
  User,
  X,
  Loader2,
  Sparkles,
  FileText,
  Copy,
  RefreshCw
} from 'lucide-react';
import { generateAnswer } from '@/lib/rag';

export function ChatInterface({ questionnaireId, selectedDatasets = [], onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadConversation();
  }, [questionnaireId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('questionnaire_id', questionnaireId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConversationId(data.id);
        setMessages(data.messages || []);
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            questionnaire_id: questionnaireId,
            user_id: user.id,
            messages: []
          })
          .select()
          .single();

        if (createError) throw createError;
        setConversationId(newConversation.id);
      }
    } catch (error) {
      toast.error('Failed to load conversation', {
        description: error.message
      });
    }
  };

  const saveConversation = async (newMessages) => {
    if (!conversationId) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({
          messages: newMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Generate AI response
      const supabase = createClient()
      const aiResponse = await generateAnswer(
        input.trim(),
        selectedDatasets,
        questionnaireId,
        supabase,
        user?.id
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse.answer,
        citations: aiResponse.citations,
        confidence: aiResponse.confidence,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      await saveConversation(finalMessages);

    } catch (error) {
      toast.error('Failed to generate response', {
        description: error.message
      });

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        error: true,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveConversation(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const clearConversation = async () => {
    try {
      setMessages([]);
      await saveConversation([]);
      toast.success('Conversation cleared');
    } catch (error) {
      toast.error('Failed to clear conversation');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {selectedDatasets.map((dataset) => (
            <Badge key={dataset.id} variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {dataset.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">AI Assistant Ready</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about the questionnaire, request answers for specific questions,
                or get help with sections.
              </p>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <p>Try asking:</p>
                <p>• "Generate an answer for row 5"</p>
                <p>• "Help with security controls section"</p>
                <p>• "What evidence is needed for SOC2?"</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-lg p-3 ${message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : message.error
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-muted'
                    }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                  {message.confidence && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {Math.round(message.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  )}

                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-medium">Sources:</div>
                      {message.citations.map((citation, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {citation.source} {citation.page && `(page ${citation.page})`}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>

                    {message.role === 'assistant' && !message.error && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>

              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about the questionnaire..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
