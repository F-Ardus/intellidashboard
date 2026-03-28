import styles from './TagPill.module.scss';

const TAG_COLORS = ['red', 'blue', 'purple', 'teal', 'gray'] as const;
type TagColor = (typeof TAG_COLORS)[number];

function getTagColor(tag: string): TagColor {
  const sum = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[sum % TAG_COLORS.length] as TagColor;
}

interface TagPillProps {
  tag: string;
}

export function TagPill({ tag }: TagPillProps) {
  return (
    <span className={`${styles.tag} ${styles[getTagColor(tag)]}`}>{tag}</span>
  );
}
