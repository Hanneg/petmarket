export default function CategoryCard({ name, image, onClick, className = "" }) {
  return (
    <div
      className={`category-card card pointer hoverable center-align p-0 ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="category-img-wrapper">
        <img src={image} alt={name} />
      </div>
      <div className="p-2">
        <h6 className="text-center text-secondary font-w800 m-0">{name}</h6>
      </div>
    </div>
  );
}
