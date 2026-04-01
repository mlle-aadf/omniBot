import React, { useState } from 'react';

const taskAIPairings: { [key: string]: string[] } = {
    "Search for Information": ["google/gemini-3-flash-preview", "openai/gpt-5.4-mini", "deepseek/deepseek-v3.2"],
    "Generate Text": ["anthropic/claude-sonnet-4-6", "openai/gpt-5.4-mini", "qwen/qwen3.5-27b"],
    "Summarize Content": ["anthropic/claude-sonnet-4-6", "openai/gpt-5.4-mini", "mistralai/mistral-small-2603"],
    "Translate Text": ["deepseek/deepseek-v3.2", "qwen/qwen3.5-flash-02-23", "z-ai/glm-4.7-flash"],
    "Generate Code": ["openai/gpt-5.4-mini", "deepseek/deepseek-v3.2-speciale", "mistralai/devstral-2512"],
    "Analyze Data": ["openai/gpt-5.4-mini", "deepseek/deepseek-v3.2", "allenai/olmo-3.1-32b-instruct"],
    "Make Predictions": ["openai/gpt-5.4-mini", "deepseek/deepseek-v3.2", "allenai/olmo-3.1-32b-think"],
};

interface TaskSelectorProps {
  onSelectedModelsChange: (models: string[]) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ onSelectedModelsChange }) => {
    const [selectedTask, setSelectedTask] = useState<string>('');

    const handleTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const task = event.target.value;
        setSelectedTask(task);
        onSelectedModelsChange(task ? taskAIPairings[task] : []);
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select a Task</h2>
            <select 
                value={selectedTask} 
                onChange={handleTaskChange} 
                className="w-full border border-purple-200 rounded-md p-2 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-purple-400"
            >
                <option value="">--Select a Task--</option>
                {Object.keys(taskAIPairings).map(task => (
                    <option key={task} value={task}>{task}</option>
                ))}
            </select>
        </div>
    );
};

export default TaskSelector;
