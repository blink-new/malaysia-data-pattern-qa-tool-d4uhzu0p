import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, MessageSquare, Download, BarChart3 } from 'lucide-react';
import { TestCase, calculateAccuracy, AccuracyMetrics } from '@/utils/malaysianPatterns';

interface QAInterfaceProps {
  testCases: TestCase[];
  type: 'name' | 'phone' | 'email';
}

interface Annotation {
  match: boolean;
  comment: string;
}

export const QAInterface: React.FC<QAInterfaceProps> = ({ testCases, type }) => {
  const [annotations, setAnnotations] = useState<Record<string, Annotation>>({});
  const [showMetrics, setShowMetrics] = useState(false);

  const filteredTestCases = testCases.filter(testCase => testCase.type === type);

  const handleAnnotation = (testCaseId: string, match: boolean) => {
    setAnnotations(prev => ({
      ...prev,
      [testCaseId]: {
        ...prev[testCaseId],
        match
      }
    }));
  };

  const handleComment = (testCaseId: string, comment: string) => {
    setAnnotations(prev => ({
      ...prev,
      [testCaseId]: {
        ...prev[testCaseId],
        comment
      }
    }));
  };

  const metrics: AccuracyMetrics = useMemo(() => {
    const annotationMatches: Record<string, boolean> = {};
    Object.entries(annotations).forEach(([id, annotation]) => {
      annotationMatches[id] = annotation.match;
    });
    return calculateAccuracy(filteredTestCases, annotationMatches);
  }, [filteredTestCases, annotations]);

  const progress = (Object.keys(annotations).length / filteredTestCases.length) * 100;

  const exportResults = () => {
    const results = filteredTestCases.map(testCase => ({
      id: testCase.id,
      value: testCase.value,
      expected: testCase.expectedMatch,
      annotated: annotations[testCase.id]?.match,
      comment: annotations[testCase.id]?.comment || '',
      category: testCase.category
    }));

    const dataStr = JSON.stringify({
      type,
      results,
      metrics,
      timestamp: new Date().toISOString()
    }, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-results-${type}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Progress and Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              QA Progress - {type.charAt(0).toUpperCase() + type.slice(1)}s
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? 'Hide' : 'Show'} Metrics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
                disabled={Object.keys(annotations).length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Annotated: {Object.keys(annotations).length} / {filteredTestCases.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {showMetrics && Object.keys(annotations).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(metrics.accuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(metrics.precision * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Precision</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {(metrics.recall * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Recall</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(metrics.f1Score * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">F1 Score</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Cases */}
      <div className="space-y-4">
        {filteredTestCases.map((testCase) => {
          const annotation = annotations[testCase.id];
          const isCorrect = annotation?.match === testCase.expectedMatch;
          
          return (
            <Card key={testCase.id} className="border-l-4 border-l-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {testCase.category}
                      </Badge>
                      <Badge 
                        variant={testCase.expectedMatch ? "default" : "secondary"}
                        className="text-xs"
                      >
                        Expected: {testCase.expectedMatch ? 'Match' : 'No Match'}
                      </Badge>
                      {annotation && (
                        <Badge 
                          variant={isCorrect ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="font-mono text-sm bg-gray-50 p-2 rounded mb-3">
                      {testCase.value}
                    </div>

                    {/* Annotation Controls */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Pattern Match:</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle 
                            className={`h-5 w-5 cursor-pointer ${
                              annotation?.match === true ? 'text-green-500' : 'text-gray-300'
                            }`}
                            onClick={() => handleAnnotation(testCase.id, true)}
                          />
                          <XCircle 
                            className={`h-5 w-5 cursor-pointer ${
                              annotation?.match === false ? 'text-red-500' : 'text-gray-300'
                            }`}
                            onClick={() => handleAnnotation(testCase.id, false)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Comments:</span>
                      </div>
                      <Textarea
                        placeholder="Add your analysis or notes..."
                        value={annotation?.comment || ''}
                        onChange={(e) => handleComment(testCase.id, e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};