import * as React from 'react';
import { CodeSnippetCollapsible } from './code-snippet';
import { Panel, PanelBody, PanelHeading, PanelTitle } from './panel';

export const CodeContainer: React.FunctionComponent<{
  title: string;
  code: string;
  language?: string;
}> = ({ title, code, language }) => (
  <div className="col-xs-12 col-md-6">
    <Panel>
      <PanelHeading>
        <PanelTitle>{title}</PanelTitle>
      </PanelHeading>
      <PanelBody>
        <CodeSnippetCollapsible code={code} language={language} />
      </PanelBody>
    </Panel>
  </div>
);
