"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/toast-provider';
import { createClient } from '@/utils/supabase/client';
import { AnswerWorkshop } from '@/components/workshop/answer-workshop';
import { generateAnswer } from '@/lib/rag';

export default function WorkshopPage() {
  const params = useParams();
  const questionnaireId = params.id;
  const [questionnaire, setQuestionnaire] = useState(null);
  const [items, setItems] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentOrganization } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (questionnaireId && currentOrganization) {
      loadQuestionnaire();
    }
  }, [questionnaireId, currentOrganization]);

  const loadQuestionnaire = async () => {
    try {
      // Load questionnaire details
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('id', questionnaireId)
        .eq('organization_id', currentOrganization.org_id)
        .single();

      if (questionnaireError) throw questionnaireError;
      setQuestionnaire(questionnaireData);

      // Load questionnaire items
      const { data: itemsData, error: itemsError } = await supabase
        .from('questionnaire_items')
        .select('*')
        .eq('questionnaire_id', questionnaireId)
        .order('row_number', { ascending: true });

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Load selected datasets
      if (questionnaireData.selected_datasets?.length > 0) {
        const { data: datasetsData, error: datasetsError } = await supabase
          .from('datasets')
          .select('*')
          .in('id', questionnaireData.selected_datasets);

        if (datasetsError) throw datasetsError;
        setDatasets(datasetsData || []);
      }

    } catch (error) {
      console.error('Failed to load questionnaire:', error);
      toast.error('Failed to load questionnaire', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = async (itemId, updates) => {
    try {
      // Optimistically update the local state
      setItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, ...updates, updated_at: new Date().toISOString() }
            : item
        )
      );

      // Update in database
      const { error } = await supabase
        .from('questionnaire_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Create version history if answer was updated
      if (updates.draft_answer || updates.final_answer) {
        const item = items.find(i => i.id === itemId);
        if (item) {
          await supabase
            .from('item_versions')
            .insert({
              questionnaire_item_id: itemId,
              version_number: (item.version_number || 0) + 1,
              answer: updates.draft_answer || updates.final_answer,
              confidence_score: updates.confidence_score || item.confidence_score,
              citations: updates.citations || item.citations || [],
              changed_by: currentOrganization.user_id
            });
        }
      }

      // Log the change
      await supabase
        .from('audit_logs')
        .insert({
          organization_id: currentOrganization.org_id,
          user_id: currentOrganization.user_id,
          action: 'update_questionnaire_item',
          resource_type: 'questionnaire_item',
          resource_id: itemId,
          details: {
            questionnaire_id: questionnaireId,
            updates: Object.keys(updates)
          }
        });

    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item', {
        description: error.message
      });

      // Revert optimistic update
      loadQuestionnaire();
    }
  };

  const handleBulkUpdate = async (itemIds, updates) => {
    try {
      // Optimistically update local state
      setItems(prev =>
        prev.map(item =>
          itemIds.includes(item.id)
            ? { ...item, ...updates, updated_at: new Date().toISOString() }
            : item
        )
      );

      // Update in database
      const { error } = await supabase
        .from('questionnaire_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', itemIds);

      if (error) throw error;

      // Log the bulk change
      await supabase
        .from('audit_logs')
        .insert({
          organization_id: currentOrganization.org_id,
          user_id: currentOrganization.user_id,
          action: 'bulk_update_questionnaire_items',
          resource_type: 'questionnaire_item',
          resource_id: questionnaireId,
          details: {
            questionnaire_id: questionnaireId,
            item_count: itemIds.length,
            updates: Object.keys(updates)
          }
        });

    } catch (error) {
      console.error('Failed to bulk update items:', error);
      toast.error('Failed to bulk update items', {
        description: error.message
      });

      // Revert optimistic update
      loadQuestionnaire();
    }
  };

  const handleGenerateAnswer = async (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item || !item.question) return;

    try {
      toast.success('Generating answer...', {
        description: 'AI is analyzing your datasets to create an answer.'
      });

      const supabase = createClient()
      const result = await generateAnswer(
        item.question,
        datasets,
        questionnaireId,
        supabase,
        user?.id
      );

      await handleItemUpdate(itemId, {
        draft_answer: result.answer,
        confidence_score: result.confidence,
        citations: result.citations,
        status: result.confidence > 0.8 ? 'approved' : 'needs_sme'
      });

      toast.success('Answer generated', {
        description: `Generated with ${Math.round(result.confidence * 100)}% confidence.`
      });

    } catch (error) {
      console.error('Failed to generate answer:', error);
      toast.error('Failed to generate answer', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="font-medium text-lg mb-2">Loading Questionnaire</h3>
            <p className="text-muted-foreground">
              Preparing your workspace...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="font-medium text-lg mb-2">Questionnaire Not Found</h3>
            <p className="text-muted-foreground">
              The questionnaire you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AnswerWorkshop
      questionnaireId={questionnaireId}
      items={items}
      onItemUpdate={handleItemUpdate}
      onBulkUpdate={handleBulkUpdate}
      selectedDatasets={datasets}
      onGenerateAnswer={handleGenerateAnswer}
    />
  );
}
