import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import MDXContent from "@theme/MDXContent";
import styles from "./styles.module.css";

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  return !frontMatter.hide_title && typeof contentTitle === "undefined"
    ? metadata.title
    : null;
}

export default function DocItemContent({ children }) {
  const syntheticTitle = useSyntheticTitle();
  const { metadata } = useDoc();
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
      <div className={styles.agentActions} aria-label="机器可读版本">
        <Link to={`/markdown/${metadata.id}.md`} data-noBrokenLinkCheck>
          查看 Markdown
        </Link>
        <Link to="/openapi.yaml" data-noBrokenLinkCheck>
          OpenAPI 3.1
        </Link>
      </div>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
