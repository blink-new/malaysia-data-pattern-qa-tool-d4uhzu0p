import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, TestTube } from 'lucide-react';
import { PatternResult, testPattern } from '@/utils/malaysianPatterns';

interface PatternTesterProps {
  pattern: PatternResult;
  type: string;
}

export const PatternTester: React.FC<PatternTesterProps> = ({ pattern, type }) => {
  const [testValue, setTestValue] = useState('');
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTest = () => {
    const result = testPattern(pattern.pattern, testValue);
    setTestResult(result);
  };

  const handleExampleTest = (example: string) => {
    setTestValue(example);
    const result = testPattern(pattern.pattern, example);
    setTestResult(result);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          {type} Pattern Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pattern Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Regex Pattern:</p>
          <code className="text-sm bg-white px-2 py-1 rounded border">
            {pattern.pattern.source}
          </code>
          <p className="text-xs text-gray-600 mt-2">{pattern.description}</p>
        </div>

        {/* Test Input */}
        <div className="flex gap-2">
          <Input
            placeholder={`Enter ${type.toLowerCase()} to test...`}
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTest()}
          />
          <Button onClick={handleTest} disabled={!testValue.trim()}>
            Test
          </Button>
        </div>

        {/* Test Result */}
        {testResult !== null && (
          <div className="flex items-center gap-2">
            {testResult ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Match
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  No Match
                </Badge>
              </>
            )}
            <span className="text-sm text-gray-600">
              Pattern {testResult ? 'matches' : 'does not match'} the input
            </span>
          </div>
        )}

        {/* Examples */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Example {type}s:</p>
          <div className="flex flex-wrap gap-2">
            {pattern.examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleTest(example)}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};