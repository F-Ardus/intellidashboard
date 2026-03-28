import styles from './SkeletonRow.module.scss';

export function SkeletonRow() {
  return (
    <tr className={styles.row}>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 160 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 60 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 56 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 100 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 80 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 70 }} /></td>
      <td className={styles.cell}><div className={styles.bone} style={{ width: 120 }} /></td>
    </tr>
  );
}
