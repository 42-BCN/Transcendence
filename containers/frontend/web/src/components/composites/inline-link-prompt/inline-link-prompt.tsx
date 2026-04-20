import { Stack, Text, InternalLink } from '@components';

type InlineLinkPromptProps = {
  text: string;
  linkLabel: string;
  href: string;
};

export function InlineLinkPrompt({ text, linkLabel, href }: InlineLinkPromptProps) {
  return (
    <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
      <Text as="span" variant="caption">
        {text}
      </Text>
      <InternalLink href={href}>{linkLabel}</InternalLink>
    </Stack>
  );
}
