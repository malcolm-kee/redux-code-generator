import * as React from 'react';
import { CodeSnippetCollapsible } from './code-snippet';
import { Panel, PanelBody, PanelHeading, PanelTitle } from './panel';

export const CodeContainer: React.FunctionComponent<{
  title: string;
  code: string;
  language?: string;
  id?: string;
}> = (props) => (
  <div className="col-xs-12 col-md-6">
    <Panel>
      <PanelHeading>
        <PanelTitle>{props.title}</PanelTitle>
      </PanelHeading>
      <PanelBody>
        <CodeSnippetCollapsible code={props.code} language={props.language} />
      </PanelBody>
    </Panel>
    <div id={props.id} hidden>
      {props.code}
    </div>
  </div>
);
