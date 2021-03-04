import React from "react";
import Button from "components/ui/button";

const ButtonPreviewPage = () => {
  return (
    <div className="button-preview-page">
      <ProjectInfo />

      <h2 className="hdg--2 text-center mt-2 mb-2">Variations</h2>

      <h2 className="hdg--3 text-center mt-4 mb-4">Primary</h2>

      <div className="button-preview-page__grid">
        <PreviewRow description="Primary">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary with icon (left)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary with icon (right)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, no label (icon only)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary with icon (left), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary with icon (right), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, no label (icon only), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, as an <a> element">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, as an <a> element, with target blank">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Primary, as a <Link> element">
          <Button>Label</Button>
        </PreviewRow>
      </div>

      <h2 className="hdg--3 text-center mt-4 mb-4">Secondary</h2>

      <div className="button-preview-page__grid">
        <PreviewRow description="Secondary">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary with icon (left)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary with icon (right)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, no label (icon only)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary with icon (left), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary with icon (right), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, no label (icon only), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, as an <a> element">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, as an <a> element, with target blank">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Secondary, as a <Link> element">
          <Button>Label</Button>
        </PreviewRow>
      </div>

      <h2 className="hdg--3 text-center mt-4 mb-4">Tertiary</h2>

      <div className="button-preview-page__grid">
        <PreviewRow description="Tertiary">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary with icon (left)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary with icon (right)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, no label (icon only)">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary with icon (left), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary with icon (right), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, no label (icon only), disabled">
          <Button disabled>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, as an <a> element">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, as an <a> element, with target blank">
          <Button>Label</Button>
        </PreviewRow>

        <PreviewRow description="Tertiary, as a <Link> element">
          <Button>Label</Button>
        </PreviewRow>
      </div>
    </div>
  );
};

export default ButtonPreviewPage;

const PreviewRow = ({ description, children }) => (
  <>
    <div>{description}</div>
    <div>{children}</div>
  </>
);

const ProjectInfo = () => (
  <>
    <h1 className="hdg--1 text-center mt-2 mb-2">&lt;Button /&gt; Component</h1>

    <ul className="ml-4 mr-4">
      <li>
        Each button should include: default, hover, pressed (active/focus),
        disabled states
      </li>
    </ul>

    <div className="button-preview-page__grid button-preview-page__grid--instructions">
      <div>Each button should by default, render as a {`<button>`} element</div>
      <CodeSnippet
        code={`<button onClick={() => console.log("Clicked")} className="button ...">Submit</button>`}
      />

      <div>
        Each button should take props to render as an {`<a>`} element with href
        link
      </div>
      <CodeSnippet
        code={`<a href="https://www.google.com" className="button ...">Submit</a>`}
      />

      <div>
        Each button should take props to render as an {`<a>`} element, with href
        link and target blank
      </div>
      <CodeSnippet
        code={`<a href="https://www.https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="button ...">Submit</a>`}
      />

      <div>
        Each button should take props to render as a React Router {`<Link>`}{" "}
        element, with a `to=` value as a target
      </div>
      <CodeSnippet code={`<Link to="/" className="button ...">Home</Link>`} />
    </div>
  </>
);

const CodeSnippet = ({ code }) => (
  <div>
    <pre>
      <code>{code}</code>
    </pre>
  </div>
);
