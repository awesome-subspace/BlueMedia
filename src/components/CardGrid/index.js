import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * 文档内的卡片导航网格。
 *
 * <CardGrid items={[{title, description, to, meta}]} />
 */
export default function CardGrid({items, columns = 2}) {
  return (
    <div className={styles.grid} data-columns={columns}>
      {items.map((item) => (
        <Link key={item.to} to={item.to} className={styles.card}>
          {item.meta && <span className={styles.meta}>{item.meta}</span>}
          <span className={styles.title}>{item.title}</span>
          <span className={styles.description}>{item.description}</span>
        </Link>
      ))}
    </div>
  );
}
