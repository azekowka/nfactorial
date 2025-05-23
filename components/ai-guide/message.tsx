'use client'

import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Citing } from '@/components/ai-guide/custom-link'
import { CodeBlock } from '@/components/ai-guide/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/ai-guide/ui/markdown'
import { ComponentPropsWithoutRef } from 'react'

export function BotMessage({
  message,
  className
}: {
  message: string
  className?: string
}) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    message || ''
  )

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(message || '')

  const plugins = containsLaTeX 
    ? {
        rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }], rehypeKatex as any],
        remarkPlugins: [remarkGfm, remarkMath]
      }
    : {
        rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
        remarkPlugins: [remarkGfm]
      }

  return (
    <MemoizedReactMarkdown
      {...plugins}
      className={cn(
        'prose prose-neutral dark:prose-invert',
        'prose-p:my-1.5 prose-headings:my-3',
        'prose-strong:font-semibold',
        'prose-li:my-0 pl-0',
        className
      )}
      components={{
        code({ node, inline, className, children, ...props }) {
          if (children.length) {
            if (children[0] == '▍') {
              return (
                <span className="mt-1 cursor-default animate-pulse">▍</span>
              )
            }

            children[0] = (children[0] as string).replace('`▍`', '▍')
          }

          const match = /language-(\w+)/.exec(className || '')

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ''}
              value={String(children).replace(/\n$/, '')}
              {...props}
            />
          )
        },
        a: Citing,
        p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
          <p className="my-1.5" {...props}>
            {children}
          </p>
        ),
        strong: ({ children, ...props }: ComponentPropsWithoutRef<'strong'>) => (
          <strong className="font-bold" {...props}>
            {children}
          </strong>
        ),
        ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => {
          // Remove non-DOM props that might be passed by react-markdown
          const { node, ordered, ...domProps } = props as any;
          
          return (
            <ul className="pl-6 ml-2 space-y-2" {...domProps}>
              {children}
            </ul>
          );
        },
        ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => {
          // Remove non-DOM props that might be passed by react-markdown
          const { node, ordered, ...domProps } = props as any;
          
          return (
            <ol className="pl-6 ml-2 space-y-2" {...domProps}>
              {children}
            </ol>
          );
        },
        li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => {
          // Check if first child is strong - this would be for the attraction names
          const hasStrongFirstChild = 
            children && 
            Array.isArray(children) && 
            children[0] && 
            typeof children[0] === 'object' && 
            'props' in children[0] && 
            children[0].type === 'strong';
          
          // Remove non-DOM props that might be passed by react-markdown
          const { node, ordered, checked, index, ...domProps } = props as any;
          
          return (
            <li className={`ml-0 ${hasStrongFirstChild ? 'mb-1.5' : ''}`} {...domProps}>
              {children}
            </li>
          );
        }
      }}
    >
      {message}
    </MemoizedReactMarkdown>
  )
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}
