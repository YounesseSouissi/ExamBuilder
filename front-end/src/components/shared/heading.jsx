export default function Heading({
    title,
    description,
    className
  }) {
    return (
      <div className={className}>
        <h2 className="text-xl font-bold tracking-tight text-primary ">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  }