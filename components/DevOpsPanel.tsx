import React from 'react';
import { DEVOPS_FILES } from '../constants';

const CodeBlock: React.FC<{ title: string; code: string; lang: string }> = ({ title, code, lang }) => (
  <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden bg-gray-900 text-white shadow-lg">
    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
      <span className="font-mono text-sm font-bold text-gray-300">{title}</span>
      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">{lang}</span>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-xs md:text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

const DevOpsPanel: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">DevOps & Backend Configuration</h2>
        <p className="text-gray-600">
          Since this is a client-side React demo, the actual Backend, Docker, and Jenkins configurations are provided below as reference implementations.
        </p>
      </div>

      <CodeBlock title="backend/app.py (Flask + DynamoDB + SNS)" code={DEVOPS_FILES.backendPy} lang="Python" />
      <CodeBlock title="Dockerfile" code={DEVOPS_FILES.dockerfile} lang="Docker" />
      <CodeBlock title="docker-compose.yml" code={DEVOPS_FILES.dockerCompose} lang="YAML" />
      <CodeBlock title="Jenkinsfile (CI/CD Pipeline)" code={DEVOPS_FILES.jenkinsfile} lang="Groovy" />
      <CodeBlock title="tests/selenium_test.py" code={DEVOPS_FILES.seleniumTest} lang="Python" />
      
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4">
          <h4 className="font-bold text-blue-800">Architecture Overview</h4>
          <p className="text-sm text-blue-700 mt-2">
            The system uses <strong>React</strong> for the Frontend interfaces. 
            The Backend is designed for <strong>Python/Flask</strong> deployed on <strong>AWS ECS</strong>.
            Data is stored in <strong>DynamoDB</strong> (Orders, Menu) and status updates trigger <strong>AWS SNS</strong> notifications for customers.
            CI/CD is handled by <strong>Jenkins</strong> pushing to <strong>ECR</strong>.
          </p>
      </div>
    </div>
  );
};

export default DevOpsPanel;