"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/toast-provider';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  MessageCircle,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react';
import { ChatInterface } from './chat-interface';
import { CitationsViewer } from './citations-viewer';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-gray-500' },
  { value: 'needs_sme', label: 'Needs SME', icon: AlertTriangle, color: 'bg-amber-500' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', icon: X, color: 'bg-red-500' }
];

export function AnswerWorkshop({
  questionnaireId,
  items = [],
  onItemUpdate,
  onBulkUpdate,
  selectedDatasets = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { toast } = useToast();

  // Keyboard shortcuts
  useHotkeys('ctrl+f', (e) => {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  });

  useHotkeys('escape', () => {
    setEditingCell(null);
    setEditValue('');
  });

  useHotkeys('enter', () => {
    if (editingCell) {
      saveEdit();
    }
  });

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !item.question?.toLowerCase().includes(query) &&
        !item.draft_answer?.toLowerCase().includes(query) &&
        !item.final_answer?.toLowerCase().includes(query) &&
        !item.section?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Confidence filter
    if (confidenceFilter !== 'all') {
      if (confidenceFilter === 'low' && (item.confidence_score || 0) >= 0.7) return false;
      if (confidenceFilter === 'medium' && ((item.confidence_score || 0) < 0.4 || (item.confidence_score || 0) >= 0.8)) return false;
      if (confidenceFilter === 'high' && (item.confidence_score || 0) < 0.8) return false;
    }

    return true;
  });

  const handleCellEdit = (itemId, field, value) => {
    setEditingCell({ itemId, field });
    setEditValue(value || '');
  };

  const saveEdit = useCallback(() => {
    if (!editingCell) return;

    const { itemId, field } = editingCell;
    onItemUpdate?.(itemId, { [field]: editValue });
    setEditingCell(null);
    setEditValue('');

    toast.success('Cell updated', {
      description: 'Changes have been saved.'
    });
  }, [editingCell, editValue, onItemUpdate, toast]);

  const handleStatusChange = (itemId, newStatus) => {
    onItemUpdate?.(itemId, { status: newStatus });
    toast.success('Status updated', {
      description: `Item marked as ${newStatus}.`
    });
  };

  const handleBulkStatusChange = (newStatus) => {
    const itemIds = Array.from(selectedItems);
    onBulkUpdate?.(itemIds, { status: newStatus });
    setSelectedItems(new Set());

    toast.success('Bulk update completed', {
      description: `${itemIds.length} items updated to ${newStatus}.`
    });
  };

  const toggleItemSelection = (itemId) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    setSelectedItems(new Set(filteredItems.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getConfidenceColor = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    if (statusOption) {
      const Icon = statusOption.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="flex h-screen">
      {/* Main Workshop Area */}
      <div className={`flex-1 flex flex-col ${chatOpen ? 'mr-96' : ''}`}>
        {/* Header */}
        <Card className="border-b rounded-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Answer Workshop
                <Badge variant="outline">{filteredItems.length} items</Badge>
              </CardTitle>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChatOpen(!chatOpen)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4 pt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Search questions, answers, sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm rounded-md"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm rounded-md"
              >
                <option value="all">All Confidence</option>
                <option value="low">Low (&lt; 70%)</option>
                <option value="medium">Medium (70-80%)</option>
                <option value="high">High (&gt; 80%)</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedItems.size} items selected
                </span>

                <div className="flex items-center gap-2">
                  {STATUS_OPTIONS.map(status => (
                    <Button
                      key={status.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange(status.value)}
                    >
                      {getStatusIcon(status.value)}
                      <span className="ml-1">{status.label}</span>
                    </Button>
                  ))}

                  <Separator orientation="vertical" className="h-6" />

                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="sticky top-0 bg-background border-b grid grid-cols-12 gap-1 p-2 text-sm font-medium">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                  onChange={() => selectedItems.size === filteredItems.length ? clearSelection() : selectAll()}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
              <div className="col-span-3">Question</div>
              <div className="col-span-3">Draft Answer</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Confidence</div>
              <div className="col-span-1">Section</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Data Rows */}
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-12 gap-1 p-2 border-b hover:bg-muted/50 ${selectedItems.has(item.id) ? 'bg-primary/5' : ''
                  }`}
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                {/* Question */}
                <div className="col-span-3 text-sm">
                  <div className="font-medium truncate" title={item.question}>
                    {item.question}
                  </div>
                  {item.row_number && (
                    <div className="text-xs text-muted-foreground">
                      Row {item.row_number}
                    </div>
                  )}
                </div>

                {/* Draft Answer */}
                <div className="col-span-3">
                  {editingCell?.itemId === item.id && editingCell?.field === 'draft_answer' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-sm"
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={saveEdit}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCell(null)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="text-sm cursor-pointer hover:bg-muted p-1 rounded min-h-[24px]"
                      onClick={() => handleCellEdit(item.id, 'draft_answer', item.draft_answer)}
                      title={item.draft_answer}
                    >
                      {item.draft_answer ? (
                        <span className="truncate">{item.draft_answer}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Click to add answer</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <select
                    value={item.status || 'pending'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="text-sm border border-input bg-background px-2 py-1 rounded w-full"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Confidence */}
                <div className="col-span-1">
                  {item.confidence_score !== null && (
                    <Badge className={`text-xs ${getConfidenceColor(item.confidence_score)}`}>
                      {Math.round((item.confidence_score || 0) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Section */}
                <div className="col-span-1 text-sm truncate" title={item.section}>
                  {item.section}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(item);
                      setCitationsOpen(true);
                    }}
                    title="View citations"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCellEdit(item.id, 'draft_answer', item.draft_answer)}
                    title="Edit answer"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || confidenceFilter !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'Upload a questionnaire to get started.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {chatOpen && (
        <div className="w-96 border-l bg-background">
          <ChatInterface
            questionnaireId={questionnaireId}
            selectedDatasets={selectedDatasets}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}

      {/* Citations Viewer Modal */}
      {citationsOpen && selectedItem && (
        <CitationsViewer
          item={selectedItem}
          onClose={() => {
            setCitationsOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
