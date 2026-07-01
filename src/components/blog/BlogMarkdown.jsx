import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function isCallout(children) {
  const first = Array.isArray(children) ? children[0] : children;
  if (typeof first === 'string') return first.startsWith('Callout:');
  if (first?.props?.children) return isCallout(first.props.children);
  return false;
}

function stripCalloutPrefix(children) {
  const arr = Children.toArray(children);
  if (!arr.length) return children;
  const first = arr[0];
  if (typeof first === 'string' && first.startsWith('Callout:')) {
    return [first.replace(/^Callout:\s*/, ''), ...arr.slice(1)];
  }
  return children;
}

const components = {
  h2({ children, ...props }) {
    const id = slugify(String(children));
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    const id = slugify(String(children));
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    );
  },
  a({ href, children, ...props }) {
    const external = href?.startsWith('http');
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>
        {children}
      </a>
    );
  },
  blockquote({ children, ...props }) {
    if (isCallout(children)) {
      return (
        <aside className="blog-callout" {...props}>
          {stripCalloutPrefix(children)}
        </aside>
      );
    }
    return <blockquote {...props}>{children}</blockquote>;
  },
  pre({ children, ...props }) {
    return (
      <pre {...props}>
        {children}
      </pre>
    );
  },
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
};

export default function BlogMarkdown({ content }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
