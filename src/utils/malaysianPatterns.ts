// Malaysian data pattern recognition utilities

export interface PatternResult {
  pattern: RegExp;
  description: string;
  examples: string[];
}

// Malaysian Name Patterns
export const malaysianNamePatterns: PatternResult = {
  pattern: /^[A-Za-z\s'.-]{2,50}$/,
  description: "Malaysian names (Malay, Chinese, Indian) - supports letters, spaces, apostrophes, hyphens, and dots",
  examples: [
    "Ahmad bin Abdullah",
    "Siti Nurhaliza",
    "Lim Wei Ming",
    "Tan Ah Kow",
    "Rajesh s/o Krishnan",
    "Priya d/o Raman",
    "Muhammad Al-Fatih",
    "Lee Chong Wei"
  ]
};

// Malaysian Phone Number Patterns
export const malaysianPhonePatterns: PatternResult = {
  pattern: /^(\+?6?0?1[0-9]-?[0-9]{7,8}|(\+?6?0?[3-9])-?[0-9]{7,8})$/,
  description: "Malaysian phone numbers - supports +60, 60, 0 prefixes with mobile (01x) and landline formats",
  examples: [
    "+60123456789",
    "60123456789",
    "0123456789",
    "012-3456789",
    "+603-12345678",
    "03-12345678",
    "082-123456",
    "019-1234567"
  ]
};

// Email Pattern (Standard)
export const emailPatterns: PatternResult = {
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  description: "Standard email address format",
  examples: [
    "user@example.com",
    "ahmad.ibrahim@gmail.com",
    "siti123@yahoo.com.my",
    "lim.wei@company.my",
    "test.email+tag@domain.co.uk"
  ]
};

// Test if a value matches a pattern
export const testPattern = (pattern: RegExp, value: string): boolean => {
  return pattern.test(value.trim());
};

// Generate test dataset
export interface TestCase {
  id: string;
  value: string;
  type: 'name' | 'phone' | 'email';
  expectedMatch: boolean;
  category: string;
}

export const generateTestDataset = (): TestCase[] => {
  const testCases: TestCase[] = [];
  let id = 1;

  // Malaysian Names - Positive cases
  const positiveNames = [
    "Ahmad bin Abdullah",
    "Siti Nurhaliza binti Ahmad",
    "Lim Wei Ming",
    "Tan Ah Kow",
    "Rajesh s/o Krishnan",
    "Priya d/o Raman",
    "Muhammad Al-Fatih",
    "Lee Chong Wei",
    "Nurul Ain",
    "Wong Kar Wai",
    "Deepika Padukone",
    "Aziz bin Omar",
    "Fatimah Az-Zahra",
    "Chen Li Hua",
    "Ravi Kumar",
    "Aminah bte Hassan"
  ];

  // Malaysian Names - Negative cases
  const negativeNames = [
    "123Ahmad",
    "User@Name",
    "A",
    "Name with numbers 123",
    "Special#Characters",
    "VeryLongNameThatExceedsTheTypicalLengthLimitForMalaysianNames",
    "",
    "Name_with_underscore",
    "Name%with%percent"
  ];

  // Add name test cases
  positiveNames.forEach(name => {
    testCases.push({
      id: `name-${id++}`,
      value: name,
      type: 'name',
      expectedMatch: true,
      category: 'Valid Malaysian Name'
    });
  });

  negativeNames.forEach(name => {
    testCases.push({
      id: `name-${id++}`,
      value: name,
      type: 'name',
      expectedMatch: false,
      category: 'Invalid Name Format'
    });
  });

  // Malaysian Phone Numbers - Positive cases
  const positivePhones = [
    "+60123456789",
    "60123456789",
    "0123456789",
    "012-3456789",
    "+603-12345678",
    "03-12345678",
    "082-123456",
    "019-1234567",
    "017-8901234",
    "016-7654321",
    "04-1234567",
    "07-3456789"
  ];

  // Malaysian Phone Numbers - Negative cases
  const negativePhones = [
    "123456",
    "+1234567890",
    "abc123456789",
    "012345",
    "+60-12-345-6789",
    "60 123 456 789",
    "012.345.6789",
    "++60123456789",
    "601234567890123"
  ];

  // Add phone test cases
  positivePhones.forEach(phone => {
    testCases.push({
      id: `phone-${id++}`,
      value: phone,
      type: 'phone',
      expectedMatch: true,
      category: 'Valid Malaysian Phone'
    });
  });

  negativePhones.forEach(phone => {
    testCases.push({
      id: `phone-${id++}`,
      value: phone,
      type: 'phone',
      expectedMatch: false,
      category: 'Invalid Phone Format'
    });
  });

  // Email Addresses - Positive cases
  const positiveEmails = [
    "user@example.com",
    "ahmad.ibrahim@gmail.com",
    "siti123@yahoo.com.my",
    "lim.wei@company.my",
    "test.email+tag@domain.co.uk",
    "user_name@domain.org",
    "firstname.lastname@company.com.my",
    "admin@gov.my",
    "support@bank.com.my"
  ];

  // Email Addresses - Negative cases
  const negativeEmails = [
    "invalid.email",
    "@domain.com",
    "user@",
    "user name@domain.com",
    "user@domain",
    "user@@domain.com",
    "user@.com",
    ".user@domain.com",
    "user@domain..com"
  ];

  // Add email test cases
  positiveEmails.forEach(email => {
    testCases.push({
      id: `email-${id++}`,
      value: email,
      type: 'email',
      expectedMatch: true,
      category: 'Valid Email'
    });
  });

  negativeEmails.forEach(email => {
    testCases.push({
      id: `email-${id++}`,
      value: email,
      type: 'email',
      expectedMatch: false,
      category: 'Invalid Email Format'
    });
  });

  return testCases;
};

// Calculate accuracy metrics
export interface AccuracyMetrics {
  totalCases: number;
  correctPredictions: number;
  accuracy: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export const calculateAccuracy = (
  testCases: TestCase[],
  annotations: Record<string, boolean>
): AccuracyMetrics => {
  let truePositives = 0;
  let trueNegatives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  testCases.forEach(testCase => {
    const predicted = annotations[testCase.id];
    const actual = testCase.expectedMatch;

    if (predicted !== undefined) {
      if (predicted && actual) truePositives++;
      else if (!predicted && !actual) trueNegatives++;
      else if (predicted && !actual) falsePositives++;
      else if (!predicted && actual) falseNegatives++;
    }
  });

  const totalCases = truePositives + trueNegatives + falsePositives + falseNegatives;
  const correctPredictions = truePositives + trueNegatives;
  const accuracy = totalCases > 0 ? correctPredictions / totalCases : 0;
  
  const precision = (truePositives + falsePositives) > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = (truePositives + falseNegatives) > 0 ? truePositives / (truePositives + falseNegatives) : 0;
  const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

  return {
    totalCases,
    correctPredictions,
    accuracy,
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives,
    precision,
    recall,
    f1Score
  };
};