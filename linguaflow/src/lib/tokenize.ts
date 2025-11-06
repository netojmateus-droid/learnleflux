
// A simple tokenizer that splits by spaces and punctuation
// This is a basic implementation and could be improved with more robust language-specific rules.
export const tokenize = (text: string): string[] => {
  // Regex to split by space, but also treat punctuation as separate tokens.
  // It handles words, numbers, and common punctuation.
  const tokens = text.match(/[\w']+|[.,!?;:"]/g) || [];
  return tokens;
};
   