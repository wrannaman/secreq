"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/toast-provider';
import { createClient } from '@/utils/supabase/client';
import {
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Trash2,
  Search,
  Download,
  Eye,
  Clock,
  Database,
  MoreHorizontal,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function DatasetFileViewer({ datasetId, datasetName, onFileDeleted }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileChunks, setFileChunks] = useState([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (datasetId) {
      fetchFiles();
    }
  }, [datasetId]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('dataset_files')
        .select(`
          *,
          document_chunks (count)
        `)
        .eq('dataset_id', datasetId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      toast.error('Failed to load files', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId, fileName) => {
    try {
      // Delete file and all associated chunks (CASCADE will handle this)
      const { error } = await supabase
        .from('dataset_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => prev.filter(f => f.id !== fileId));
      onFileDeleted?.();

      toast.success('File deleted', {
        description: `${fileName} and all its content chunks have been removed`
      });
    } catch (error) {
      toast.error('Failed to delete file', {
        description: error.message
      });
    }
  };

  const viewFileDetails = async (file) => {
    setSelectedFile(file);
    setChunksLoading(true);

    try {
      const { data: chunks, error } = await supabase
        .from('document_chunks')
        .select('*')
        .eq('file_id', file.id)
        .order('chunk_index', { ascending: true });

      if (error) throw error;
      setFileChunks(chunks || []);
    } catch (error) {
      toast.error('Failed to load file details', {
        description: error.message
      });
      setFileChunks([]);
    } finally {
      setChunksLoading(false);
    }
  };

  const resetStuckFiles = async () => {
    try {
      // Find files that have been processing for more than 10 minutes
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      const { data: stuckFiles, error: findError } = await supabase
        .from('dataset_files')
        .select('id, name')
        .eq('dataset_id', datasetId)
        .eq('status', 'processing')
        .lt('created_at', tenMinutesAgo.toISOString());

      if (findError) throw findError;

      if (stuckFiles && stuckFiles.length > 0) {
        const { error: updateError } = await supabase
          .from('dataset_files')
          .update({ status: 'failed' })
          .in('id', stuckFiles.map(f => f.id));

        if (updateError) throw updateError;

        // Refresh the file list
        await fetchFiles();

        toast.info('Reset stuck files', {
          description: `${stuckFiles.length} file(s) were stuck in processing and have been marked as failed`
        });
      }
    } catch (error) {
      console.error('Failed to reset stuck files:', error);
    }
  };

  // Auto-reset stuck files when component loads
  useEffect(() => {
    if (datasetId) {
      const timer = setTimeout(() => {
        resetStuckFiles();
      }, 2000); // Wait 2 seconds after component loads

      return () => clearTimeout(timer);
    }
  }, [datasetId]);

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type?.includes('spreadsheet') || type?.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    if (type?.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Processed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Files in {datasetName}
            </CardTitle>
            <CardDescription>
              {files.length} file(s) • {files.reduce((sum, f) => sum + (f.document_chunks?.[0]?.count || 0), 0)} content chunks
            </CardDescription>
          </div>
          {files.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8">
            <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No files uploaded</h3>
            <p className="text-muted-foreground">
              Upload your first document to start building this knowledge base
            </p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No files found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => {
              const chunkCount = file.document_chunks?.[0]?.count || 0;

              return (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  {getFileIcon(file.file_type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      {getStatusBadge(file.status)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {chunkCount} chunks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(file.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && chunkCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Ready for AI
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewFileDetails(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFile(file.id, file.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* File Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFile && getFileIcon(selectedFile.file_type)}
              {selectedFile?.name}
            </DialogTitle>
            <DialogDescription>
              File details and content chunks
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-6">
              {/* File Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">File Name</label>
                      <p className="text-sm">{selectedFile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">File Size</label>
                      <p className="text-sm">{formatFileSize(selectedFile.file_size)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">File Type</label>
                      <p className="text-sm">{selectedFile.file_type || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedFile.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                      <p className="text-sm">{new Date(selectedFile.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Content Chunks</label>
                      <p className="text-sm">{fileChunks.length} chunks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Chunks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Chunks</CardTitle>
                  <CardDescription>
                    Text chunks extracted from this file for AI processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {chunksLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Loading chunks...</p>
                    </div>
                  ) : fileChunks.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-2">No chunks found</h3>
                      <p className="text-muted-foreground">
                        This file hasn't been processed yet or failed to process
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fileChunks.map((chunk, index) => (
                        <div key={chunk.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Chunk {index + 1}</span>
                            <Badge variant="outline" className="text-xs">
                              {chunk.content.length} characters
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">{chunk.content}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
