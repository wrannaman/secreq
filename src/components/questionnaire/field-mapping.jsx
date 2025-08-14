"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const SYSTEM_FIELDS = [
  { key: 'question', label: 'Question', required: true, description: 'The question text' },
  { key: 'answer', label: 'Answer', required: false, description: 'Existing answer (optional)' },
  { key: 'section', label: 'Section', required: false, description: 'Question category/section' },
  { key: 'row_number', label: 'Row Number', required: false, description: 'Original row number' },
  { key: 'reference', label: 'Reference', required: false, description: 'Question reference/ID' },
  { key: 'compliance_framework', label: 'Framework', required: false, description: 'Compliance framework (SOC2, ISO27001, etc.)' },
  { key: 'evidence_required', label: 'Evidence Required', required: false, description: 'Whether evidence is needed' },
  { key: 'ignore', label: 'Ignore', required: false, description: 'Skip this column' }
];

export function FieldMapping({ columns, onMappingComplete, initialMapping = {} }) {
  const [mapping, setMapping] = useState(initialMapping);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const hasQuestion = Object.values(mapping).includes('question');
    setIsValid(hasQuestion);
  }, [mapping]);

  const handleFieldMapping = (column, systemField) => {
    const newMapping = { ...mapping };

    // Remove any existing mapping to this system field
    Object.keys(newMapping).forEach(key => {
      if (newMapping[key] === systemField) {
        delete newMapping[key];
      }
    });

    // Set new mapping
    if (systemField && systemField !== 'ignore') {
      newMapping[column] = systemField;
    } else {
      delete newMapping[column];
    }

    setMapping(newMapping);
  };

  const getUsedFields = () => {
    return Object.values(mapping).filter(field => field !== 'ignore');
  };

  const isFieldUsed = (field) => {
    return getUsedFields().includes(field);
  };

  const getMappedColumn = (field) => {
    return Object.keys(mapping).find(col => mapping[col] === field);
  };

  const handleAutoMapping = () => {
    const autoMapping = {};
    const usedSystemFields = [];

    // Auto-map based on common column names
    const mappingHints = [
      { keywords: ['question', 'query', 'q'], field: 'question' },
      { keywords: ['answer', 'response', 'reply', 'a'], field: 'answer' },
      { keywords: ['section', 'category', 'domain', 'area'], field: 'section' },
      { keywords: ['row', 'number', 'index', '#'], field: 'row_number' },
      { keywords: ['reference', 'ref', 'id', 'identifier'], field: 'reference' },
      { keywords: ['framework', 'standard', 'compliance'], field: 'compliance_framework' },
      { keywords: ['evidence', 'proof', 'documentation'], field: 'evidence_required' }
    ];

    columns.forEach(column => {
      const lowerColumn = column.toLowerCase();

      for (const hint of mappingHints) {
        if (hint.keywords.some(keyword => lowerColumn.includes(keyword)) &&
          !usedSystemFields.includes(hint.field)) {
          autoMapping[column] = hint.field;
          usedSystemFields.push(hint.field);
          break;
        }
      }
    });

    setMapping(autoMapping);
  };

  const handleComplete = () => {
    onMappingComplete?.(mapping);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Field Mapping
            </CardTitle>
            <CardDescription>
              Map your spreadsheet columns to system fields
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAutoMapping}>
            Auto-Map Fields
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Validation Status */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          {isValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          <span className="text-sm font-medium">
            {isValid ? 'Mapping is valid' : 'Question field is required'}
          </span>
        </div>

        {/* Column Mappings */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Column Mappings</Label>
          <div className="grid gap-4">
            {columns.map((column) => (
              <div key={column} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{column}</div>
                  <div className="text-sm text-muted-foreground">
                    Original column name
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />

                <div className="flex-1">
                  <Select
                    value={mapping[column] || ''}
                    onValueChange={(value) => handleFieldMapping(column, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ignore">
                        <span className="text-muted-foreground">Ignore this column</span>
                      </SelectItem>
                      {SYSTEM_FIELDS.map((field) => (
                        <SelectItem
                          key={field.key}
                          value={field.key}
                          disabled={isFieldUsed(field.key)}
                        >
                          <div className="flex items-center gap-2">
                            <span>{field.label}</span>
                            {field.required && (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            )}
                            {isFieldUsed(field.key) && (
                              <Badge variant="outline" className="text-xs">Used</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {mapping[column] && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {SYSTEM_FIELDS.find(f => f.key === mapping[column])?.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Fields Overview */}
        <div className="space-y-4">
          <Label className="text-base font-medium">System Fields Status</Label>
          <div className="grid grid-cols-2 gap-3">
            {SYSTEM_FIELDS.filter(field => field.key !== 'ignore').map((field) => {
              const mappedColumn = getMappedColumn(field.key);
              const isMapped = !!mappedColumn;

              return (
                <div
                  key={field.key}
                  className={`p-3 rounded-lg border ${isMapped ? 'bg-green-50 border-green-200' :
                    field.required ? 'bg-red-50 border-red-200' :
                      'bg-muted/50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{field.label}</div>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isMapped ? `Mapped to: ${mappedColumn}` : 'Not mapped'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleComplete}
          disabled={!isValid}
          className="w-full"
          size="lg"
        >
          Continue to Dataset Selection
        </Button>
      </CardContent>
    </Card>
  );
}
