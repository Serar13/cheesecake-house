import './ProductCard.css';
import './Skeleton.css';

/** Placeholder that mirrors the ProductCard footprint to avoid layout shift. */
export default function ProductCardSkeleton() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="product-info">
        <div className="skeleton skeleton-line skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton-footer">
          <div className="skeleton skeleton-price" />
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    </article>
  );
}
