import { Text } from '@components/primitives/text';

export default function TypographyPage() {
  return (
    <div className="flex flex-col gap-8 py-8 max-w-[65ch]">
      <Text as="p" variant="caption">
        Caption text used for small supporting information or metadata.
      </Text>

      <Text as="p" variant="body-xs">
        Extra small body text useful for dense UI areas where space is limited.
      </Text>

      <Text as="p" variant="body-sm">
        Small body text often appears in secondary descriptions, hints, or helper content.
      </Text>

      <Text as="p" variant="body">
        This paragraph demonstrates the default body style. It is intentionally longer so you can
        evaluate the readability, rhythm, and line length of the typography system. When text
        stretches too wide across the screen, reading becomes harder, so limiting the measure helps
        maintain comfortable scanning and improves the overall reading experience.
      </Text>

      <Text as="p" variant="body-lg">
        Larger body text works well for introductory paragraphs or highlighted descriptions that
        need a little more visual emphasis without becoming a heading.
      </Text>

      <Text as="p" variant="heading-sm">
        Small heading style rendered as a paragraph for visual testing.
      </Text>

      <Text as="p" variant="heading-md">
        Medium heading style rendered as a paragraph for inspection.
      </Text>

      <Text as="p" variant="heading-lg">
        Large heading style rendered as a paragraph.
      </Text>

      <Text as="p" variant="heading-xl">
        Extra large heading style rendered as paragraph content.
      </Text>

      <Text as="p" variant="code">
        const message = "Code styled text rendered in a paragraph.";
      </Text>
    </div>
  );
}
