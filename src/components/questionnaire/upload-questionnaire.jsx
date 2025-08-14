"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/toast-provider';
import { Upload, FileSpreadsheet, File, X, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export function UploadQuestionnaire({ onUpload, onSheetSelection }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = async (selectedFile) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('File too large', {
        description: 'Please select a file smaller than 10MB.'
      });
      return;
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type', {
        description: 'Please select a CSV or Excel file.'
      });
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      if (selectedFile.type === 'text/csv') {
        await processCSV(selectedFile);
      } else {
        await processExcel(selectedFile);
      }
    } catch (error) {
      toast.error('Error processing file', {
        description: error.message || 'Could not read the file.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processCSV = async (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error('CSV parsing error: ' + result.errors[0].message));
            return;
          }

          const data = result.data;
          setSheets([{ name: 'Sheet1', data }]);
          setSelectedSheet('Sheet1');
          setPreview(data.slice(0, 5));
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const processExcel = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetsData = workbook.SheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) return null;

            const headers = jsonData[0];
            const rows = jsonData.slice(1).filter(row =>
              row.some(cell => cell !== null && cell !== undefined && cell !== '')
            );

            const formattedData = rows.map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });

            return {
              name: sheetName,
              data: formattedData
            };
          }).filter(Boolean);

          if (sheetsData.length === 0) {
            reject(new Error('No data found in the file'));
            return;
          }

          setSheets(sheetsData);

          if (sheetsData.length === 1) {
            setSelectedSheet(sheetsData[0].name);
            setPreview(sheetsData[0].data.slice(0, 5));
          }

          resolve();
        } catch (error) {
          reject(new Error('Failed to read Excel file: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSheetSelect = (sheetName) => {
    setSelectedSheet(sheetName);
    const sheet = sheets.find(s => s.name === sheetName);
    if (sheet) {
      setPreview(sheet.data.slice(0, 5));
      onSheetSelection?.(sheet);
    }
  };

  const handleUpload = () => {
    const sheet = sheets.find(s => s.name === selectedSheet);
    if (sheet && file) {
      onUpload?.({
        file,
        sheet: sheet.data,
        sheetName: selectedSheet,
        columns: Object.keys(sheet.data[0] || {})
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setSheets([]);
    setSelectedSheet('');
    setPreview(null);
  };

  if (file && sheets.length > 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                File Ready for Processing
              </CardTitle>
              <CardDescription>
                {file.name} • {(file.size / 1024).toFixed(1)} KB
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetUpload}>
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {sheets.length > 1 && (
            <div className="space-y-2">
              <Label>Select Sheet</Label>
              <div className="grid grid-cols-2 gap-2">
                {sheets.map((sheet) => (
                  <Button
                    key={sheet.name}
                    variant={selectedSheet === sheet.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSheetSelect(sheet.name)}
                  >
                    {sheet.name} ({sheet.data.length} rows)
                  </Button>
                ))}
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-2">
              <Label>Data Preview</Label>
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(preview[0] || {}).map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2">
                              {String(cell).substring(0, 50)}
                              {String(cell).length > 50 && '...'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing first 5 rows of {sheets.find(s => s.name === selectedSheet)?.data.length || 0} total rows
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            className="w-full"
            disabled={!selectedSheet}
          >
            <Upload className="h-4 w-4 mr-2" />
            Process Questionnaire
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Questionnaire
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel file containing your security questionnaire
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Processing file...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <File className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Supports CSV and Excel files up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
