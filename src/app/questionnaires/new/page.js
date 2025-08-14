"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/toast-provider';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { UploadQuestionnaire } from '@/components/questionnaire/upload-questionnaire';
import { FieldMapping } from '@/components/questionnaire/field-mapping';
import { DatasetManager } from '@/components/dataset/dataset-manager';
import {
  Upload,
  Settings,
  Database,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const STEPS = [
  { id: 'upload', title: 'Upload Questionnaire', icon: Upload },
  { id: 'mapping', title: 'Field Mapping', icon: Settings },
  { id: 'datasets', title: 'Select Datasets', icon: Database },
  { id: 'processing', title: 'AI Processing', icon: Sparkles }
];

export default function NewQuestionnairePage() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [uploadData, setUploadData] = useState(null);
  const [fieldMapping, setFieldMapping] = useState({});
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [processing, setProcessing] = useState(false);
  const { currentOrganization } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleUpload = (data) => {
    setUploadData(data);
    setCurrentStep('mapping');
    toast.success('File uploaded successfully', {
      description: `${data.sheet.length} rows loaded for processing.`
    });
  };

  const handleMappingComplete = (mapping) => {
    setFieldMapping(mapping);
    setCurrentStep('datasets');
    toast.success('Field mapping completed', {
      description: 'Proceed to select your datasets.'
    });
  };

  const handleDatasetSelection = (datasets) => {
    setSelectedDatasets(datasets);
  };

  const handleProcessing = async () => {
    if (selectedDatasets.length === 0) {
      toast.error('No datasets selected', {
        description: 'Please select at least one dataset for AI processing.'
      });
      return;
    }

    setProcessing(true);
    setCurrentStep('processing');

    try {
      // Step 1: Create questionnaire record
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaires')
        .insert({
          organization_id: currentOrganization.org_id,
          name: uploadData.file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          original_file_name: uploadData.file.name,
          original_file_path: '', // Will be set after file upload
          field_mappings: fieldMapping,
          selected_datasets: selectedDatasets.map(d => d.id),
          status: 'processing'
        })
        .select()
        .single();

      if (questionnaireError) throw questionnaireError;

      // Step 2: Process questionnaire items
      const items = uploadData.sheet.map((row, index) => {
        const item = {
          questionnaire_id: questionnaire.id,
          row_number: index + 1,
          status: 'pending'
        };

        // Map fields based on field mapping
        Object.entries(fieldMapping).forEach(([column, systemField]) => {
          if (systemField && systemField !== 'ignore') {
            const value = row[column];
            if (value) {
              item[systemField] = String(value).trim();
            }
          }
        });

        return item;
      });

      // Insert questionnaire items
      const { error: itemsError } = await supabase
        .from('questionnaire_items')
        .insert(items);

      if (itemsError) throw itemsError;

      toast.success('Questionnaire created successfully', {
        description: `${items.length} questions ready for AI processing.`
      });

      // Redirect to workshop
      router.push(`/questionnaires/${questionnaire.id}/workshop`);

    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to create questionnaire', {
        description: error.message
      });
      setProcessing(false);
      setCurrentStep('datasets');
    }
  };

  const goBack = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'upload':
        return !!uploadData;
      case 'mapping':
        return Object.values(fieldMapping).includes('question');
      case 'datasets':
        return selectedDatasets.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Questionnaire</h1>
        <p className="text-muted-foreground">
          Upload your security questionnaire and let AI help generate answers
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Setup Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              const isAccessible = index <= currentStepIndex;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : isAccessible
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted/50 text-muted-foreground/50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="hidden sm:block">
                    <div className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 'upload' && (
          <UploadQuestionnaire onUpload={handleUpload} />
        )}

        {currentStep === 'mapping' && uploadData && (
          <FieldMapping
            columns={uploadData.columns}
            onMappingComplete={handleMappingComplete}
            initialMapping={fieldMapping}
          />
        )}

        {currentStep === 'datasets' && (
          <DatasetManager
            onDatasetSelect={handleDatasetSelection}
            selectedDatasets={selectedDatasets}
          />
        )}

        {currentStep === 'processing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Processing in Progress
              </CardTitle>
              <CardDescription>
                We're setting up your questionnaire and preparing the AI assistant
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="font-medium text-lg mb-2">Processing Your Questionnaire</h3>
              <p className="text-muted-foreground">
                This may take a few moments while we analyze your questions and prepare AI-powered answers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentStepIndex === 0 || processing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {currentStep === 'datasets' && (
            <Button
              onClick={handleProcessing}
              disabled={!canProceed() || processing}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : 'Start AI Processing'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
