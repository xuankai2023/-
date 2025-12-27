/**
 * 格式化AI输出内容
 * 将Markdown格式转换为HTML
 */
export function formatAiOutput(content: string): string {
  let formatted = content;

  // 1. 处理标题格式
  formatted = formatted.replace(/^# (.*$)/gm, '<strong>$1</strong><br><br>');
  formatted = formatted.replace(/^## (.*$)/gm, '<strong>$1</strong><br>');

  // 2. 处理列表格式
  formatted = formatted.replace(/^- (.*$)/gm, '• $1<br>');
  formatted = formatted.replace(/^\d+\. (.*$)/gm, '• $1<br>');

  // 3. 处理换行和段落
  formatted = formatted.replace(/\n\n/g, '<br><br>');
  formatted = formatted.replace(/\n/g, '<br>');

  // 4. 处理代码块
  formatted = formatted.replace(
    /```([\s\S]*?)```/g,
    '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>'
  );

  // 5. 处理加粗
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 6. 处理斜体
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  return formatted;
}

