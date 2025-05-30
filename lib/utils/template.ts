// Function to extract variables from a template string
export function extractVariables(template: string): string[] {
  const regex = /{{([^{}]+)}}/g;
  const matches = template.match(regex);
  
  if (!matches) return [];
  
  return matches
    .map(match => match.slice(2, -2).trim())
    .filter((value, index, self) => self.indexOf(value) === index);
}

// Function to replace variables in a template
export function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value || `{{${key}}}`);
  });
  
  return result;
}

// Function to highlight unused variables
export function highlightUnusedVariables(template: string, variables: Record<string, string>): string[] {
  const templateVars = extractVariables(template);
  const unusedVars: string[] = [];
  
  Object.keys(variables).forEach(key => {
    if (!templateVars.includes(key)) {
      unusedVars.push(key);
    }
  });
  
  return unusedVars;
}

// Function to insert a variable at cursor position
export function insertVariableAtCursor(
  template: string, 
  variable: string, 
  cursorPosition: number
): { newTemplate: string; newCursorPosition: number } {
  const variableText = `{{${variable}}}`;
  const newTemplate = 
    template.substring(0, cursorPosition) + 
    variableText + 
    template.substring(cursorPosition);
  
  const newCursorPosition = cursorPosition + variableText.length;
  
  return { newTemplate, newCursorPosition };
}

// Export template as JSON
export function exportTemplateAsJson(
  templateName: string, 
  templateContent: string, 
  variables: Record<string, string>
): string {
  const templateData = {
    name: templateName,
    content: templateContent,
    variables
  };
  
  return JSON.stringify(templateData, null, 2);
}

// Import template from JSON
export function importTemplateFromJson(jsonString: string): {
  name: string;
  content: string;
  variables: Record<string, string>;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.name === 'string' &&
      typeof parsed.content === 'string' &&
      typeof parsed.variables === 'object'
    ) {
      return {
        name: parsed.name,
        content: parsed.content,
        variables: parsed.variables
      };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}