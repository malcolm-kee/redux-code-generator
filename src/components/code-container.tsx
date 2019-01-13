import * as React from 'react';
import { CodeSnippetCollapsible } from './code-snippet';
import { Panel, PanelBody, PanelHeading, PanelTitle } from './panel';

export const CodeContainer: React.FunctionComponent<{
  title: string;
  code: string;
}> = ({ title, code }) => (
  <div className="col-xs-12 col-md-6">
    <Panel>
      <PanelHeading>
        <PanelTitle>{title}</PanelTitle>
      </PanelHeading>
      <PanelBody>
        <CodeSnippetCollapsible code={code} />
      </PanelBody>
    </Panel>
  </div>
);
